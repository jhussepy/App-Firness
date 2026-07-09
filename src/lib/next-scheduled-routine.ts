import type { Routine, ScheduledRoutine } from '@/data/models/plan';

export interface NextRoutineOccurrence {
  routine: Routine;
  scheduled: ScheduledRoutine;
  daysUntil: number; // 0 = today
}

// daysOfWeek uses JS Date.getDay() convention (0=Sun..6=Sat), so "days until"
// wraps modulo 7 to find the closest upcoming occurrence, today included.
export function findNextScheduledRoutine(
  scheduledRoutines: ScheduledRoutine[],
  routines: Routine[],
  today: number = new Date().getDay()
): NextRoutineOccurrence | undefined {
  const routineById = new Map(routines.map((r) => [r.id, r]));
  let best: NextRoutineOccurrence | undefined;

  for (const scheduled of scheduledRoutines) {
    if (!scheduled.active || scheduled.daysOfWeek.length === 0) continue;
    const routine = routineById.get(scheduled.routineId);
    if (!routine) continue;

    for (const day of scheduled.daysOfWeek) {
      const daysUntil = (day - today + 7) % 7;
      if (!best || daysUntil < best.daysUntil) {
        best = { routine, scheduled, daysUntil };
      }
    }
  }

  return best;
}

const DAY_NAMES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export function labelForDaysUntil(daysUntil: number, today: number = new Date().getDay()): string {
  if (daysUntil === 0) return 'Hoy';
  if (daysUntil === 1) return 'Mañana';
  return DAY_NAMES[(today + daysUntil) % 7];
}
