import { create } from 'zustand';

import { foodEntryRepository, foodRepository } from '@/data/repositories/nutrition.repository';
import { generateId } from '@/lib/ids';
import type { FoodEntry, FoodItem } from '@/data/models/nutrition';
import type { MealSlot } from '@/data/models/user';

interface NutritionState {
  foods: FoodItem[];
  entries: FoodEntry[];
  isLoaded: boolean;
  load: () => Promise<void>;
  logFood: (foodId: string, mealType: MealSlot, servings: number) => Promise<void>;
  removeEntry: (entryId: string) => Promise<void>;
  addCustomFood: (food: Omit<FoodItem, 'id' | 'isCustom'>) => Promise<FoodItem>;
}

export const useNutritionStore = create<NutritionState>((set, get) => ({
  foods: [],
  entries: [],
  isLoaded: false,
  async load() {
    const [foods, entries] = await Promise.all([foodRepository.getAll(), foodEntryRepository.getAll()]);
    set({ foods, entries, isLoaded: true });
  },
  async logFood(foodId, mealType, servings) {
    const entry: FoodEntry = {
      id: generateId(),
      foodId,
      mealType,
      servings,
      loggedAt: new Date().toISOString(),
    };
    await foodEntryRepository.upsert(entry);
    set((state) => ({ entries: [...state.entries, entry] }));
  },
  async removeEntry(entryId) {
    await foodEntryRepository.remove(entryId);
    set((state) => ({ entries: state.entries.filter((e) => e.id !== entryId) }));
  },
  async addCustomFood(food) {
    const newFood: FoodItem = { ...food, id: generateId(), isCustom: true };
    await foodRepository.upsert(newFood);
    set((state) => ({ foods: [...state.foods, newFood] }));
    return newFood;
  },
}));
