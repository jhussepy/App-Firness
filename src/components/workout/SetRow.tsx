import { Pressable, Text, TextInput, View } from 'react-native';
import { Check } from 'lucide-react-native';

import { useThemeColors } from '@/theme/use-theme-colors';
import type { SetEntry } from '@/data/models/workout';

interface SetRowProps {
  set: SetEntry;
  onChangeReps: (reps: number) => void;
  onChangeWeight: (weightKg: number) => void;
  onToggleCompleted: () => void;
}

export function SetRow({ set, onChangeReps, onChangeWeight, onToggleCompleted }: SetRowProps) {
  const colors = useThemeColors();

  return (
    <View
      className={`flex-row items-center gap-3 rounded-xl border px-3 py-2 mb-2 ${
        set.completed ? 'bg-accent/10 border-accent' : 'bg-muted/20 border-border'
      }`}
    >
      <Text className="font-body-semibold text-muted w-6 text-center">{set.setNumber}</Text>
      <View className="flex-1 flex-row items-center gap-2">
        <TextInput
          value={set.reps ? String(set.reps) : ''}
          onChangeText={(v) => onChangeReps(parseInt(v, 10) || 0)}
          placeholder="reps"
          placeholderTextColor={colors.muted}
          keyboardType="number-pad"
          className="flex-1 text-center font-body text-fg bg-bg rounded-lg py-2 border border-border"
        />
        <Text className="font-body text-muted text-xs">reps</Text>
        <TextInput
          value={set.weightKg ? String(set.weightKg) : ''}
          onChangeText={(v) => onChangeWeight(parseFloat(v) || 0)}
          placeholder="kg"
          placeholderTextColor={colors.muted}
          keyboardType="decimal-pad"
          className="flex-1 text-center font-body text-fg bg-bg rounded-lg py-2 border border-border"
        />
        <Text className="font-body text-muted text-xs">kg</Text>
      </View>
      <Pressable
        onPress={onToggleCompleted}
        className={`w-8 h-8 rounded-full items-center justify-center ${
          set.completed ? 'bg-accent' : 'border border-border'
        }`}
      >
        {set.completed ? <Check color="white" size={16} /> : null}
      </Pressable>
    </View>
  );
}
