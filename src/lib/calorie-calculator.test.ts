import { calculateCalorieTarget } from './calorie-calculator';

describe('calculateCalorieTarget', () => {
  it('computes BMR/TDEE/calories/macros for a male, sedentary, maintain case', () => {
    const result = calculateCalorieTarget({
      sex: 'male',
      weightKg: 80,
      heightCm: 180,
      age: 30,
      lifestyle: 'mostly_seated',
      activityLevel: 'sedentary',
      goal: 'maintain',
      pace: 'moderate',
      dietType: 'recommended',
    });

    // BMR = 10*80 + 6.25*180 - 5*30 + 5 = 1780; multiplier = 1.2 + 0 = 1.2
    // TDEE = 2136; maintain -> no adjustment
    expect(result.calories).toBe(2136);
    expect(result.macros).toEqual({ proteinG: 160, carbG: 214, fatG: 71 });
    expect(result.calorieRangeMin).toBe(1922);
    expect(result.calorieRangeMax).toBe(2350);
  });

  it('computes a female, very active, aggressive fat-loss keto case', () => {
    const result = calculateCalorieTarget({
      sex: 'female',
      weightKg: 60,
      heightCm: 165,
      age: 25,
      lifestyle: 'moving_all_day',
      activityLevel: 'very_active',
      goal: 'lose_fat',
      pace: 'fast',
      dietType: 'keto',
    });

    // BMR = 10*60 + 6.25*165 - 5*25 - 161 = 1345.25; multiplier = 1.65 + 0.3 = 1.95
    // TDEE = 2623.2375; -20% pace adjustment -> 2098.59
    expect(result.calories).toBe(2099);
    expect(result.macros).toEqual({ proteinG: 131, carbG: 26, fatG: 163 });
  });

  it('averages the male/female BMR offset for sex "other"', () => {
    const male = calculateCalorieTarget({
      sex: 'male',
      weightKg: 70,
      heightCm: 170,
      age: 40,
      lifestyle: 'mostly_seated',
      activityLevel: 'sedentary',
      goal: 'maintain',
      pace: 'moderate',
      dietType: 'recommended',
    });
    const female = calculateCalorieTarget({
      sex: 'female',
      weightKg: 70,
      heightCm: 170,
      age: 40,
      lifestyle: 'mostly_seated',
      activityLevel: 'sedentary',
      goal: 'maintain',
      pace: 'moderate',
      dietType: 'recommended',
    });
    const other = calculateCalorieTarget({
      sex: 'other',
      weightKg: 70,
      heightCm: 170,
      age: 40,
      lifestyle: 'mostly_seated',
      activityLevel: 'sedentary',
      goal: 'maintain',
      pace: 'moderate',
      dietType: 'recommended',
    });

    expect(other.calories).toBeLessThan(male.calories);
    expect(other.calories).toBeGreaterThan(female.calories);
  });

  it('orders lose_fat < maintain < gain_muscle for the same inputs and pace', () => {
    const base = {
      sex: 'male' as const,
      weightKg: 75,
      heightCm: 175,
      age: 28,
      lifestyle: 'sometimes_standing' as const,
      activityLevel: 'moderate' as const,
      pace: 'moderate' as const,
      dietType: 'recommended' as const,
    };

    const lose = calculateCalorieTarget({ ...base, goal: 'lose_fat' });
    const maintain = calculateCalorieTarget({ ...base, goal: 'maintain' });
    const gain = calculateCalorieTarget({ ...base, goal: 'gain_muscle' });

    expect(lose.calories).toBeLessThan(maintain.calories);
    expect(maintain.calories).toBeLessThan(gain.calories);
  });

  it('makes a "fast" pace more aggressive than "slow" for fat loss', () => {
    const base = {
      sex: 'male' as const,
      weightKg: 75,
      heightCm: 175,
      age: 28,
      lifestyle: 'sometimes_standing' as const,
      activityLevel: 'moderate' as const,
      goal: 'lose_fat' as const,
      dietType: 'recommended' as const,
    };

    const slow = calculateCalorieTarget({ ...base, pace: 'slow' });
    const fast = calculateCalorieTarget({ ...base, pace: 'fast' });

    expect(fast.calories).toBeLessThan(slow.calories);
  });

  it('always brackets calorieRangeMin/Max at -10%/+10% of calories', () => {
    const result = calculateCalorieTarget({
      sex: 'male',
      weightKg: 90,
      heightCm: 185,
      age: 35,
      lifestyle: 'intense_physical',
      activityLevel: 'active',
      goal: 'gain_muscle',
      pace: 'slow',
      dietType: 'high_protein',
    });

    expect(result.calorieRangeMin).toBe(Math.round(result.calories * 0.9));
    expect(result.calorieRangeMax).toBe(Math.round(result.calories * 1.1));
  });

  it.each([
    ['recommended', 0.3, 0.4, 0.3],
    ['high_protein', 0.4, 0.3, 0.3],
    ['low_carb', 0.35, 0.2, 0.45],
    ['keto', 0.25, 0.05, 0.7],
    ['low_fat', 0.3, 0.5, 0.2],
  ] as const)('splits macros for dietType "%s" so grams reconstruct ~calories', (dietType, p, c, f) => {
    const result = calculateCalorieTarget({
      sex: 'male',
      weightKg: 80,
      heightCm: 180,
      age: 30,
      lifestyle: 'mostly_seated',
      activityLevel: 'sedentary',
      goal: 'maintain',
      pace: 'moderate',
      dietType,
    });

    const reconstructed =
      result.macros.proteinG * 4 + result.macros.carbG * 4 + result.macros.fatG * 9;
    // Rounding each macro independently can drift a few kcal from the total.
    expect(Math.abs(reconstructed - result.calories)).toBeLessThan(10);
    expect(result.macros.proteinG).toBe(Math.round((result.calories * p) / 4));
    expect(result.macros.carbG).toBe(Math.round((result.calories * c) / 4));
    expect(result.macros.fatG).toBe(Math.round((result.calories * f) / 9));
  });
});
