import { create } from 'zustand';

import { routineRepository, scheduledRoutineRepository } from '@/data/repositories/plan.repository';
import { generateId } from '@/lib/ids';
import type { Routine, RoutineExercise, ScheduledRoutine } from '@/data/models/plan';

interface PlanState {
  routines: Routine[];
  scheduledRoutines: ScheduledRoutine[];
  isLoaded: boolean;
  load: () => Promise<void>;
  createCustomRoutine: (name: string, description: string, exercises: RoutineExercise[]) => Promise<Routine>;
  scheduleRoutine: (routineId: string, daysOfWeek: number[]) => Promise<void>;
  unscheduleRoutine: (scheduledId: string) => Promise<void>;
}

export const usePlanStore = create<PlanState>((set) => ({
  routines: [],
  scheduledRoutines: [],
  isLoaded: false,
  async load() {
    const [routines, scheduledRoutines] = await Promise.all([
      routineRepository.getAll(),
      scheduledRoutineRepository.getAll(),
    ]);
    set({ routines, scheduledRoutines, isLoaded: true });
  },
  async createCustomRoutine(name, description, exercises) {
    const routine: Routine = { id: generateId(), name, description, exercises, isCustom: true };
    await routineRepository.upsert(routine);
    set((state) => ({ routines: [...state.routines, routine] }));
    return routine;
  },
  async scheduleRoutine(routineId, daysOfWeek) {
    const scheduled: ScheduledRoutine = { id: generateId(), routineId, daysOfWeek, active: true };
    await scheduledRoutineRepository.upsert(scheduled);
    set((state) => ({ scheduledRoutines: [...state.scheduledRoutines, scheduled] }));
  },
  async unscheduleRoutine(scheduledId) {
    await scheduledRoutineRepository.remove(scheduledId);
    set((state) => ({
      scheduledRoutines: state.scheduledRoutines.filter((s) => s.id !== scheduledId),
    }));
  },
}));
