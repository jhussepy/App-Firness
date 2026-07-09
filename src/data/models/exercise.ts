export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'legs'
  | 'shoulders'
  | 'arms'
  | 'core'
  | 'cardio'
  | 'full_body';

export type Equipment = 'barbell' | 'dumbbell' | 'machine' | 'bodyweight' | 'cable' | 'other';

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  equipment: Equipment;
  isCustom: boolean;
  instructions?: string;
}
