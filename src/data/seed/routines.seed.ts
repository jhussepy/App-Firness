import type { Routine, RoutineExercise } from '../models/plan';

function re(exerciseId: string, targetSets: number, targetReps: string, order: number): RoutineExercise {
  return { exerciseId: `ex-${exerciseId}`, targetSets, targetReps, order };
}

export const seedRoutines: Routine[] = [
  {
    id: 'routine-full-body-3x',
    name: 'Cuerpo Completo 3x/Semana',
    description:
      'Rutina equilibrada de cuerpo completo para 3 días no consecutivos a la semana. Un gran punto de partida para principiantes.',
    isCustom: false,
    exercises: [
      re('barbell-squat', 3, '8-10', 1),
      re('barbell-bench-press', 3, '8-10', 2),
      re('barbell-row', 3, '8-10', 3),
      re('dumbbell-shoulder-press', 3, '10-12', 4),
      re('plank', 3, '30-45s', 5),
    ],
  },
  {
    id: 'routine-push-pull-legs',
    name: 'Empuje / Tracción / Piernas',
    description: 'Split clásico de 6 días: empuje (pecho/hombros/tríceps), tracción (espalda/bíceps), piernas.',
    isCustom: false,
    exercises: [
      re('barbell-bench-press', 4, '6-8', 1),
      re('overhead-press', 3, '8-10', 2),
      re('incline-dumbbell-press', 3, '10-12', 3),
      re('lateral-raise', 3, '12-15', 4),
      re('triceps-pushdown', 3, '12-15', 5),
    ],
  },
  {
    id: 'routine-beginner-strength',
    name: 'Fuerza para Principiantes',
    description: 'Programa sencillo centrado en levantamientos compuestos para construir una base de fuerza.',
    isCustom: false,
    exercises: [
      re('barbell-squat', 3, '5', 1),
      re('barbell-bench-press', 3, '5', 2),
      re('deadlift', 1, '5', 3),
      re('pull-up', 3, 'AMRAP', 4),
    ],
  },
  {
    id: 'routine-upper-lower',
    name: 'Tren Superior / Tren Inferior',
    description: 'Split de 4 días alternando sesiones de tren superior e inferior.',
    isCustom: false,
    exercises: [
      re('dumbbell-bench-press', 4, '8-10', 1),
      re('seated-cable-row', 4, '8-10', 2),
      re('dumbbell-shoulder-press', 3, '10-12', 3),
      re('barbell-curl', 3, '10-12', 4),
      re('triceps-pushdown', 3, '10-12', 5),
    ],
  },
  {
    id: 'routine-home-bodyweight',
    name: 'Peso Corporal en Casa',
    description: 'Rutina sin equipo para entrenar en cualquier lugar.',
    isCustom: false,
    exercises: [
      re('push-up', 3, '12-20', 1),
      re('bodyweight-squat', 3, '15-20', 2),
      re('pull-up', 3, 'AMRAP', 3),
      re('plank', 3, '45-60s', 4),
      re('mountain-climber', 3, '20', 5),
    ],
  },
];
