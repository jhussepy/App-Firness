import { generateMealPlan } from './meal-plan-generator';
import { seedFoods } from '@/data/seed/foods.seed';
import type { UserProfile } from '@/data/models/user';

const today = new Date(2026, 6, 10);

function baseProfile(overrides: Partial<UserProfile> = {}): UserProfile {
  return {
    id: 'p1',
    name: 'Test',
    themePreference: 'dark',
    createdAt: '2026-01-01T00:00:00.000Z',
    dailyCalorieTarget: 2100,
    includedMeals: ['breakfast', 'lunch', 'dinner'],
    ...overrides,
  };
}

describe('generateMealPlan', () => {
  it('generates exactly 7 days starting today', () => {
    const plan = generateMealPlan(baseProfile(), seedFoods, today);
    expect(plan.days).toHaveLength(7);
    expect(plan.days[0].date).toBe('2026-07-10');
    expect(plan.days[6].date).toBe('2026-07-16');
  });

  it('assigns every included meal on every day', () => {
    const plan = generateMealPlan(baseProfile(), seedFoods, today);
    for (const day of plan.days) {
      expect(day.meals.breakfast).toBeDefined();
      expect(day.meals.lunch).toBeDefined();
      expect(day.meals.dinner).toBeDefined();
      expect(day.meals.snack1).toBeUndefined();
    }
  });

  it('only assigns meals the profile actually includes', () => {
    const plan = generateMealPlan(baseProfile({ includedMeals: ['lunch'] }), seedFoods, today);
    for (const day of plan.days) {
      expect(day.meals.lunch).toBeDefined();
      expect(day.meals.breakfast).toBeUndefined();
      expect(day.meals.dinner).toBeUndefined();
    }
  });

  it('keeps every assigned food within the real seed catalog', () => {
    const plan = generateMealPlan(baseProfile(), seedFoods, today);
    const foodIds = new Set(seedFoods.map((f) => f.id));
    for (const day of plan.days) {
      for (const item of Object.values(day.meals)) {
        expect(foodIds.has(item!.foodId)).toBe(true);
      }
    }
  });

  it('clamps servings to a sane range', () => {
    const plan = generateMealPlan(baseProfile({ dailyCalorieTarget: 5000 }), seedFoods, today);
    for (const day of plan.days) {
      for (const item of Object.values(day.meals)) {
        expect(item!.servings).toBeGreaterThanOrEqual(0.5);
        expect(item!.servings).toBeLessThanOrEqual(4);
      }
    }
  });

  it('varies food choices across the week instead of repeating one item', () => {
    const plan = generateMealPlan(baseProfile(), seedFoods, today);
    const lunchFoodIds = new Set(plan.days.map((d) => d.meals.lunch?.foodId));
    expect(lunchFoodIds.size).toBeGreaterThan(1);
  });

  it('falls back to defaults when profile fields are missing', () => {
    const plan = generateMealPlan(
      baseProfile({ dailyCalorieTarget: undefined, includedMeals: undefined }),
      seedFoods,
      today
    );
    expect(plan.days[0].meals.breakfast).toBeDefined();
    expect(plan.days[0].meals.lunch).toBeDefined();
    expect(plan.days[0].meals.dinner).toBeDefined();
  });
});
