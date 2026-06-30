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
    ...seedExercises.map((e) => exerciseRepository.upsert(e)),
    ...seedFoods.map((f) => foodRepository.upsert(f)),
    ...seedRoutines.map((r) => routineRepository.upsert(r)),
  ]);

  await writeJSON(SEEDED_FLAG_KEY, true);
}
