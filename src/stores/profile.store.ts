import { create } from 'zustand';

import { profileRepository } from '@/data/repositories/profile.repository';
import type { UserProfile } from '@/data/models/user';

interface ProfileState {
  profile: UserProfile | null;
  isLoaded: boolean;
  load: () => Promise<void>;
  save: (profile: UserProfile) => Promise<void>;
  update: (patch: Partial<UserProfile>) => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  isLoaded: false,
  async load() {
    const profile = await profileRepository.get();
    set({ profile, isLoaded: true });
  },
  async save(profile) {
    await profileRepository.save(profile);
    set({ profile });
  },
  async update(patch) {
    const current = get().profile;
    if (!current) return;
    const next = { ...current, ...patch };
    await profileRepository.save(next);
    set({ profile: next });
  },
}));
