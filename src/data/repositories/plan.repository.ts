import { createCollectionRepository } from './repository.interface';
import { readJSON, writeJSON } from '../storage/async-storage.adapter';
import type { Routine, ScheduledRoutine } from '../models/plan';

export const routineRepository = createCollectionRepository<Routine>('routines', {
  readJSON,
  writeJSON,
});

export const scheduledRoutineRepository = createCollectionRepository<ScheduledRoutine>(
  'scheduled-routines',
  { readJSON, writeJSON }
);
