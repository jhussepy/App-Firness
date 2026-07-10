import { createHybridRepository } from './hybrid-collection.repository';
import { createSupabaseCollectionRepository } from './supabase-collection.repository';
import { seedRoutines } from '../seed/routines.seed';
import type { Routine, ScheduledRoutine } from '../models/plan';

export const routineRepository = createHybridRepository<Routine>('routines', seedRoutines);

export const scheduledRoutineRepository = createSupabaseCollectionRepository<ScheduledRoutine>('scheduled-routines');
