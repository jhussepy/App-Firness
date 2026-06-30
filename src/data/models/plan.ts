export interface RoutineExercise {
  exerciseId: string;
  targetSets: number;
  targetReps: string;
  order: number;
}

export interface Routine {
  id: string;
  name: string;
  description?: string;
  exercises: RoutineExercise[];
  isCustom: boolean;
}

export interface ScheduledRoutine {
  id: string;
  routineId: string;
  daysOfWeek: number[];
  active: boolean;
}
