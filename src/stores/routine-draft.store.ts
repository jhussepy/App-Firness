import { create } from 'zustand';

import type { RoutineExercise } from '@/data/models/plan';

// Ephemeral (not persisted) — scratch space while the user is building a
// custom routine across the create screen and the exercise picker, which
// are two separate navigator screens.
interface RoutineDraftState {
  name: string;
  description: string;
  exercises: RoutineExercise[];
  setName: (name: string) => void;
  setDescription: (description: string) => void;
  addExercise: (exerciseId: string) => void;
  removeExercise: (exerciseId: string) => void;
  updateExercise: (exerciseId: string, patch: Partial<Pick<RoutineExercise, 'targetSets' | 'targetReps'>>) => void;
  reset: () => void;
}

export const useRoutineDraftStore = create<RoutineDraftState>((set, get) => ({
  name: '',
  description: '',
  exercises: [],
  setName: (name) => set({ name }),
  setDescription: (description) => set({ description }),
  addExercise: (exerciseId) => {
    if (get().exercises.some((e) => e.exerciseId === exerciseId)) return;
    set((state) => ({
      exercises: [
        ...state.exercises,
        { exerciseId, targetSets: 3, targetReps: '8-12', order: state.exercises.length },
      ],
    }));
  },
  removeExercise: (exerciseId) =>
    set((state) => ({ exercises: state.exercises.filter((e) => e.exerciseId !== exerciseId) })),
  updateExercise: (exerciseId, patch) =>
    set((state) => ({
      exercises: state.exercises.map((e) => (e.exerciseId === exerciseId ? { ...e, ...patch } : e)),
    })),
  reset: () => set({ name: '', description: '', exercises: [] }),
}));
