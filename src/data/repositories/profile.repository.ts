import { readJSON, writeJSON } from '../storage/async-storage.adapter';
import type { UserProfile } from '../models/user';

const KEY = 'profile';

// Singleton, not a collection — there's only ever one local profile.
export const profileRepository = {
  async get(): Promise<UserProfile | null> {
    return readJSON<UserProfile>(KEY);
  },
  async save(profile: UserProfile): Promise<UserProfile> {
    await writeJSON(KEY, profile);
    return profile;
  },
};
