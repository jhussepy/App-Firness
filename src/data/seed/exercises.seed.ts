import type { Exercise } from '../models/exercise';

// Fixed, human-readable ids (not generateId()) so routines.seed.ts can
// reference them deterministically.
function ex(
  id: string,
  name: string,
  muscleGroup: Exercise['muscleGroup'],
  equipment: Exercise['equipment']
): Exercise {
  return { id: `ex-${id}`, name, muscleGroup, equipment, isCustom: false };
}

export const seedExercises: Exercise[] = [
  // Chest
  ex('barbell-bench-press', 'Barbell Bench Press', 'chest', 'barbell'),
  ex('incline-barbell-bench-press', 'Incline Barbell Bench Press', 'chest', 'barbell'),
  ex('dumbbell-bench-press', 'Dumbbell Bench Press', 'chest', 'dumbbell'),
  ex('incline-dumbbell-press', 'Incline Dumbbell Press', 'chest', 'dumbbell'),
  ex('dumbbell-fly', 'Dumbbell Fly', 'chest', 'dumbbell'),
  ex('cable-crossover', 'Cable Crossover', 'chest', 'cable'),
  ex('push-up', 'Push-Up', 'chest', 'bodyweight'),
  ex('dip', 'Chest Dip', 'chest', 'bodyweight'),
  ex('machine-chest-press', 'Machine Chest Press', 'chest', 'machine'),
  ex('pec-deck', 'Pec Deck', 'chest', 'machine'),

  // Back
  ex('deadlift', 'Deadlift', 'back', 'barbell'),
  ex('barbell-row', 'Barbell Row', 'back', 'barbell'),
  ex('pull-up', 'Pull-Up', 'back', 'bodyweight'),
  ex('chin-up', 'Chin-Up', 'back', 'bodyweight'),
  ex('lat-pulldown', 'Lat Pulldown', 'back', 'cable'),
  ex('seated-cable-row', 'Seated Cable Row', 'back', 'cable'),
  ex('dumbbell-row', 'One-Arm Dumbbell Row', 'back', 'dumbbell'),
  ex('t-bar-row', 'T-Bar Row', 'back', 'machine'),
  ex('face-pull', 'Face Pull', 'back', 'cable'),
  ex('hyperextension', 'Back Hyperextension', 'back', 'bodyweight'),

  // Legs
  ex('barbell-squat', 'Barbell Back Squat', 'legs', 'barbell'),
  ex('front-squat', 'Front Squat', 'legs', 'barbell'),
  ex('leg-press', 'Leg Press', 'legs', 'machine'),
  ex('romanian-deadlift', 'Romanian Deadlift', 'legs', 'barbell'),
  ex('walking-lunge', 'Walking Lunge', 'legs', 'dumbbell'),
  ex('bulgarian-split-squat', 'Bulgarian Split Squat', 'legs', 'dumbbell'),
  ex('leg-extension', 'Leg Extension', 'legs', 'machine'),
  ex('leg-curl', 'Leg Curl', 'legs', 'machine'),
  ex('calf-raise', 'Standing Calf Raise', 'legs', 'machine'),
  ex('goblet-squat', 'Goblet Squat', 'legs', 'dumbbell'),
  ex('hip-thrust', 'Barbell Hip Thrust', 'legs', 'barbell'),
  ex('bodyweight-squat', 'Bodyweight Squat', 'legs', 'bodyweight'),

  // Shoulders
  ex('overhead-press', 'Barbell Overhead Press', 'shoulders', 'barbell'),
  ex('dumbbell-shoulder-press', 'Dumbbell Shoulder Press', 'shoulders', 'dumbbell'),
  ex('lateral-raise', 'Dumbbell Lateral Raise', 'shoulders', 'dumbbell'),
  ex('front-raise', 'Dumbbell Front Raise', 'shoulders', 'dumbbell'),
  ex('rear-delt-fly', 'Rear Delt Fly', 'shoulders', 'dumbbell'),
  ex('arnold-press', 'Arnold Press', 'shoulders', 'dumbbell'),
  ex('cable-lateral-raise', 'Cable Lateral Raise', 'shoulders', 'cable'),
  ex('shrug', 'Barbell Shrug', 'shoulders', 'barbell'),

  // Arms
  ex('barbell-curl', 'Barbell Curl', 'arms', 'barbell'),
  ex('dumbbell-curl', 'Dumbbell Curl', 'arms', 'dumbbell'),
  ex('hammer-curl', 'Hammer Curl', 'arms', 'dumbbell'),
  ex('preacher-curl', 'Preacher Curl', 'arms', 'machine'),
  ex('cable-curl', 'Cable Curl', 'arms', 'cable'),
  ex('triceps-pushdown', 'Triceps Pushdown', 'arms', 'cable'),
  ex('skull-crusher', 'Skull Crusher', 'arms', 'barbell'),
  ex('overhead-triceps-extension', 'Overhead Triceps Extension', 'arms', 'dumbbell'),
  ex('close-grip-bench-press', 'Close-Grip Bench Press', 'arms', 'barbell'),
  ex('bench-dip', 'Bench Dip', 'arms', 'bodyweight'),

  // Core
  ex('plank', 'Plank', 'core', 'bodyweight'),
  ex('crunch', 'Crunch', 'core', 'bodyweight'),
  ex('hanging-leg-raise', 'Hanging Leg Raise', 'core', 'bodyweight'),
  ex('cable-woodchop', 'Cable Woodchop', 'core', 'cable'),
  ex('russian-twist', 'Russian Twist', 'core', 'bodyweight'),
  ex('ab-wheel-rollout', 'Ab Wheel Rollout', 'core', 'other'),
  ex('side-plank', 'Side Plank', 'core', 'bodyweight'),
  ex('mountain-climber', 'Mountain Climber', 'core', 'bodyweight'),

  // Cardio / full body
  ex('treadmill-run', 'Treadmill Run', 'cardio', 'machine'),
  ex('stationary-bike', 'Stationary Bike', 'cardio', 'machine'),
  ex('rowing-machine', 'Rowing Machine', 'cardio', 'machine'),
  ex('jump-rope', 'Jump Rope', 'cardio', 'other'),
  ex('burpee', 'Burpee', 'full_body', 'bodyweight'),
  ex('kettlebell-swing', 'Kettlebell Swing', 'full_body', 'other'),
  ex('clean-and-press', 'Clean and Press', 'full_body', 'barbell'),
  ex('thruster', 'Dumbbell Thruster', 'full_body', 'dumbbell'),
];
