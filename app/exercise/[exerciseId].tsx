import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { MuscleDiagram } from '@/components/workout/MuscleDiagram';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { EQUIPMENT_LABEL, MUSCLE_LABEL } from '@/lib/exercise-labels';
import { useExerciseStore } from '@/stores/exercise.store';

function Chip({ label }: { label: string }) {
  return (
    <View className="bg-primary/15 border border-primary/40 rounded-full px-3 py-1.5">
      <Text className="font-body-medium text-primary text-xs">{label}</Text>
    </View>
  );
}

export default function ExerciseDetailScreen() {
  const { exerciseId } = useLocalSearchParams<{ exerciseId: string }>();
  const exercises = useExerciseStore((s) => s.exercises);
  const isLoaded = useExerciseStore((s) => s.isLoaded);
  const load = useExerciseStore((s) => s.load);

  // Root-level screen reachable by direct link/hard refresh — it loads its
  // own store instead of assuming a list screen already did.
  useEffect(() => {
    if (!isLoaded) load();
  }, [isLoaded, load]);

  const exercise = exercises.find((e) => e.id === exerciseId);

  if (!exercise) {
    return (
      <Screen>
        <ScreenHeader title="Ejercicio" />
        <View className="pt-12 items-center">
          <Text className="font-body text-muted">
            {isLoaded ? 'Ejercicio no encontrado.' : 'Cargando...'}
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScreenHeader title={exercise.name} />

      <View className="flex-row gap-2 mb-4">
        <Chip label={MUSCLE_LABEL[exercise.muscleGroup]} />
        <Chip label={EQUIPMENT_LABEL[exercise.equipment]} />
      </View>

      <View className="bg-muted/30 border border-border rounded-2xl mb-5">
        <MuscleDiagram muscleGroup={exercise.muscleGroup} />
      </View>

      <Text className="font-body-semibold text-fg text-base mb-3">Cómo hacerlo</Text>
      {exercise.instructions && exercise.instructions.length > 0 ? (
        exercise.instructions.map((step, index) => (
          <View key={index} className="flex-row gap-3 mb-3">
            <View className="w-6 h-6 rounded-full bg-primary items-center justify-center mt-0.5">
              <Text className="font-body-semibold text-white text-xs">{index + 1}</Text>
            </View>
            <Text className="font-body text-fg flex-1 leading-5">{step}</Text>
          </View>
        ))
      ) : (
        <Text className="font-body text-muted">Este ejercicio aún no tiene guía paso a paso.</Text>
      )}

      {exercise.tips ? (
        <View className="bg-accent/10 border border-accent/40 rounded-2xl px-4 py-3 mt-3">
          <Text className="font-body-semibold text-accent text-sm mb-1">Consejo</Text>
          <Text className="font-body text-fg text-sm leading-5">{exercise.tips}</Text>
        </View>
      ) : null}
    </Screen>
  );
}
