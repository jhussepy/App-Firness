import { Pressable, Text, View } from 'react-native';
import { Plus } from 'lucide-react-native';

import { FoodLogRow } from './FoodLogRow';
import { useThemeColors } from '@/theme/use-theme-colors';
import type { FoodEntry, FoodItem } from '@/data/models/nutrition';

interface MealSectionProps {
  title: string;
  entries: FoodEntry[];
  foods: FoodItem[];
  totalCalories: number;
  onAddFood: () => void;
  onRemoveEntry: (entryId: string) => void;
}

export function MealSection({ title, entries, foods, totalCalories, onAddFood, onRemoveEntry }: MealSectionProps) {
  const colors = useThemeColors();
  const foodById = new Map(foods.map((f) => [f.id, f]));

  return (
    <View className="bg-muted/30 border border-border rounded-2xl px-4 py-4 mb-3">
      <View className="flex-row justify-between items-center mb-1">
        <Text className="font-body-semibold text-fg text-base">{title}</Text>
        <View className="flex-row items-center gap-3">
          <Text className="font-body text-muted text-sm">{Math.round(totalCalories)} kcal</Text>
          <Pressable onPress={onAddFood} hitSlop={8} accessibilityLabel={`Agregar alimento a ${title}`}>
            <Plus color={colors.primary} size={18} />
          </Pressable>
        </View>
      </View>

      {entries.length === 0 ? (
        <Text className="font-body text-muted text-sm mt-2">Sin alimentos registrados</Text>
      ) : (
        entries.map((entry) => {
          const food = foodById.get(entry.foodId);
          if (!food) return null;
          return (
            <FoodLogRow key={entry.id} food={food} servings={entry.servings} onRemove={() => onRemoveEntry(entry.id)} />
          );
        })
      )}
    </View>
  );
}
