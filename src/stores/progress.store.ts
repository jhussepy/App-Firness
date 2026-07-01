import { create } from 'zustand';

import { progressRepository } from '@/data/repositories/progress.repository';
import { generateId } from '@/lib/ids';
import type { ProgressMetric } from '@/data/models/progress';

interface ProgressState {
  metrics: ProgressMetric[];
  isLoaded: boolean;
  load: () => Promise<void>;
  logMetric: (metric: Omit<ProgressMetric, 'id'>) => Promise<void>;
  removeMetric: (id: string) => Promise<void>;
}

export const useProgressStore = create<ProgressState>((set) => ({
  metrics: [],
  isLoaded: false,
  async load() {
    const metrics = await progressRepository.getAll();
    set({
      metrics: metrics.sort((a, b) => a.date.localeCompare(b.date)),
      isLoaded: true,
    });
  },
  async logMetric(metric) {
    const newMetric: ProgressMetric = { ...metric, id: generateId() };
    await progressRepository.upsert(newMetric);
    set((state) => ({
      metrics: [...state.metrics, newMetric].sort((a, b) => a.date.localeCompare(b.date)),
    }));
  },
  async removeMetric(id) {
    await progressRepository.remove(id);
    set((state) => ({ metrics: state.metrics.filter((m) => m.id !== id) }));
  },
}));
