export interface Repository<T extends { id: string }> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T | undefined>;
  upsert(item: T): Promise<T>;
  upsertMany(items: T[]): Promise<T[]>;
  remove(id: string): Promise<void>;
}

// Generic AsyncStorage-backed collection. Every domain repository wraps one
// of these around a fixed storage key, so swapping in a real backend later
// only means writing a new implementation of this same interface.
//
// Every mutation is serialized through `queue` (a promise chain scoped to
// this repository instance) because AsyncStorage has no transactions:
// two concurrent read-modify-write calls (e.g. seeding many rows via
// Promise.all) would both read the same starting array and the second
// write would silently clobber the first.
export function createCollectionRepository<T extends { id: string }>(
  storageKey: string,
  storage: {
    readJSON: <U>(key: string) => Promise<U | null>;
    writeJSON: <U>(key: string, value: U) => Promise<void>;
  }
): Repository<T> {
  let queue: Promise<unknown> = Promise.resolve();

  function enqueue<R>(task: () => Promise<R>): Promise<R> {
    const result = queue.then(task);
    queue = result.catch(() => undefined);
    return result;
  }

  async function getAll(): Promise<T[]> {
    return (await storage.readJSON<T[]>(storageKey)) ?? [];
  }

  function upsertInto(all: T[], item: T): T[] {
    const index = all.findIndex((existing) => existing.id === item.id);
    if (index >= 0) {
      all[index] = item;
    } else {
      all.push(item);
    }
    return all;
  }

  return {
    getAll,
    async getById(id) {
      const all = await getAll();
      return all.find((item) => item.id === id);
    },
    upsert(item) {
      return enqueue(async () => {
        const all = upsertInto(await getAll(), item);
        await storage.writeJSON(storageKey, all);
        return item;
      });
    },
    upsertMany(items) {
      return enqueue(async () => {
        let all = await getAll();
        for (const item of items) {
          all = upsertInto(all, item);
        }
        await storage.writeJSON(storageKey, all);
        return items;
      });
    },
    remove(id) {
      return enqueue(async () => {
        const all = await getAll();
        await storage.writeJSON(
          storageKey,
          all.filter((item) => item.id !== id)
        );
      });
    },
  };
}
