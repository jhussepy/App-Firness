import { isSameDay } from './date';
import type { FoodEntry, FoodItem } from '@/data/models/nutrition';
import type { MacroTargets, MealSlot } from '@/data/models/user';

export interface NutritionTotals {
  calories: number;
  proteinG: number;
  carbG: number;
  fatG: number;
}

function emptyTotals(): NutritionTotals {
  return { calories: 0, proteinG: 0, carbG: 0, fatG: 0 };
}

export function totalsForEntries(entries: FoodEntry[], foods: FoodItem[]): NutritionTotals {
  const foodById = new Map(foods.map((f) => [f.id, f]));
  return entries.reduce((totals, entry) => {
    const food = foodById.get(entry.foodId);
    if (!food) return totals;
    return {
      calories: totals.calories + food.caloriesPerServing * entry.servings,
      proteinG: totals.proteinG + food.proteinG * entry.servings,
      carbG: totals.carbG + food.carbG * entry.servings,
      fatG: totals.fatG + food.fatG * entry.servings,
    };
  }, emptyTotals());
}

export function entriesForDate(entries: FoodEntry[], date: string): FoodEntry[] {
  return entries.filter((e) => isSameDay(e.loggedAt, date));
}

export function entriesForMeal(entries: FoodEntry[], meal: MealSlot): FoodEntry[] {
  return entries.filter((e) => e.mealType === meal);
}

export function macroTargetsToTotals(target: MacroTargets, calories: number): NutritionTotals {
  return { calories, proteinG: target.proteinG, carbG: target.carbG, fatG: target.fatG };
}
