import { useEffect, useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Info, Plus } from 'lucide-react-native';

import { Screen } from '@/components/ui/Screen';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SessionTimer } from '@/components/workout/SessionTimer';
import { SetRow } from '@/components/workout/SetRow';
import { useExerciseStore } from '@/stores/exercise.store';
import { useWorkoutStore } from '@/stores/workout.store';
import { useThemeColors } from '@/theme/use-theme-colors';
import type { SetEntry, WorkoutSession } from '@/data/models/workout';

function groupSetsByExercise(sets: SetEntry[]): { exerciseId: string; sets: SetEntry[] }[] {
  const order: string[] = [];
  const map = new Map<string, SetEntry[]>();
  for (const set of sets) {
    if (!map.has(set.exerciseId)) {
      map.set(set.exerciseId, []);
      order.push(set.exerciseId);
    }
    map.get(set.exerciseId)!.push(set);
  }
  return order.map((exerciseId) => ({ exerciseId, sets: map.get(exerciseId)! }));
}

export default function SessionDetailScreen() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const router = useRouter();
  const colors = useThemeColors();
  const getExercise = useExerciseStore((s) => s.getById);
  const loadExercises = useExerciseStore((s) => s.load);
  const exercisesLoaded = useExerciseStore((s) => s.isLoaded);

  const activeSession = useWorkoutStore((s) => s.activeSession);
  const history = useWorkoutStore((s) => s.history);
  const isHistoryLoaded = useWorkoutStore((s) => s.isLoaded);
  const loadHistory = useWorkoutStore((s) => s.loadHistory);
  const addSet = useWorkoutStore((s) => s.addSet);
  const toggleSetCompleted = useWorkoutStore((s) => s.toggleSetCompleted);
  const completeSession = useWorkoutStore((s) => s.completeSession);
  const discardSession = useWorkoutStore((s) => s.discardSession);

  // Direct/deep links can land here before workouts/index.tsx ever mounts,
  // so this screen can't assume that screen already loaded the history.
  useEffect(() => {
    if (!exercisesLoaded) loadExercises();
    if (!isHistoryLoaded) loadHistory();
  }, [exercisesLoaded, loadExercises, isHistoryLoaded, loadHistory]);

  const isActive = sessionId === 'active';
  const session: WorkoutSession | undefined = isActive
    ? activeSession ?? undefined
    : history.find((s) => s.id === sessionId);

  const groups = useMemo(() => (session ? groupSetsByExercise(session.sets) : []), [session]);

  if (!session) {
    return (
      <Screen>
        <ScreenHeader title="Sesión" />
        <View className="pt-12 items-center">
          <Text className="font-body text-muted">
            {!isActive && !isHistoryLoaded ? 'Cargando...' : 'Sesión no encontrada.'}
          </Text>
        </View>
      </Screen>
    );
  }

  async function handleComplete() {
    await completeSession();
    router.replace('/(tabs)/workouts');
  }

  function handleDiscard() {
    discardSession();
    router.replace('/(tabs)/workouts');
  }

  // Stub setReps/setWeight helpers that mutate via the store's addSet-shaped API isn't
  // available for editing existing sets, so we patch through a small local updater.
  function updateSet(setId: string, patch: Partial<Pick<SetEntry, 'reps' | 'weightKg'>>) {
    useWorkoutStore.setState((state) => {
      if (!state.activeSession) return state;
      return {
        activeSession: {
          ...state.activeSession,
          sets: state.activeSession.sets.map((s) => (s.id === setId ? { ...s, ...patch } : s)),
        },
      };
    });
  }

  return (
    <Screen>
      <ScreenHeader
        title={isActive ? 'Entrenamiento activo' : 'Detalle de sesión'}
        rightSlot={isActive ? <SessionTimer startedAt={session.startedAt} /> : undefined}
      />

      {groups.length === 0 ? (
        <View className="bg-muted/30 border border-border rounded-2xl p-6 items-center mb-4">
          <Text className="font-body text-muted text-center">
            {isActive ? 'Agrega tu primer ejercicio para empezar' : 'Sin ejercicios registrados'}
          </Text>
        </View>
      ) : null}

      {groups.map(({ exerciseId, sets }) => {
        const exercise = getExercise(exerciseId);
        return (
          <View key={exerciseId} className="mb-5">
            <Pressable
              onPress={() => router.push(`/exercise/${exerciseId}`)}
              accessibilityLabel={`Cómo hacer ${exercise?.name ?? 'este ejercicio'}`}
              className="flex-row items-center gap-1.5 mb-2 self-start active:opacity-70"
            >
              <Text className="font-body-semibold text-fg text-base">{exercise?.name ?? 'Ejercicio'}</Text>
              <Info color={colors.muted} size={14} />
            </Pressable>
            {isActive
              ? sets.map((set) => (
                  <SetRow
                    key={set.id}
                    set={set}
                    onChangeReps={(reps) => updateSet(set.id, { reps })}
                    onChangeWeight={(weightKg) => updateSet(set.id, { weightKg })}
                    onToggleCompleted={() => toggleSetCompleted(set.id)}
                  />
                ))
              : sets.map((set) => (
                  <View key={set.id} className="flex-row justify-between py-1.5 border-b border-border">
                    <Text className="font-body text-muted">Serie {set.setNumber}</Text>
                    <Text className="font-body-medium text-fg">
                      {set.reps} repeticiones × {set.weightKg} kg
                    </Text>
                  </View>
                ))}
            {isActive ? (
              <Pressable
                onPress={() => addSet(exerciseId, { reps: 0, weightKg: 0, completed: false })}
                className="flex-row items-center gap-1.5 mt-1 self-start"
              >
                <Plus color={colors.primary} size={16} />
                <Text className="font-body-medium text-primary text-sm">Agregar serie</Text>
              </Pressable>
            ) : null}
          </View>
        );
      })}

      {isActive ? (
        <>
          <Pressable
            onPress={() => router.push('/(tabs)/workouts/exercise-picker')}
            className="flex-row items-center justify-center gap-2 border border-dashed border-primary rounded-2xl py-3.5 mb-4 active:opacity-70"
          >
            <Plus color={colors.primary} size={18} />
            <Text className="font-body-semibold text-primary">Agregar ejercicio</Text>
          </Pressable>

          <PrimaryButton label="Completar Entrenamiento" onPress={handleComplete} />

          <Pressable onPress={handleDiscard} className="items-center py-4">
            <Text className="font-body text-muted text-sm">Descartar entrenamiento</Text>
          </Pressable>
        </>
      ) : null}
    </Screen>
  );
}
