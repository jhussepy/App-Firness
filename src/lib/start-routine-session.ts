import type { Routine } from '@/data/models/plan';
import type { SetEntry } from '@/data/models/workout';

interface WorkoutActions {
  startSession: (routineId?: string) => void;
  addSet: (exerciseId: string, set: Omit<SetEntry, 'id' | 'exerciseId' | 'setNumber'>) => void;
}

export function startSessionFromRoutine(routine: Routine, actions: WorkoutActions) {
  actions.startSession(routine.id);
  for (const re of routine.exercises) {
    for (let i = 0; i < re.targetSets; i++) {
      actions.addSet(re.exerciseId, { reps: 0, weightKg: 0, completed: false });
    }
  }
}
