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
