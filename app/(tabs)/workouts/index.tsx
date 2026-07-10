import { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { LoadingState } from '@/components/ui/LoadingState';
import { Screen } from '@/components/ui/Screen';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useWorkoutStore } from '@/stores/workout.store';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

export default function WorkoutsScreen() {
  const router = useRouter();
  const history = useWorkoutStore((s) => s.history);
  const activeSession = useWorkoutStore((s) => s.activeSession);
  const isLoaded = useWorkoutStore((s) => s.isLoaded);
  const loadHistory = useWorkoutStore((s) => s.loadHistory);
  const startSession = useWorkoutStore((s) => s.startSession);

  useEffect(() => {
    if (!isLoaded) loadHistory();
  }, [isLoaded, loadHistory]);

  function handleStart() {
    if (!activeSession) startSession();
    router.push('/(tabs)/workouts/active');
  }

  return (
    <Screen>
      <View className="pt-4 pb-4">
        <Text className="font-display-bold text-3xl text-fg">Entrenamientos</Text>
        <Text className="font-body text-base text-muted mt-1">Tu historial de entrenamientos</Text>
      </View>

      {!isLoaded ? (
        <LoadingState />
      ) : (
        <>
          {activeSession ? (
            <Pressable
              onPress={() => router.push('/(tabs)/workouts/active')}
              className="bg-accent/15 border border-accent rounded-2xl px-4 py-4 mb-4 active:opacity-80"
            >
              <Text className="font-body-semibold text-accent">Tienes un entrenamiento en curso</Text>
              <Text className="font-body text-muted text-sm mt-0.5">Toca para continuar</Text>
            </Pressable>
          ) : (
            <View className="mb-4">
              <PrimaryButton label="Iniciar Entrenamiento" onPress={handleStart} />
            </View>
          )}

          {history.length === 0 ? (
            <View className="bg-muted/30 border border-border rounded-2xl p-6 items-center">
              <Text className="font-body text-muted text-center">Aún no tienes entrenamientos registrados.</Text>
            </View>
          ) : (
            history.map((session) => (
              <Pressable
                key={session.id}
                onPress={() => router.push(`/(tabs)/workouts/${session.id}`)}
                className="bg-muted/30 border border-border rounded-2xl px-4 py-4 mb-3 active:opacity-80"
              >
                <View className="flex-row justify-between items-center">
                  <Text className="font-body-semibold text-fg">{formatDate(session.startedAt)}</Text>
                  <Text className="font-body text-muted text-sm">{session.sets.length} series</Text>
                </View>
              </Pressable>
            ))
          )}
        </>
      )}
    </Screen>
  );
}
