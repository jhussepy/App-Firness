import { toLocalISODate } from './date';
import type { FoodEntry } from '@/data/models/nutrition';

// Consecutive days, ending today, with at least one food entry logged.
// Breaks on the first gap counting backward from today (yesterday not
// logged means today's entry — if any — is a streak of 1, not part of a
// longer run through older logged days).
export function currentLoggingStreak(entries: FoodEntry[], today: Date = new Date()): number {
  const loggedDays = new Set(entries.map((e) => toLocalISODate(new Date(e.loggedAt))));
  let streak = 0;
  const cursor = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  while (loggedDays.has(toLocalISODate(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
