import { currentLoggingStreak } from './streak';
import type { FoodEntry } from '@/data/models/nutrition';

function entryOn(dateISO: string, id = dateISO): FoodEntry {
  return { id, foodId: 'food-x', mealType: 'lunch', servings: 1, loggedAt: `${dateISO}T12:00:00.000Z` };
}

const today = new Date(2026, 6, 10); // July 10, 2026 local

describe('currentLoggingStreak', () => {
  it('is 0 with no entries', () => {
    expect(currentLoggingStreak([], today)).toBe(0);
  });

  it('is 0 when only past days (not today) were logged', () => {
    expect(currentLoggingStreak([entryOn('2026-07-08'), entryOn('2026-07-07')], today)).toBe(0);
  });

  it('counts consecutive days ending today', () => {
    const entries = [entryOn('2026-07-10'), entryOn('2026-07-09'), entryOn('2026-07-08')];
    expect(currentLoggingStreak(entries, today)).toBe(3);
  });

  it('stops at the first gap', () => {
    const entries = [entryOn('2026-07-10'), entryOn('2026-07-09'), entryOn('2026-07-06')];
    expect(currentLoggingStreak(entries, today)).toBe(2);
  });

  it('treats multiple entries on the same day as one streak day', () => {
    const entries = [entryOn('2026-07-10', 'a'), entryOn('2026-07-10', 'b'), entryOn('2026-07-09', 'c')];
    expect(currentLoggingStreak(entries, today)).toBe(2);
  });
});
