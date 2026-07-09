import { entriesForDate, entriesForMeal, macroTargetsToTotals, totalsForEntries } from './nutrition-totals';
import type { FoodEntry, FoodItem } from '@/data/models/nutrition';

const chicken: FoodItem = {
  id: 'food-chicken',
  name: 'Chicken Breast',
  servingLabel: '100 g',
  caloriesPerServing: 165,
  proteinG: 31,
  carbG: 0,
  fatG: 3.6,
  isCustom: false,
};

const rice: FoodItem = {
  id: 'food-rice',
  name: 'White Rice',
  servingLabel: '1 cup',
  caloriesPerServing: 205,
  proteinG: 4.3,
  carbG: 45,
  fatG: 0.4,
  isCustom: false,
};

const foods = [chicken, rice];

function entry(overrides: Partial<FoodEntry>): FoodEntry {
  return {
    id: 'entry-1',
    foodId: chicken.id,
    loggedAt: '2026-07-09T12:00:00.000Z',
    mealType: 'lunch',
    servings: 1,
    ...overrides,
  };
}

describe('totalsForEntries', () => {
  it('returns all zeros for no entries', () => {
    expect(totalsForEntries([], foods)).toEqual({ calories: 0, proteinG: 0, carbG: 0, fatG: 0 });
  });

  it('scales a single entry by its servings', () => {
    const totals = totalsForEntries([entry({ servings: 1.5 })], foods);
    expect(totals.calories).toBeCloseTo(165 * 1.5);
    expect(totals.proteinG).toBeCloseTo(31 * 1.5);
    expect(totals.carbG).toBeCloseTo(0);
    expect(totals.fatG).toBeCloseTo(3.6 * 1.5);
  });

  it('sums multiple entries across different foods', () => {
    const totals = totalsForEntries(
      [entry({ id: 'e1', foodId: chicken.id, servings: 1 }), entry({ id: 'e2', foodId: rice.id, servings: 2 })],
      foods
    );
    expect(totals.calories).toBeCloseTo(165 + 205 * 2);
    expect(totals.proteinG).toBeCloseTo(31 + 4.3 * 2);
    expect(totals.carbG).toBeCloseTo(0 + 45 * 2);
    expect(totals.fatG).toBeCloseTo(3.6 + 0.4 * 2);
  });

  it('silently skips entries whose food is missing instead of producing NaN', () => {
    const totals = totalsForEntries(
      [entry({ id: 'e1', foodId: 'food-does-not-exist' }), entry({ id: 'e2', foodId: chicken.id })],
      foods
    );
    expect(totals).toEqual({ calories: 165, proteinG: 31, carbG: 0, fatG: 3.6 });
  });
});

describe('entriesForDate', () => {
  const entries: FoodEntry[] = [
    entry({ id: 'e1', loggedAt: '2026-07-09T08:00:00.000Z' }),
    entry({ id: 'e2', loggedAt: '2026-07-09T20:30:00.000Z' }),
    entry({ id: 'e3', loggedAt: '2026-07-10T08:00:00.000Z' }),
  ];

  it('matches entries by date prefix regardless of time-of-day', () => {
    const result = entriesForDate(entries, '2026-07-09');
    expect(result.map((e) => e.id)).toEqual(['e1', 'e2']);
  });

  it('returns an empty array for a date with no entries', () => {
    expect(entriesForDate(entries, '2026-01-01')).toEqual([]);
  });
});

describe('entriesForMeal', () => {
  const entries: FoodEntry[] = [
    entry({ id: 'e1', mealType: 'breakfast' }),
    entry({ id: 'e2', mealType: 'lunch' }),
    entry({ id: 'e3', mealType: 'lunch' }),
  ];

  it('filters entries by mealType', () => {
    expect(entriesForMeal(entries, 'lunch').map((e) => e.id)).toEqual(['e2', 'e3']);
    expect(entriesForMeal(entries, 'dinner')).toEqual([]);
  });
});

describe('macroTargetsToTotals', () => {
  it('merges macro targets with a calorie total', () => {
    const result = macroTargetsToTotals({ proteinG: 150, carbG: 200, fatG: 60 }, 2000);
    expect(result).toEqual({ calories: 2000, proteinG: 150, carbG: 200, fatG: 60 });
  });
});
