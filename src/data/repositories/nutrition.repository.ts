import { createCollectionRepository } from './repository.interface';
import { readJSON, writeJSON } from '../storage/async-storage.adapter';
import type { FoodEntry, FoodItem } from '../models/nutrition';

export const foodRepository = createCollectionRepository<FoodItem>('foods', {
  readJSON,
  writeJSON,
});

export const foodEntryRepository = createCollectionRepository<FoodEntry>('food-entries', {
  readJSON,
  writeJSON,
});
