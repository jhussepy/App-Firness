import { createCollectionRepository } from './repository.interface';
import { readJSON, writeJSON } from '../storage/async-storage.adapter';
import type { Exercise } from '../models/exercise';

export const exerciseRepository = createCollectionRepository<Exercise>('exercises', {
  readJSON,
  writeJSON,
});
