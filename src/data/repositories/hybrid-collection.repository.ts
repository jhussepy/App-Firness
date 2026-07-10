import { createSupabaseCollectionRepository } from './supabase-collection.repository';
import type { Repository } from './repository.interface';

// For domains that ship a fixed local seed library (exercises, foods,
// routines) alongside user-created custom items. The seed data is a
// compile-time constant, never written to the cloud — only isCustom items
// sync per-user, and reads merge both so the UI sees one combined list.
export function createHybridRepository<T extends { id: string; isCustom: boolean }>(
  collection: string,
  seed: T[]
): Repository<T> {
  const cloud = createSupabaseCollectionRepository<T>(collection);

  return {
    async getAll() {
      const custom = await cloud.getAll();
      return [...seed, ...custom];
    },
    async getById(id) {
      return seed.find((item) => item.id === id) ?? (await cloud.getById(id));
    },
    upsert: cloud.upsert,
    upsertMany: cloud.upsertMany,
    remove: cloud.remove,
  };
}
