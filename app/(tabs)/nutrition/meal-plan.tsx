import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { CalendarDays, Sparkles } from 'lucide-react-native';

import { LoadingState } from '@/components/ui/LoadingState';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { todayISODate } from '@/lib/date';
import { MEAL_LABEL } from '@/lib/nutrition-labels';
import { entriesForDate } from '@/lib/nutrition-totals';
import { useMealPlanStore } from '@/stores/meal-plan.store';
import { useNutritionStore } from '@/stores/nutrition.store';
import { useProfileStore } from '@/stores/profile.store';
import { useThemeColors } from '@/theme/use-theme-colors';
import type { MealPlanDay } from '@/data/models/nutrition';
import type { MealSlot } from '@/data/models/user';

const DAY_NAMES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

function dayLabel(dateISO: string, todayISO: string): string {
  const [y, m, d] = dateISO.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const weekday = DAY_NAMES[date.getDay()];
  return dateISO === todayISO ? `Hoy · ${weekday}` : `${weekday} ${date.getDate()}`;
}

export default function MealPlanScreen() {
  const colors = useThemeColors();
  const profile = useProfileStore((s) => s.profile);
  const { foods, entries, isLoaded: isFoodsLoaded, load: loadFoods, logFood } = useNutritionStore();
  const { plan, isLoaded: isPlanLoaded, load: loadPlan, generate } = useMealPlanStore();
  const [generating, setGenerating] = useState(false);
  const [loggingDay, setLoggingDay] = useState<string | null>(null);

  useEffect(() => {
    if (!isFoodsLoaded) loadFoods();
    if (!isPlanLoaded) loadPlan();
  }, [isFoodsLoaded, loadFoods, isPlanLoaded, loadPlan]);

  const foodById = new Map(foods.map((f) => [f.id, f]));
  const today = todayISODate();

  async function handleGenerate() {
    if (!profile) return;
    setGenerating(true);
    await generate(profile, foods);
    setGenerating(false);
  }

  function isDayLogged(day: MealPlanDay): boolean {
    const dayEntries = entriesForDate(entries, day.date);
    return Object.entries(day.meals).every(
      ([meal, item]) => item && dayEntries.some((e) => e.mealType === meal && e.foodId === item.foodId)
    );
  }

  async function handleLogDay(day: MealPlanDay) {
    setLoggingDay(day.date);
    const mealEntries = Object.entries(day.meals) as [MealSlot, { foodId: string; servings: number }][];
    for (const [meal, item] of mealEntries) {
      await logFood(item.foodId, meal, item.servings, day.date);
    }
    setLoggingDay(null);
  }

  const isLoading = !isFoodsLoaded || !isPlanLoaded;

  return (
    <Screen>
      <ScreenHeader
        title="Plan de comidas"
        rightSlot={
          plan ? (
            <Pressable
              onPress={handleGenerate}
              disabled={generating}
              hitSlop={8}
              accessibilityLabel="Regenerar plan"
            >
              <Sparkles color={colors.primary} size={20} />
            </Pressable>
          ) : undefined
        }
      />

      {isLoading ? (
        <LoadingState />
      ) : !plan ? (
        <View className="items-center pt-8">
          <View className="w-20 h-20 rounded-full bg-primary/15 items-center justify-center mb-5">
            <CalendarDays color={colors.primary} size={32} />
          </View>
          <Text className="font-body-semibold text-fg text-lg text-center mb-1">
            Alcanza tus metas más rápido
          </Text>
          <Text className="font-body text-muted text-sm text-center mb-8 px-4">
            Genera un plan de comidas semanal ajustado a tus calorías y macros objetivo.
          </Text>
          <PrimaryButton
            label={generating ? 'Generando...' : 'Generar plan semanal'}
            onPress={handleGenerate}
            disabled={generating}
          />
        </View>
      ) : (
        plan.days.map((day) => {
          const mealEntries = Object.entries(day.meals) as [MealSlot, { foodId: string; servings: number }][];
          const dayCalories = mealEntries.reduce((sum, [, item]) => {
            const food = foodById.get(item.foodId);
            return sum + (food ? food.caloriesPerServing * item.servings : 0);
          }, 0);
          const alreadyLogged = isDayLogged(day);

          return (
            <View key={day.date} className="bg-muted/30 border border-border rounded-2xl px-4 py-4 mb-3">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="font-body-semibold text-fg text-base">{dayLabel(day.date, today)}</Text>
                <Text className="font-body text-muted text-sm">{Math.round(dayCalories)} kcal</Text>
              </View>

              {mealEntries.map(([meal, item]) => {
                const food = foodById.get(item.foodId);
                if (!food) return null;
                return (
                  <View key={meal} className="flex-row justify-between items-center py-1.5 border-b border-border">
                    <View className="flex-1 pr-2">
                      <Text className="font-body text-muted text-xs">{MEAL_LABEL[meal]}</Text>
                      <Text className="font-body-medium text-fg text-sm">{food.name}</Text>
                    </View>
                    <Text className="font-body text-muted text-xs">
                      {Math.round(food.caloriesPerServing * item.servings)} kcal
                    </Text>
                  </View>
                );
              })}

              <Pressable
                onPress={() => handleLogDay(day)}
                disabled={alreadyLogged || loggingDay === day.date}
                className={`mt-3 rounded-xl py-2.5 items-center ${
                  alreadyLogged ? 'bg-accent/15' : 'bg-primary/15 active:opacity-80'
                }`}
              >
                <Text className={`font-body-semibold text-sm ${alreadyLogged ? 'text-accent' : 'text-primary'}`}>
                  {alreadyLogged
                    ? 'Registrado ✓'
                    : loggingDay === day.date
                      ? 'Registrando...'
                      : 'Registrar comidas de este día'}
                </Text>
              </Pressable>
            </View>
          );
        })
      )}
    </Screen>
  );
}
