import { readJSON, writeJSON } from '../storage/async-storage.adapter';
import { exerciseRepository } from '../repositories/exercise.repository';
import { foodRepository } from '../repositories/nutrition.repository';
import { routineRepository } from '../repositories/plan.repository';
import { seedExercises } from './exercises.seed';
import { seedFoods } from './foods.seed';
import { seedRoutines } from './routines.seed';

const SEEDED_FLAG_KEY = 'has-seeded';

export async function ensureSeeded(): Promise<void> {
  const alreadySeeded = await readJSON<boolean>(SEEDED_FLAG_KEY);
  if (alreadySeeded) return;

  await Promise.all([
    exerciseRepository.upsertMany(seedExercises),
    foodRepository.upsertMany(seedFoods),
    routineRepository.upsertMany(seedRoutines),
  ]);

  await writeJSON(SEEDED_FLAG_KEY, true);
}
