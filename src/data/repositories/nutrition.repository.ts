import { createHybridRepository } from './hybrid-collection.repository';
import { createSupabaseCollectionRepository } from './supabase-collection.repository';
import { seedFoods } from '../seed/foods.seed';
import type { FoodEntry, FoodItem } from '../models/nutrition';

export const foodRepository = createHybridRepository<FoodItem>('foods', seedFoods);

export const foodEntryRepository = createSupabaseCollectionRepository<FoodEntry>('food-entries');
