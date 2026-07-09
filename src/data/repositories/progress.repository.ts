import { createCollectionRepository } from './repository.interface';
import { readJSON, writeJSON } from '../storage/async-storage.adapter';
import type { ProgressMetric } from '../models/progress';

export const progressRepository = createCollectionRepository<ProgressMetric>('progress-metrics', {
  readJSON,
  writeJSON,
});
