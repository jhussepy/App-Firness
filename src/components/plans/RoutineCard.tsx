import { Pressable, Text, View } from 'react-native';
import { CalendarRange, Dumbbell } from 'lucide-react-native';

import { useThemeColors } from '@/theme/use-theme-colors';
import type { Routine } from '@/data/models/plan';

interface RoutineCardProps {
  routine: Routine;
  scheduledDays?: number[];
  onPress: () => void;
}

const DAY_LABELS = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

export function RoutineCard({ routine, scheduledDays, onPress }: RoutineCardProps) {
  const colors = useThemeColors();

  return (
    <Pressable
      onPress={onPress}
      className="rounded-2xl border border-border bg-muted/30 px-4 py-4 mb-3 active:opacity-80"
    >
      <View className="flex-row items-center gap-3">
        <View className="w-10 h-10 rounded-full bg-primary/15 items-center justify-center">
          <Dumbbell color={colors.primary} size={18} />
        </View>
        <View className="flex-1">
          <Text className="font-body-semibold text-fg text-base">{routine.name}</Text>
          <Text className="font-body text-muted text-xs mt-0.5">{routine.exercises.length} ejercicios</Text>
        </View>
      </View>
      {routine.description ? (
        <Text className="font-body text-muted text-sm mt-2">{routine.description}</Text>
      ) : null}
      {scheduledDays && scheduledDays.length > 0 ? (
        <View className="flex-row items-center gap-1.5 mt-3">
          <CalendarRange color={colors.accent} size={14} />
          <Text className="font-body-medium text-accent text-xs">
            {scheduledDays
              .slice()
              .sort()
              .map((d) => DAY_LABELS[d])
              .join(' · ')}
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
}
