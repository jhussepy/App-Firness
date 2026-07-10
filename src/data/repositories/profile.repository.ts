import { supabase } from '@/lib/supabase';
import type { UserProfile } from '../models/user';

// Cloud-backed: one row per user in `profiles`, keyed by auth.uid() (see
// supabase/schema.sql). Row Level Security means the query below only ever
// sees the signed-in user's own row, so no explicit user filter is needed.
export const profileRepository = {
  async get(): Promise<UserProfile | null> {
    const { data, error } = await supabase.from('profiles').select('data').maybeSingle();
    if (error) throw error;
    return (data?.data as UserProfile) ?? null;
  },
  async save(profile: UserProfile): Promise<UserProfile> {
    const { error } = await supabase.from('profiles').upsert({ data: profile }, { onConflict: 'user_id' });
    if (error) throw error;
    return profile;
  },
};
