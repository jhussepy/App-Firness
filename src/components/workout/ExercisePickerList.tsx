import { useEffect, useMemo, useState } from 'react';
import { TextInput } from 'react-native';

import { ExerciseCard } from './ExerciseCard';
import { useExerciseStore } from '@/stores/exercise.store';
import { useThemeColors } from '@/theme/use-theme-colors';

interface ExercisePickerListProps {
  onSelect: (exerciseId: string) => void;
}

export function ExercisePickerList({ onSelect }: ExercisePickerListProps) {
  const colors = useThemeColors();
  const exercises = useExerciseStore((s) => s.exercises);
  const load = useExerciseStore((s) => s.load);
  const isLoaded = useExerciseStore((s) => s.isLoaded);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!isLoaded) load();
  }, [isLoaded, load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return exercises;
    return exercises.filter((e) => e.name.toLowerCase().includes(q));
  }, [exercises, query]);

  return (
    <>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Buscar ejercicio..."
        placeholderTextColor={colors.muted}
        className="bg-muted/30 border border-border rounded-2xl px-4 py-3 font-body text-fg mb-3"
      />
      {filtered.map((item) => (
        <ExerciseCard key={item.id} exercise={item} onPress={() => onSelect(item.id)} />
      ))}
    </>
  );
}
