import { toLocalISODate } from './date';
import type { FoodItem, MealPlan, MealPlanDay, MealPlanItem } from '@/data/models/nutrition';
import type { MealSlot, UserProfile } from '@/data/models/user';

// Curated subsets of the food seed library suited to each meal slot —
// letting any seeded food land in any slot would put things like olive oil
// or a full burrito bowl at breakfast. IDs match foods.seed.ts.
const BREAKFAST_POOL = [
  'food-oats',
  'food-oatmeal-with-fruit',
  'food-greek-yogurt',
  'food-egg',
  'food-granola',
  'food-cereal',
  'food-bagel',
  'food-protein-shake',
];

const MAIN_MEAL_POOL = [
  'food-grilled-chicken-plate',
  'food-salmon-quinoa-bowl',
  'food-veggie-stir-fry',
  'food-chicken-caesar-salad',
  'food-beef-burrito-bowl',
  'food-greek-salad',
  'food-chicken-breast',
  'food-salmon',
  'food-pork-loin',
  'food-turkey-breast',
  'food-tofu',
  'food-shrimp',
];

const SNACK_POOL = [
  'food-protein-bar',
  'food-almonds',
  'food-apple',
  'food-banana',
  'food-hummus',
  'food-greek-yogurt',
  'food-walnuts',
  'food-orange',
];

function poolFor(meal: MealSlot): string[] {
  if (meal === 'breakfast') return BREAKFAST_POOL;
  if (meal === 'lunch' || meal === 'dinner') return MAIN_MEAL_POOL;
  return SNACK_POOL;
}

// Rough calorie distribution across meals — normalized below to whichever
// subset of meals the user actually has enabled, so e.g. skipping
// breakfast redistributes its share to the rest instead of losing it.
const MEAL_WEIGHT: Record<MealSlot, number> = {
  breakfast: 0.25,
  lunch: 0.35,
  dinner: 0.3,
  snack1: 0.05,
  snack2: 0.05,
};

// A meal-specific rotation offset so breakfast/lunch/dinner on the same day
// don't all land on the same pool index (which would repeat one food
// across every slot before the rotation had a chance to vary anything).
const MEAL_OFFSET: Record<MealSlot, number> = {
  breakfast: 0,
  snack1: 1,
  lunch: 3,
  snack2: 4,
  dinner: 6,
};

function calorieTargetsByMeal(dailyCalories: number, meals: MealSlot[]): Partial<Record<MealSlot, number>> {
  const totalWeight = meals.reduce((sum, m) => sum + MEAL_WEIGHT[m], 0);
  const targets: Partial<Record<MealSlot, number>> = {};
  for (const meal of meals) {
    targets[meal] = totalWeight > 0 ? (dailyCalories * MEAL_WEIGHT[meal]) / totalWeight : 0;
  }
  return targets;
}

function pickFood(pool: string[], index: number, foodById: Map<string, FoodItem>): FoodItem | undefined {
  for (let i = 0; i < pool.length; i++) {
    const candidate = foodById.get(pool[(index + i) % pool.length]);
    if (candidate) return candidate;
  }
  return undefined;
}

function scaleServings(food: FoodItem, targetCalories: number): number {
  if (food.caloriesPerServing <= 0) return 1;
  const rounded = Math.round((targetCalories / food.caloriesPerServing) * 2) / 2;
  return Math.min(4, Math.max(0.5, rounded));
}

export function generateMealPlan(profile: UserProfile, foods: FoodItem[], today: Date = new Date()): MealPlan {
  const foodById = new Map(foods.map((f) => [f.id, f]));
  const meals = profile.includedMeals ?? ['breakfast', 'lunch', 'dinner'];
  const dailyCalories = profile.dailyCalorieTarget ?? 2000;
  const targets = calorieTargetsByMeal(dailyCalories, meals);

  const days: MealPlanDay[] = Array.from({ length: 7 }, (_, dayIndex) => {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + dayIndex);
    const dayMeals: Partial<Record<MealSlot, MealPlanItem>> = {};

    for (const meal of meals) {
      const food = pickFood(poolFor(meal), dayIndex + MEAL_OFFSET[meal], foodById);
      if (!food) continue;
      dayMeals[meal] = { foodId: food.id, servings: scaleServings(food, targets[meal] ?? 0) };
    }

    return { date: toLocalISODate(date), meals: dayMeals };
  });

  // Singleton per user — there's only ever one active plan, addressed by
  // this fixed id both here and in meal-plan.repository.ts.
  return { id: 'current', generatedAt: new Date().toISOString(), days };
}
