import { toLocalISODate } from './date';
import type { WaterDay } from '@/data/models/hydration';

export const GLASS_ML = 250;

// ~35ml/kg is the common daily-water-intake rule of thumb; falls back to an
// average adult weight when the profile hasn't set one yet so the goal is
// never zero/undefined before onboarding finishes.
export function dailyWaterGoalMl(weightKg?: number): number {
  const w = weightKg && weightKg > 0 ? weightKg : 70;
  return Math.round((w * 35) / 50) * 50;
}

export function dailyWaterGoalGlasses(weightKg?: number): number {
  return Math.max(1, Math.round(dailyWaterGoalMl(weightKg) / GLASS_ML));
}

// Consecutive days, ending today, whose logged glasses met that day's goal.
// Same backward-scan shape as currentLoggingStreak (streak.ts) — breaks on
// the first gap so a goal-less yesterday caps today's streak at 1.
export function currentWaterStreak(days: WaterDay[], goalGlasses: number, today: Date = new Date()): number {
  if (goalGlasses <= 0) return 0;
  const byDate = new Map(days.map((d) => [d.date, d.glasses]));
  let streak = 0;
  const cursor = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  while ((byDate.get(toLocalISODate(cursor)) ?? 0) >= goalGlasses) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
