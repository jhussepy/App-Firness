import { Pressable, Text, View } from 'react-native';
import { X } from 'lucide-react-native';

import { useThemeColors } from '@/theme/use-theme-colors';
import type { FoodItem } from '@/data/models/nutrition';

interface FoodLogRowProps {
  food: FoodItem;
  servings: number;
  onPress: () => void;
  onRemove: () => void;
}

export function FoodLogRow({ food, servings, onPress, onRemove }: FoodLogRowProps) {
  const colors = useThemeColors();
  const calories = Math.round(food.caloriesPerServing * servings);

  return (
    <View className="flex-row items-center justify-between py-2 border-b border-border">
      <Pressable onPress={onPress} className="flex-1 pr-2 active:opacity-70">
        <Text className="font-body-medium text-fg">{food.name}</Text>
        <Text className="font-body text-muted text-xs mt-0.5">
          {servings} × {food.servingLabel} · {calories} kcal
        </Text>
      </Pressable>
      <Pressable onPress={onRemove} hitSlop={8}>
        <X color={colors.muted} size={16} />
      </Pressable>
    </View>
  );
}
