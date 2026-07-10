import { currentWaterStreak, dailyWaterGoalGlasses, dailyWaterGoalMl } from './hydration';
import type { WaterDay } from '@/data/models/hydration';

describe('dailyWaterGoalMl', () => {
  it('applies the ~35ml/kg rule of thumb', () => {
    expect(dailyWaterGoalMl(80)).toBe(2800);
  });

  it('falls back to an average weight when none is set', () => {
    expect(dailyWaterGoalMl(undefined)).toBe(dailyWaterGoalMl(70));
  });

  it('falls back for a non-positive weight', () => {
    expect(dailyWaterGoalMl(0)).toBe(dailyWaterGoalMl(70));
  });
});

describe('dailyWaterGoalGlasses', () => {
  it('converts the ml goal into 250ml glasses', () => {
    expect(dailyWaterGoalGlasses(70)).toBe(Math.round(dailyWaterGoalMl(70) / 250));
  });

  it('never returns less than one glass', () => {
    expect(dailyWaterGoalGlasses(1)).toBeGreaterThanOrEqual(1);
  });
});

function day(date: string, glasses: number): WaterDay {
  return { id: date, date, glasses, updatedAt: `${date}T12:00:00.000Z` };
}

describe('currentWaterStreak', () => {
  const today = new Date(2026, 6, 10); // 2026-07-10, local

  it('counts consecutive days that met the goal, ending today', () => {
    const days = [day('2026-07-08', 8), day('2026-07-09', 8), day('2026-07-10', 8)];
    expect(currentWaterStreak(days, 8, today)).toBe(3);
  });

  it('breaks on the first gap counting backward from today', () => {
    const days = [day('2026-07-08', 8), day('2026-07-10', 8)]; // missing the 9th
    expect(currentWaterStreak(days, 8, today)).toBe(1);
  });

  it('does not count a day that logged fewer glasses than the goal', () => {
    const days = [day('2026-07-10', 5)];
    expect(currentWaterStreak(days, 8, today)).toBe(0);
  });

  it('returns 0 for a non-positive goal instead of looping forever', () => {
    expect(currentWaterStreak([], 0, today)).toBe(0);
  });
});
