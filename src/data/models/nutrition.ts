import type { MealSlot } from './user';

export interface FoodItem {
  id: string;
  name: string;
  servingLabel: string;
  caloriesPerServing: number;
  proteinG: number;
  carbG: number;
  fatG: number;
  isCustom: boolean;
}

export interface FoodEntry {
  id: string;
  foodId: string;
  loggedAt: string;
  mealType: MealSlot;
  servings: number;
}

export interface MealPlanItem {
  foodId: string;
  servings: number;
}

export interface MealPlanDay {
  date: string; // local "YYYY-MM-DD"
  meals: Partial<Record<MealSlot, MealPlanItem>>;
}

export interface MealPlan {
  id: string;
  generatedAt: string;
  days: MealPlanDay[]; // 7 entries, starting today
}
