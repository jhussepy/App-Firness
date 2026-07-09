import { create } from 'zustand';

import { exerciseRepository } from '@/data/repositories/exercise.repository';
import { generateId } from '@/lib/ids';
import type { Exercise } from '@/data/models/exercise';

interface ExerciseState {
  exercises: Exercise[];
  isLoaded: boolean;
  load: () => Promise<void>;
  addCustomExercise: (exercise: Omit<Exercise, 'id' | 'isCustom'>) => Promise<Exercise>;
  getById: (id: string) => Exercise | undefined;
}

export const useExerciseStore = create<ExerciseState>((set, get) => ({
  exercises: [],
  isLoaded: false,
  async load() {
    const exercises = await exerciseRepository.getAll();
    set({ exercises, isLoaded: true });
  },
  async addCustomExercise(exercise) {
    const newExercise: Exercise = { ...exercise, id: generateId(), isCustom: true };
    await exerciseRepository.upsert(newExercise);
    set((state) => ({ exercises: [...state.exercises, newExercise] }));
    return newExercise;
  },
  getById(id) {
    return get().exercises.find((e) => e.id === id);
  },
}));
