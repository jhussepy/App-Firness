import { create } from 'zustand';

import { foodEntryRepository, foodRepository } from '@/data/repositories/nutrition.repository';
import { parseLocalISODate } from '@/lib/date';
import { generateId } from '@/lib/ids';
import type { FoodEntry, FoodItem } from '@/data/models/nutrition';
import type { MealSlot } from '@/data/models/user';

interface NutritionState {
  foods: FoodItem[];
  entries: FoodEntry[];
  isLoaded: boolean;
  load: () => Promise<void>;
  logFood: (foodId: string, mealType: MealSlot, servings: number, date?: string) => Promise<void>;
  updateEntryServings: (entryId: string, servings: number) => Promise<void>;
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
  async logFood(foodId, mealType, servings, date) {
    const now = new Date();
    // `date`, when given, is a bare "YYYY-MM-DD" local day (from DayStrip),
    // not an instant — build a real Date from its local Y/M/D plus the
    // current local time-of-day, then let toISOString() convert that to
    // the correct UTC instant. (Concatenating date + toTimeString() and
    // labeling the result "Z" was wrong: toTimeString() is local time, so
    // that mislabeled a local time as UTC.)
    let loggedAt = now.toISOString();
    if (date) {
      const day = parseLocalISODate(date);
      loggedAt = new Date(
        day.getFullYear(),
        day.getMonth(),
        day.getDate(),
        now.getHours(),
        now.getMinutes(),
        now.getSeconds()
      ).toISOString();
    }
    const entry: FoodEntry = {
      id: generateId(),
      foodId,
      mealType,
      servings,
      loggedAt,
    };
    await foodEntryRepository.upsert(entry);
    set((state) => ({ entries: [...state.entries, entry] }));
  },
  async updateEntryServings(entryId, servings) {
    const current = get().entries.find((e) => e.id === entryId);
    if (!current) return;
    const updated: FoodEntry = { ...current, servings };
    await foodEntryRepository.upsert(updated);
    set((state) => ({ entries: state.entries.map((e) => (e.id === entryId ? updated : e)) }));
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
