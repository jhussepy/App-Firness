import { Pressable, Text, View } from 'react-native';
import { GlassWater, Minus, Plus } from 'lucide-react-native';

import { useThemeColors } from '@/theme/use-theme-colors';

interface WaterTrackerCardProps {
  glasses: number;
  goal: number;
  onAdd: () => void;
  onRemove?: () => void;
  compact?: boolean;
}

// Caps the individual glass icons rendered so an unusually high goal (e.g. a
// heavy body weight pushing past ~16 glasses) doesn't overflow the row —
// the progress bar + "x / y" text still communicate the real numbers.
const MAX_GLASS_ICONS = 12;

export function WaterTrackerCard({ glasses, goal, onAdd, onRemove, compact }: WaterTrackerCardProps) {
  const colors = useThemeColors();
  const pct = goal > 0 ? Math.min(100, Math.round((glasses / goal) * 100)) : 0;
  const iconCount = Math.min(goal, MAX_GLASS_ICONS);

  if (compact) {
    return (
      <Pressable
        onPress={onAdd}
        className="flex-1 bg-muted/30 border border-border rounded-2xl p-4 items-center active:opacity-80"
      >
        <GlassWater color={colors.primary} size={20} />
        <Text className="font-display-bold text-fg mt-2" style={{ fontSize: 18 }}>
          {glasses}/{goal}
        </Text>
        <Text className="font-body text-muted text-xs mt-0.5 text-center">vasos de agua</Text>
      </Pressable>
    );
  }

  return (
    <View className="bg-muted/30 border border-border rounded-2xl p-5 mb-4">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-2">
          <GlassWater color={colors.primary} size={18} />
          <Text className="font-body-semibold text-fg">Agua</Text>
        </View>
        <Text className="font-body text-muted text-sm">
          {glasses} / {goal} vasos
        </Text>
      </View>

      <View className="h-1.5 w-full rounded-full bg-border overflow-hidden mb-3">
        <View className="h-1.5 rounded-full bg-primary" style={{ width: `${pct}%` }} />
      </View>

      <View className="flex-row flex-wrap gap-1.5 mb-4">
        {Array.from({ length: iconCount }).map((_, i) => (
          <GlassWater key={i} color={i < glasses ? colors.primary : colors.border} size={16} />
        ))}
      </View>

      <View className="flex-row items-center gap-3">
        <Pressable
          onPress={onRemove}
          disabled={glasses <= 0}
          accessibilityLabel="Quitar un vaso"
          className="w-10 h-10 rounded-full bg-muted/30 border border-border items-center justify-center active:opacity-70 disabled:opacity-40"
        >
          <Minus color={colors.foreground} size={18} />
        </Pressable>
        <Pressable
          onPress={onAdd}
          className="flex-1 flex-row items-center justify-center gap-2 bg-primary rounded-2xl py-3 active:opacity-85"
        >
          <Plus color="white" size={18} />
          <Text className="font-body-semibold text-white text-sm">Agregar vaso</Text>
        </Pressable>
      </View>
    </View>
  );
}
