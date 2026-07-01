import { useEffect, useMemo, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';

import { ExerciseCard } from '@/components/workout/ExerciseCard';
import { Screen } from '@/components/ui/Screen';
import { useExerciseStore } from '@/stores/exercise.store';
import { useThemeColors } from '@/theme/use-theme-colors';
import { useWorkoutStore } from '@/stores/workout.store';

export default function ExercisePickerScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const exercises = useExerciseStore((s) => s.exercises);
  const load = useExerciseStore((s) => s.load);
  const addSet = useWorkoutStore((s) => s.addSet);
  const [query, setQuery] = useState('');

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return exercises;
    return exercises.filter((e) => e.name.toLowerCase().includes(q));
  }, [exercises, query]);

  function selectExercise(exerciseId: string) {
    addSet(exerciseId, { reps: 0, weightKg: 0, completed: false });
    router.back();
  }

  return (
    <Screen>
      <View className="pt-4 pb-3">
        <Text className="font-display-bold text-2xl text-fg">Elige un ejercicio</Text>
      </View>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Buscar ejercicio..."
        placeholderTextColor={colors.muted}
        className="bg-muted/30 border border-border rounded-2xl px-4 py-3 font-body text-fg mb-3"
      />
      {filtered.map((item) => (
        <ExerciseCard key={item.id} exercise={item} onPress={() => selectExercise(item.id)} />
      ))}
    </Screen>
  );
}
