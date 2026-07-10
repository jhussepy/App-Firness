import { createHybridRepository } from './hybrid-collection.repository';
import { seedExercises } from '../seed/exercises.seed';
import type { Exercise } from '../models/exercise';

export const exerciseRepository = createHybridRepository<Exercise>('exercises', seedExercises);
