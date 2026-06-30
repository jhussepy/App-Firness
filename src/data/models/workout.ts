export interface SetEntry {
  id: string;
  exerciseId: string;
  setNumber: number;
  reps: number;
  weightKg: number;
  rpe?: number;
  completed: boolean;
}

export interface WorkoutSession {
  id: string;
  routineId?: string;
  startedAt: string;
  completedAt?: string;
  sets: SetEntry[];
  notes?: string;
}
