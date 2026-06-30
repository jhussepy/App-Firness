export interface Repository<T extends { id: string }> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T | undefined>;
  upsert(item: T): Promise<T>;
  remove(id: string): Promise<void>;
}

// Generic AsyncStorage-backed collection. Every domain repository wraps one
// of these around a fixed storage key, so swapping in a real backend later
// only means writing a new implementation of this same interface.
export function createCollectionRepository<T extends { id: string }>(
  storageKey: string,
  storage: {
    readJSON: <U>(key: string) => Promise<U | null>;
    writeJSON: <U>(key: string, value: U) => Promise<void>;
  }
): Repository<T> {
  async function getAll(): Promise<T[]> {
    return (await storage.readJSON<T[]>(storageKey)) ?? [];
  }

  return {
    getAll,
    async getById(id) {
      const all = await getAll();
      return all.find((item) => item.id === id);
    },
    async upsert(item) {
      const all = await getAll();
      const index = all.findIndex((existing) => existing.id === item.id);
      if (index >= 0) {
        all[index] = item;
      } else {
        all.push(item);
      }
      await storage.writeJSON(storageKey, all);
      return item;
    },
    async remove(id) {
      const all = await getAll();
      await storage.writeJSON(
        storageKey,
        all.filter((item) => item.id !== id)
      );
    },
  };
}
