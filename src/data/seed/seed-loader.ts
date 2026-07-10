import { readJSON, writeJSON } from '../storage/async-storage.adapter';
import { exerciseRepository } from '../repositories/exercise.repository';
import { foodRepository } from '../repositories/nutrition.repository';
import { routineRepository } from '../repositories/plan.repository';
import { seedExercises } from './exercises.seed';
import { seedFoods } from './foods.seed';
import { seedRoutines } from './routines.seed';

const SEED_VERSION_KEY = 'seed-version';
// v1 shipped with a boolean flag under this key; keep reading it so those
// installs are treated as v1 (and thus re-seeded) instead of as fresh.
const LEGACY_SEEDED_FLAG_KEY = 'has-seeded';

// Bump this whenever seed content changes (e.g. v2 added per-exercise
// instructions, v3 translated routine names/descriptions to Spanish).
// Re-seeding upserts by id, so user-created custom items and edits to
// non-seed data are preserved — only the seed rows are refreshed.
const CURRENT_SEED_VERSION = 3;

export async function ensureSeeded(): Promise<void> {
  let version = (await readJSON<number>(SEED_VERSION_KEY)) ?? 0;
  if (version === 0 && (await readJSON<boolean>(LEGACY_SEEDED_FLAG_KEY))) {
    version = 1;
  }
  if (version >= CURRENT_SEED_VERSION) return;

  await Promise.all([
    exerciseRepository.upsertMany(seedExercises),
    foodRepository.upsertMany(seedFoods),
    routineRepository.upsertMany(seedRoutines),
  ]);

  await writeJSON(SEED_VERSION_KEY, CURRENT_SEED_VERSION);
}
