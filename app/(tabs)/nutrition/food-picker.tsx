import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Minus, Plus } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useNutritionStore } from '@/stores/nutrition.store';
import { useThemeColors } from '@/theme/use-theme-colors';
import type { MealSlot } from '@/data/models/user';

export default function FoodPickerScreen() {
  const { meal, date } = useLocalSearchParams<{ meal: MealSlot; date: string }>();
  const router = useRouter();
  const colors = useThemeColors();
  const foods = useNutritionStore((s) => s.foods);
  const logFood = useNutritionStore((s) => s.logFood);
  const load = useNutritionStore((s) => s.load);
  const isLoaded = useNutritionStore((s) => s.isLoaded);
  const [query, setQuery] = useState('');
  const [selectedFoodId, setSelectedFoodId] = useState<string | null>(null);
  const [servings, setServings] = useState(1);

  useEffect(() => {
    if (!isLoaded) load();
  }, [isLoaded, load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return foods;
    return foods.filter((f) => f.name.toLowerCase().includes(q));
  }, [foods, query]);

  const selectedFood = foods.find((f) => f.id === selectedFoodId);

  async function confirmAdd() {
    if (!selectedFoodId || !meal) return;
    await logFood(selectedFoodId, meal, servings, date);
    router.back();
  }

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top', 'bottom']}>
      <View className="flex-1 w-full md:max-w-lg md:mx-auto px-4">
      <View className="pt-4 pb-3">
        <Text className="font-display-bold text-2xl text-fg">Agregar alimento</Text>
      </View>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Buscar alimento..."
        placeholderTextColor={colors.muted}
        className="bg-muted/30 border border-border rounded-2xl px-4 py-3 font-body text-fg mb-3"
      />
      <ScrollView className="flex-1" contentContainerClassName="pb-4">
        {filtered.map((food) => (
          <Pressable
            key={food.id}
            onPress={() => {
              setSelectedFoodId(food.id);
              setServings(1);
            }}
            className={`flex-row justify-between items-center rounded-2xl border px-4 py-3 mb-2 ${
              selectedFoodId === food.id ? 'bg-primary/15 border-primary' : 'bg-muted/30 border-border'
            }`}
          >
            <View className="flex-1">
              <Text className="font-body-semibold text-fg">{food.name}</Text>
              <Text className="font-body text-muted text-xs mt-0.5">{food.servingLabel}</Text>
            </View>
            <Text className="font-body text-muted text-sm">{food.caloriesPerServing} kcal</Text>
          </Pressable>
        ))}
      </ScrollView>

      {selectedFood ? (
        <View className="border-t border-border pt-4 pb-4">
          <Text className="font-body-semibold text-fg mb-2">{selectedFood.name}</Text>
          <View className="flex-row items-center justify-between mb-4">
            <Text className="font-body text-muted">Porciones</Text>
            <View className="flex-row items-center gap-4">
              <Pressable
                onPress={() => setServings((s) => Math.max(0.5, s - 0.5))}
                className="w-9 h-9 rounded-full border border-border items-center justify-center"
              >
                <Minus color={colors.foreground} size={16} />
              </Pressable>
              <Text className="font-body-semibold text-fg text-base w-8 text-center">{servings}</Text>
              <Pressable
                onPress={() => setServings((s) => s + 0.5)}
                className="w-9 h-9 rounded-full border border-border items-center justify-center"
              >
                <Plus color={colors.foreground} size={16} />
              </Pressable>
            </View>
          </View>
          <PrimaryButton label={`Agregar · ${Math.round(selectedFood.caloriesPerServing * servings)} kcal`} onPress={confirmAdd} />
        </View>
      ) : null}
      </View>
    </SafeAreaView>
  );
}
