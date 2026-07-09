import { Pressable, Text, View } from 'react-native';
import { Dumbbell, Info } from 'lucide-react-native';

import { EQUIPMENT_LABEL, MUSCLE_LABEL } from '@/lib/exercise-labels';
import { useThemeColors } from '@/theme/use-theme-colors';
import type { Exercise } from '@/data/models/exercise';

interface ExerciseCardProps {
  exercise: Exercise;
  onPress: () => void;
  onInfoPress?: () => void;
}

export function ExerciseCard({ exercise, onPress, onInfoPress }: ExerciseCardProps) {
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
          {MUSCLE_LABEL[exercise.muscleGroup]} · {EQUIPMENT_LABEL[exercise.equipment]}
        </Text>
      </View>
      {onInfoPress ? (
        <Pressable onPress={onInfoPress} hitSlop={10} accessibilityLabel={`Cómo hacer ${exercise.name}`}>
          <Info color={colors.muted} size={18} />
        </Pressable>
      ) : null}
    </Pressable>
  );
}
