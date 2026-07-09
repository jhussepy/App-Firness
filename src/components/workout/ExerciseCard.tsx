import { Pressable, Text, View } from 'react-native';
import { Dumbbell } from 'lucide-react-native';

import { useThemeColors } from '@/theme/use-theme-colors';
import type { Exercise } from '@/data/models/exercise';

const MUSCLE_LABEL: Record<Exercise['muscleGroup'], string> = {
  chest: 'Pecho',
  back: 'Espalda',
  legs: 'Piernas',
  shoulders: 'Hombros',
  arms: 'Brazos',
  core: 'Core',
  cardio: 'Cardio',
  full_body: 'Cuerpo completo',
};

interface ExerciseCardProps {
  exercise: Exercise;
  onPress: () => void;
}

export function ExerciseCard({ exercise, onPress }: ExerciseCardProps) {
  const colors = useThemeColors();

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-3 rounded-2xl border border-border bg-muted/30 px-4 py-3 mb-2 active:opacity-80"
    >
      <View className="w-10 h-10 rounded-full bg-primary/15 items-center justify-center">
        <Dumbbell color={colors.primary} size={18} />
      </View>
      <View className="flex-1">
        <Text className="font-body-semibold text-fg">{exercise.name}</Text>
        <Text className="font-body text-muted text-xs mt-0.5">
          {MUSCLE_LABEL[exercise.muscleGroup]} · {exercise.equipment}
        </Text>
      </View>
    </Pressable>
  );
}
