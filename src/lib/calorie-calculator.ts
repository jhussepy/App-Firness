import type { ActivityLevel, DietType, Goal, Lifestyle, MacroTargets, Pace, Sex } from '@/data/models/user';

// Mifflin-St Jeor, the standard formula FITIA and most calorie calculators
// use. `other` sex has no published offset, so it's averaged from the
// male/female constants rather than guessed.
function bmr(sex: Sex | undefined, weightKg: number, heightCm: number, age: number): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  if (sex === 'male') return base + 5;
  if (sex === 'female') return base - 161;
  return base - 78; // average of +5 and -161
}

// Daily movement baseline (NEAT), independent of structured exercise.
const LIFESTYLE_MULTIPLIER: Record<Lifestyle, number> = {
  mostly_seated: 1.2,
  sometimes_standing: 1.35,
  mostly_standing: 1.5,
  moving_all_day: 1.65,
  intense_physical: 1.8,
};

// Structured exercise frequency, added on top of the lifestyle baseline.
const ACTIVITY_INCREMENT: Record<ActivityLevel, number> = {
  sedentary: 0,
  light: 0.075,
  moderate: 0.15,
  active: 0.225,
  very_active: 0.3,
};

const PACE_ADJUSTMENT: Record<Goal, Record<Pace, number>> = {
  lose_fat: { slow: -0.1, moderate: -0.15, fast: -0.2 },
  gain_muscle: { slow: 0.05, moderate: 0.1, fast: 0.15 },
  maintain: { slow: 0, moderate: 0, fast: 0 },
};

const MACRO_SPLIT: Record<DietType, { protein: number; carb: number; fat: number }> = {
  recommended: { protein: 0.3, carb: 0.4, fat: 0.3 },
  high_protein: { protein: 0.4, carb: 0.3, fat: 0.3 },
  low_carb: { protein: 0.35, carb: 0.2, fat: 0.45 },
  keto: { protein: 0.25, carb: 0.05, fat: 0.7 },
  low_fat: { protein: 0.3, carb: 0.5, fat: 0.2 },
};

export interface CalorieCalculatorInput {
  sex?: Sex;
  weightKg: number;
  heightCm: number;
  age: number;
  lifestyle: Lifestyle;
  activityLevel: ActivityLevel;
  goal: Goal;
  pace: Pace;
  dietType: DietType;
}

export interface CalorieCalculatorResult {
  calories: number;
  calorieRangeMin: number;
  calorieRangeMax: number;
  macros: MacroTargets;
}

export function calculateCalorieTarget(input: CalorieCalculatorInput): CalorieCalculatorResult {
  const baseBmr = bmr(input.sex, input.weightKg, input.heightCm, input.age);
  const multiplier = LIFESTYLE_MULTIPLIER[input.lifestyle] + ACTIVITY_INCREMENT[input.activityLevel];
  const tdee = baseBmr * multiplier;
  const adjustment = PACE_ADJUSTMENT[input.goal][input.pace];
  const calories = Math.round(tdee * (1 + adjustment));

  const split = MACRO_SPLIT[input.dietType];
  const macros: MacroTargets = {
    proteinG: Math.round((calories * split.protein) / 4),
    carbG: Math.round((calories * split.carb) / 4),
    fatG: Math.round((calories * split.fat) / 9),
  };

  return {
    calories,
    calorieRangeMin: Math.round(calories * 0.9),
    calorieRangeMax: Math.round(calories * 1.1),
    macros,
  };
}
