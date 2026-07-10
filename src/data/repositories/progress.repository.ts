import { createSupabaseCollectionRepository } from './supabase-collection.repository';
import type { ProgressMetric } from '../models/progress';

export const progressRepository = createSupabaseCollectionRepository<ProgressMetric>('progress-metrics');
