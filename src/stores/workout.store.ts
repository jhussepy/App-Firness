import { create } from 'zustand';

import { workoutRepository } from '@/data/repositories/workout.repository';
import { generateId } from '@/lib/ids';
import type { SetEntry, WorkoutSession } from '@/data/models/workout';

interface WorkoutState {
  history: WorkoutSession[];
  activeSession: WorkoutSession | null;
  isLoaded: boolean;
  loadHistory: () => Promise<void>;
  startSession: (routineId?: string) => void;
  addSet: (exerciseId: string, set: Omit<SetEntry, 'id' | 'exerciseId' | 'setNumber'>) => void;
  toggleSetCompleted: (setId: string) => void;
  completeSession: () => Promise<void>;
  discardSession: () => void;
}

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
  history: [],
  activeSession: null,
  isLoaded: false,
  async loadHistory() {
    const history = await workoutRepository.getAll();
    set({
      history: history.sort((a, b) => b.startedAt.localeCompare(a.startedAt)),
      isLoaded: true,
    });
  },
  startSession(routineId) {
    set({
      activeSession: {
        id: generateId(),
        routineId,
        startedAt: new Date().toISOString(),
        sets: [],
      },
    });
  },
  addSet(exerciseId, entry) {
    const session = get().activeSession;
    if (!session) return;
    const setNumber = session.sets.filter((s) => s.exerciseId === exerciseId).length + 1;
    const newSet: SetEntry = { id: generateId(), exerciseId, setNumber, ...entry };
    set({ activeSession: { ...session, sets: [...session.sets, newSet] } });
  },
  toggleSetCompleted(setId) {
    const session = get().activeSession;
    if (!session) return;
    set({
      activeSession: {
        ...session,
        sets: session.sets.map((s) => (s.id === setId ? { ...s, completed: !s.completed } : s)),
      },
    });
  },
  async completeSession() {
    const session = get().activeSession;
    if (!session) return;
    const completed: WorkoutSession = { ...session, completedAt: new Date().toISOString() };
    await workoutRepository.upsert(completed);
    set((state) => ({
      activeSession: null,
      history: [completed, ...state.history],
    }));
  },
  discardSession() {
    set({ activeSession: null });
  },
}));
