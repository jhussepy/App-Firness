import { useEffect, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { CalorieSummaryCard } from '@/components/nutrition/CalorieSummaryCard';
import { DayStrip } from '@/components/nutrition/DayStrip';
import { MealSection } from '@/components/nutrition/MealSection';
import { Screen } from '@/components/ui/Screen';
import { todayISODate } from '@/lib/date';
import { entriesForDate, entriesForMeal, macroTargetsToTotals, totalsForEntries } from '@/lib/nutrition-totals';
import { useNutritionStore } from '@/stores/nutrition.store';
import { useProfileStore } from '@/stores/profile.store';
import type { MealSlot } from '@/data/models/user';

const MEAL_LABELS: Record<MealSlot, string> = {
  breakfast: 'Desayuno',
  lunch: 'Almuerzo',
  dinner: 'Cena',
  snack1: 'Snack 1',
  snack2: 'Snack 2',
};

export default function NutritionScreen() {
  const router = useRouter();
  const profile = useProfileStore((s) => s.profile);
  const loadProfile = useProfileStore((s) => s.load);
  const { foods, entries, isLoaded, load, removeEntry } = useNutritionStore();
  const [selectedDate, setSelectedDate] = useState(todayISODate());

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
  const loggedDates = useMemo(() => new Set(entries.map((e) => e.loggedAt.slice(0, 10))), [entries]);
  const meals = profile?.includedMeals ?? ['breakfast', 'lunch', 'dinner'];

  return (
    <Screen>
      <View className="pt-4 pb-3">
        <Text className="font-display-bold text-3xl text-fg">Nutrition</Text>
      </View>

      <DayStrip selectedDate={selectedDate} onSelectDate={setSelectedDate} loggedDates={loggedDates} />

      <CalorieSummaryCard consumed={consumed} target={target} />

      {meals.map((meal) => {
        const mealEntries = entriesForMeal(todaysEntries, meal);
        const mealTotals = totalsForEntries(mealEntries, foods);
        return (
          <MealSection
            key={meal}
            title={MEAL_LABELS[meal]}
            entries={mealEntries}
            foods={foods}
            totalCalories={mealTotals.calories}
            onAddFood={() =>
              router.push({ pathname: '/(tabs)/nutrition/food-picker', params: { meal, date: selectedDate } })
            }
            onRemoveEntry={removeEntry}
          />
        );
      })}
    </Screen>
  );
}
