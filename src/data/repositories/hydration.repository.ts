import { createSupabaseCollectionRepository } from './supabase-collection.repository';
import type { WaterDay } from '../models/hydration';

export const waterDayRepository = createSupabaseCollectionRepository<WaterDay>('water-days');
