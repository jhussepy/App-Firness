import { create } from 'zustand';

import { mealPlanRepository } from '@/data/repositories/meal-plan.repository';
import { generateMealPlan } from '@/lib/meal-plan-generator';
import type { FoodItem, MealPlan } from '@/data/models/nutrition';
import type { UserProfile } from '@/data/models/user';

interface MealPlanState {
  plan: MealPlan | null;
  isLoaded: boolean;
  load: () => Promise<void>;
  generate: (profile: UserProfile, foods: FoodItem[]) => Promise<void>;
}

export const useMealPlanStore = create<MealPlanState>((set) => ({
  plan: null,
  isLoaded: false,
  async load() {
    const plan = await mealPlanRepository.get();
    set({ plan, isLoaded: true });
  },
  async generate(profile, foods) {
    const plan = generateMealPlan(profile, foods);
    await mealPlanRepository.save(plan);
    set({ plan, isLoaded: true });
  },
}));
