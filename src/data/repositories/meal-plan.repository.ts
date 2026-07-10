import { createSupabaseCollectionRepository } from './supabase-collection.repository';
import type { MealPlan } from '../models/nutrition';

// Singleton, not a real collection — there's only ever one active plan per
// user, always stored under the fixed id 'current' (see
// meal-plan-generator.ts). Reuses the generic collection repository
// instead of a dedicated table since it's the same "one JSON blob per
// user" shape as everything else in user_collections.
const collection = createSupabaseCollectionRepository<MealPlan>('meal-plan');

export const mealPlanRepository = {
  async get(): Promise<MealPlan | null> {
    return (await collection.getById('current')) ?? null;
  },
  async save(plan: MealPlan): Promise<MealPlan> {
    return collection.upsert(plan);
  },
};
