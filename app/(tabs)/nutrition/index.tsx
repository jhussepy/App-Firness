import { useEffect, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Camera, CalendarDays } from 'lucide-react-native';

import { CalorieSummaryCard } from '@/components/nutrition/CalorieSummaryCard';
import { DayStrip } from '@/components/nutrition/DayStrip';
import { FoodDetailModal } from '@/components/nutrition/FoodDetailModal';
import { MealSection } from '@/components/nutrition/MealSection';
import { LoadingState } from '@/components/ui/LoadingState';
import { Screen } from '@/components/ui/Screen';
import { toLocalISODate, todayISODate } from '@/lib/date';
import { entriesForDate, entriesForMeal, macroTargetsToTotals, totalsForEntries } from '@/lib/nutrition-totals';
import { MEAL_LABEL } from '@/lib/nutrition-labels';
import { useNutritionStore } from '@/stores/nutrition.store';
import { useProfileStore } from '@/stores/profile.store';
import { useThemeColors } from '@/theme/use-theme-colors';

export default function NutritionScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const profile = useProfileStore((s) => s.profile);
  const loadProfile = useProfileStore((s) => s.load);
  const { foods, entries, isLoaded, load, removeEntry, updateEntryServings } = useNutritionStore();
  const [selectedDate, setSelectedDate] = useState(todayISODate());
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded) load();
    loadProfile();
  }, [isLoaded, load, loadProfile]);

  const todaysEntries = useMemo(() => entriesForDate(entries, selectedDate), [entries, selectedDate]);
  const consumed = useMemo(() => totalsForEntries(todaysEntries, foods), [todaysEntries, foods]);
  const target = useMemo(
    () =>
      macroTargetsToTotals(
        profile?.dailyMacroTargets ?? { proteinG: 0, carbG: 0, fatG: 0 },
        profile?.dailyCalorieTarget ?? 0
      ),
    [profile]
  );
  const loggedDates = useMemo(
    () => new Set(entries.map((e) => toLocalISODate(new Date(e.loggedAt)))),
    [entries]
  );
  const meals = profile?.includedMeals ?? ['breakfast', 'lunch', 'dinner'];

  const selectedEntry = entries.find((e) => e.id === selectedEntryId);
  const selectedFood = foods.find((f) => f.id === selectedEntry?.foodId);

  return (
    <Screen>
      <View className="pt-4 pb-3 flex-row items-center justify-between">
        <Text className="font-display-bold text-3xl text-fg">Nutrición</Text>
        <View className="flex-row items-center gap-2">
          <Pressable
            onPress={() => router.push('/(tabs)/nutrition/meal-plan')}
            accessibilityLabel="Plan de comidas"
            className="w-10 h-10 rounded-full bg-muted/30 border border-border items-center justify-center active:opacity-80"
          >
            <CalendarDays color={colors.primary} size={20} />
          </Pressable>
          <Pressable
            onPress={() => router.push({ pathname: '/(tabs)/nutrition/scan', params: { date: selectedDate } })}
            accessibilityLabel="Escanear comida"
            className="w-10 h-10 rounded-full bg-primary items-center justify-center active:opacity-85"
          >
            <Camera color="white" size={20} />
          </Pressable>
        </View>
      </View>

      {!isLoaded ? (
        <LoadingState />
      ) : (
        <>
          <DayStrip selectedDate={selectedDate} onSelectDate={setSelectedDate} loggedDates={loggedDates} />

          <CalorieSummaryCard consumed={consumed} target={target} />

          {meals.map((meal) => {
            const mealEntries = entriesForMeal(todaysEntries, meal);
            const mealTotals = totalsForEntries(mealEntries, foods);
            return (
              <MealSection
                key={meal}
                title={MEAL_LABEL[meal]}
                entries={mealEntries}
                foods={foods}
                totalCalories={mealTotals.calories}
                onAddFood={() =>
                  router.push({ pathname: '/(tabs)/nutrition/food-picker', params: { meal, date: selectedDate } })
                }
                onPressEntry={setSelectedEntryId}
                onRemoveEntry={removeEntry}
              />
            );
          })}
        </>
      )}

      <FoodDetailModal
        food={selectedFood}
        entry={selectedEntry}
        onClose={() => setSelectedEntryId(null)}
        onSave={updateEntryServings}
        onDelete={removeEntry}
      />
    </Screen>
  );
}
