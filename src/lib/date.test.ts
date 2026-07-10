// This suite only actually exercises the local-vs-UTC bug it guards
// against when run in a zone behind UTC — the `test` npm script pins
// TZ=America/Lima (UTC-5, no DST) for exactly that reason. Setting
// process.env.TZ here at module scope does not reliably work: Jest workers
// can cache the timezone before a test file's top-level code runs.
import { isSameDay, parseLocalISODate, toLocalISODate, todayISODate } from './date';

describe('toLocalISODate', () => {
  it('uses local calendar day, not the UTC day', () => {
    // 11pm local on July 10 is already July 11 in UTC — toLocalISODate
    // must still report the 10th.
    const localEvening = new Date(2026, 6, 10, 23, 0, 0);
    expect(toLocalISODate(localEvening)).toBe('2026-07-10');
    expect(localEvening.toISOString().slice(0, 10)).toBe('2026-07-11');
  });
});

describe('parseLocalISODate', () => {
  it('round-trips through toLocalISODate without shifting a day', () => {
    expect(toLocalISODate(parseLocalISODate('2026-07-10'))).toBe('2026-07-10');
  });
});

describe('isSameDay', () => {
  it('matches a late-evening local timestamp against its own bare local date', () => {
    const localEvening = new Date(2026, 6, 10, 23, 0, 0).toISOString();
    expect(isSameDay(localEvening, '2026-07-10')).toBe(true);
    expect(isSameDay(localEvening, '2026-07-11')).toBe(false);
  });

  it('matches two bare calendar-date strings directly', () => {
    expect(isSameDay('2026-07-10', '2026-07-10')).toBe(true);
    expect(isSameDay('2026-07-10', '2026-07-11')).toBe(false);
  });
});

describe('todayISODate', () => {
  it('matches toLocalISODate(new Date())', () => {
    expect(todayISODate()).toBe(toLocalISODate(new Date()));
  });
});
