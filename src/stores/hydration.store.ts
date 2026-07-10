import { create } from 'zustand';

import { waterDayRepository } from '@/data/repositories/hydration.repository';
import { todayISODate } from '@/lib/date';
import type { WaterDay } from '@/data/models/hydration';

interface HydrationState {
  days: WaterDay[];
  isLoaded: boolean;
  load: () => Promise<void>;
  addGlass: (date?: string) => Promise<void>;
  removeGlass: (date?: string) => Promise<void>;
}

export const useHydrationStore = create<HydrationState>((set, get) => ({
  days: [],
  isLoaded: false,
  async load() {
    const days = await waterDayRepository.getAll();
    set({ days, isLoaded: true });
  },
  async addGlass(date) {
    const day = date ?? todayISODate();
    const current = get().days.find((d) => d.date === day);
    const updated: WaterDay = {
      id: day,
      date: day,
      glasses: (current?.glasses ?? 0) + 1,
      updatedAt: new Date().toISOString(),
    };
    await waterDayRepository.upsert(updated);
    set((state) => ({ days: [...state.days.filter((d) => d.date !== day), updated] }));
  },
  async removeGlass(date) {
    const day = date ?? todayISODate();
    const current = get().days.find((d) => d.date === day);
    if (!current || current.glasses <= 0) return;
    const updated: WaterDay = { ...current, glasses: current.glasses - 1, updatedAt: new Date().toISOString() };
    await waterDayRepository.upsert(updated);
    set((state) => ({ days: state.days.map((d) => (d.date === day ? updated : d)) }));
  },
}));
