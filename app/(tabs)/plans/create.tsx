import { useEffect } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Minus, Plus, X } from 'lucide-react-native';

import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { TextField } from '@/components/ui/TextField';
import { useExerciseStore } from '@/stores/exercise.store';
import { usePlanStore } from '@/stores/plan.store';
import { useRoutineDraftStore } from '@/stores/routine-draft.store';
import { useThemeColors } from '@/theme/use-theme-colors';

export default function CreateRoutineScreen() {
  const router = useRouter();
  const colors = useThemeColors();

  const { name, description, exercises, setName, setDescription, removeExercise, updateExercise, reset } =
    useRoutineDraftStore();
  const createCustomRoutine = usePlanStore((s) => s.createCustomRoutine);
  const getExercise = useExerciseStore((s) => s.getById);
  const loadExercises = useExerciseStore((s) => s.load);
  const exercisesLoaded = useExerciseStore((s) => s.isLoaded);

  useEffect(() => {
    if (!exercisesLoaded) loadExercises();
  }, [exercisesLoaded, loadExercises]);

  // Reset the draft only when leaving this screen entirely (not on every
  // render — this effect's cleanup fires on unmount, not on the picker
  // round-trip since that only pushes a sibling screen on top).
  useEffect(() => {
    return () => reset();
  }, [reset]);

  const canSave = name.trim().length > 0 && exercises.length > 0;

  async function handleSave() {
    if (!canSave) return;
    await createCustomRoutine(name.trim(), description.trim(), exercises);
    reset();
    router.back();
  }

  return (
    <Screen>
      <ScreenHeader title="Crear rutina" />

      <TextField label="Nombre" value={name} onChangeText={setName} placeholder="Ej. Día de piernas" />
      <TextField
        label="Descripción (opcional)"
        value={description}
        onChangeText={setDescription}
        placeholder="Breve descripción de la rutina"
      />

      <Text className="font-body-medium text-sm text-muted mb-2 mt-2">
        Ejercicios {exercises.length > 0 ? `(${exercises.length})` : ''}
      </Text>

      {exercises.length === 0 ? (
        <View className="bg-muted/30 border border-border rounded-2xl p-5 items-center mb-3">
          <Text className="font-body text-muted text-center">Agrega al menos un ejercicio</Text>
        </View>
      ) : (
        exercises.map((re) => {
          const exercise = getExercise(re.exerciseId);
          return (
            <View
              key={re.exerciseId}
              className="bg-muted/30 border border-border rounded-2xl px-4 py-3 mb-2"
            >
              <View className="flex-row items-center justify-between mb-2">
                <Text className="font-body-semibold text-fg flex-1">{exercise?.name ?? 'Ejercicio'}</Text>
                <Pressable onPress={() => removeExercise(re.exerciseId)} hitSlop={8}>
                  <X color={colors.muted} size={16} />
                </Pressable>
              </View>
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                  <Text className="font-body text-muted text-sm">Series</Text>
                  <Pressable
                    onPress={() => updateExercise(re.exerciseId, { targetSets: Math.max(1, re.targetSets - 1) })}
                    className="w-7 h-7 rounded-full border border-border items-center justify-center"
                  >
                    <Minus color={colors.foreground} size={14} />
                  </Pressable>
                  <Text className="font-body-semibold text-fg w-5 text-center">{re.targetSets}</Text>
                  <Pressable
                    onPress={() => updateExercise(re.exerciseId, { targetSets: re.targetSets + 1 })}
                    className="w-7 h-7 rounded-full border border-border items-center justify-center"
                  >
                    <Plus color={colors.foreground} size={14} />
                  </Pressable>
                </View>
                <View className="flex-row items-center gap-2">
                  <Text className="font-body text-muted text-sm">Reps</Text>
                  <TextInput
                    value={re.targetReps}
                    onChangeText={(v) => updateExercise(re.exerciseId, { targetReps: v })}
                    placeholder="8-12"
                    placeholderTextColor={colors.muted}
                    className="w-16 text-center font-body text-fg bg-bg rounded-lg py-1.5 border border-border"
                  />
                </View>
              </View>
            </View>
          );
        })
      )}

      <Pressable
        onPress={() => router.push('/(tabs)/plans/pick-exercise')}
        className="flex-row items-center justify-center gap-2 border border-dashed border-primary rounded-2xl py-3.5 mb-6 mt-1 active:opacity-70"
      >
        <Plus color={colors.primary} size={18} />
        <Text className="font-body-semibold text-primary">Agregar ejercicio</Text>
      </Pressable>

      <PrimaryButton label="Guardar rutina" onPress={handleSave} disabled={!canSave} />
    </Screen>
  );
}
