export type Sex = 'male' | 'female' | 'other';

export type Goal = 'lose_fat' | 'gain_muscle' | 'maintain';

// Exercise frequency — separate from daily lifestyle movement (FITIA asks
// these as two distinct onboarding questions; combining them into one
// "activity level" loses information the calorie calculator can use).
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';

export type Lifestyle =
  | 'mostly_seated'
  | 'sometimes_standing'
  | 'mostly_standing'
  | 'moving_all_day'
  | 'intense_physical';

export type DietType = 'recommended' | 'high_protein' | 'low_carb' | 'keto' | 'low_fat';

export type DietaryPreference = 'balanced' | 'pescetarian' | 'vegetarian' | 'vegan';

export type MealSlot = 'breakfast' | 'lunch' | 'dinner' | 'snack1' | 'snack2';

export type Pace = 'slow' | 'moderate' | 'fast';

export interface MacroTargets {
  proteinG: number;
  carbG: number;
  fatG: number;
}

export interface UserProfile {
  id: string;
  name: string;
  sex?: Sex;
  age?: number;
  heightCm?: number;
  weightKg?: number;
  goal?: Goal;
  activityLevel?: ActivityLevel;
  lifestyle?: Lifestyle;
  hasMedicalCondition?: boolean;
  dietType?: DietType;
  dietaryPreference?: DietaryPreference;
  includedMeals?: MealSlot[];
  targetWeightKg?: number;
  pace?: Pace;
  dailyCalorieTarget?: number;
  dailyMacroTargets?: MacroTargets;
  themePreference: 'dark' | 'light';
  onboardingCompletedAt?: string;
  createdAt: string;
}
