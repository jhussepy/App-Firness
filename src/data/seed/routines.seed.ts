import type { Routine, RoutineExercise } from '../models/plan';

function re(exerciseId: string, targetSets: number, targetReps: string, order: number): RoutineExercise {
  return { exerciseId: `ex-${exerciseId}`, targetSets, targetReps, order };
}

export const seedRoutines: Routine[] = [
  {
    id: 'routine-full-body-3x',
    name: 'Full Body 3x/Week',
    description: 'A balanced full-body routine for 3 non-consecutive days a week. Great starting point for beginners.',
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
    name: 'Push / Pull / Legs',
    description: 'Classic 6-day split: push (chest/shoulders/triceps), pull (back/biceps), legs.',
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
    name: 'Beginner Strength',
    description: 'Simple compound-lift focused program to build a strength base.',
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
    name: 'Upper / Lower Split',
    description: '4-day split alternating upper body and lower body sessions.',
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
    name: 'Home Bodyweight',
    description: 'No-equipment routine for training anywhere.',
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
