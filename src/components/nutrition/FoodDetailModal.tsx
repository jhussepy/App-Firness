import { useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { Minus, Plus, Trash2, X } from 'lucide-react-native';

import { useThemeColors } from '@/theme/use-theme-colors';
import type { FoodEntry, FoodItem } from '@/data/models/nutrition';

interface FoodDetailModalProps {
  food: FoodItem | undefined;
  entry: FoodEntry | undefined;
  onClose: () => void;
  onSave: (entryId: string, servings: number) => void;
  onDelete: (entryId: string) => void;
}

function MacroStat({ label, value }: { label: string; value: number }) {
  return (
    <View className="items-center flex-1">
      <Text className="font-body text-muted text-xs">{label}</Text>
      <Text className="font-body-semibold text-fg mt-0.5">{Math.round(value)} g</Text>
    </View>
  );
}

export function FoodDetailModal({ food, entry, onClose, onSave, onDelete }: FoodDetailModalProps) {
  const colors = useThemeColors();
  const [servings, setServings] = useState(entry?.servings ?? 1);
  // Reset the draft servings whenever a different entry opens — done during
  // render (React's sanctioned pattern for "adjusting state when a prop
  // changes") rather than in an effect, which would render stale servings
  // for one frame before catching up.
  const [lastEntryId, setLastEntryId] = useState(entry?.id);
  if (entry?.id !== lastEntryId) {
    setLastEntryId(entry?.id);
    setServings(entry?.servings ?? 1);
  }

  const visible = !!food && !!entry;

  function handleSave() {
    if (!entry) return;
    onSave(entry.id, servings);
    onClose();
  }

  function handleDelete() {
    if (!entry) return;
    onDelete(entry.id);
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/60 justify-end" onPress={onClose}>
        <Pressable className="bg-bg rounded-t-3xl p-5 pb-8" onPress={(e) => e.stopPropagation()}>
          {food && entry ? (
            <>
              <View className="flex-row items-start justify-between mb-4">
                <View className="flex-1 pr-3">
                  <Text className="font-body-semibold text-fg text-lg">{food.name}</Text>
                  <Text className="font-body text-muted text-sm mt-0.5">{food.servingLabel}</Text>
                </View>
                <Pressable onPress={onClose} hitSlop={10}>
                  <X color={colors.muted} size={22} />
                </Pressable>
              </View>

              <View className="bg-muted/30 border border-border rounded-2xl px-4 py-4 mb-5">
                <Text className="font-body-semibold text-fg text-center mb-3">
                  {Math.round(food.caloriesPerServing * servings)} kcal
                </Text>
                <View className="flex-row justify-between">
                  <MacroStat label="Proteínas" value={food.proteinG * servings} />
                  <MacroStat label="Carbos" value={food.carbG * servings} />
                  <MacroStat label="Grasas" value={food.fatG * servings} />
                </View>
              </View>

              <View className="flex-row items-center justify-between mb-6">
                <Text className="font-body-medium text-fg">Porciones</Text>
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

              <Pressable
                onPress={handleSave}
                className="bg-primary rounded-2xl py-4 items-center mb-3 active:opacity-85"
              >
                <Text className="font-body-semibold text-white text-base">Guardar cambios</Text>
              </Pressable>

              <Pressable
                onPress={handleDelete}
                className="flex-row items-center justify-center gap-2 py-3 active:opacity-70"
              >
                <Trash2 color={colors.destructive} size={16} />
                <Text className="font-body-medium text-destructive text-sm">Eliminar registro</Text>
              </Pressable>
            </>
          ) : null}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
