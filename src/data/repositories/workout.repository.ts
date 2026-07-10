import { createSupabaseCollectionRepository } from './supabase-collection.repository';
import type { WorkoutSession } from '../models/workout';

export const workoutRepository = createSupabaseCollectionRepository<WorkoutSession>('workout-sessions');
