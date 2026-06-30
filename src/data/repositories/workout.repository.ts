import { createCollectionRepository } from './repository.interface';
import { readJSON, writeJSON } from '../storage/async-storage.adapter';
import type { WorkoutSession } from '../models/workout';

export const workoutRepository = createCollectionRepository<WorkoutSession>('workout-sessions', {
  readJSON,
  writeJSON,
});
