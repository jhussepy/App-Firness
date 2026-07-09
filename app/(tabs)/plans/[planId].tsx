import { useEffect, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { ScheduleDayPicker } from '@/components/plans/ScheduleDayPicker';
import { startSessionFromRoutine } from '@/lib/start-routine-session';
import { useExerciseStore } from '@/stores/exercise.store';
import { usePlanStore } from '@/stores/plan.store';
import { useWorkoutStore } from '@/stores/workout.store';

export default function RoutineDetailScreen() {
  const { planId } = useLocalSearchParams<{ planId: string }>();
  const router = useRouter();

  const routines = usePlanStore((s) => s.routines);
  const scheduledRoutines = usePlanStore((s) => s.scheduledRoutines);
  const scheduleRoutine = usePlanStore((s) => s.scheduleRoutine);
  const unscheduleRoutine = usePlanStore((s) => s.unscheduleRoutine);

  const getExercise = useExerciseStore((s) => s.getById);
  const loadExercises = useExerciseStore((s) => s.load);
  const exercisesLoaded = useExerciseStore((s) => s.isLoaded);

  const startSession = useWorkoutStore((s) => s.startSession);
  const addSet = useWorkoutStore((s) => s.addSet);

  useEffect(() => {
    if (!exercisesLoaded) loadExercises();
  }, [exercisesLoaded, loadExercises]);

  const routine = routines.find((r) => r.id === planId);
  const existingSchedule = useMemo(
    () => scheduledRoutines.find((s) => s.routineId === planId && s.active),
    [scheduledRoutines, planId]
  );
  const [selectedDays, setSelectedDays] = useState<number[]>(() => existingSchedule?.daysOfWeek ?? []);

  if (!routine) {
    return (
      <Screen>
        <ScreenHeader title="Rutina" />
        <View className="pt-12 items-center">
          <Text className="font-body text-muted">Rutina no encontrada.</Text>
        </View>
      </Screen>
    );
  }

  function toggleDay(day: number) {
    setSelectedDays((days) => (days.includes(day) ? days.filter((d) => d !== day) : [...days, day]));
  }

  async function saveSchedule() {
    if (existingSchedule) await unscheduleRoutine(existingSchedule.id);
    if (selectedDays.length > 0) await scheduleRoutine(routine!.id, selectedDays);
  }

  function handleStart() {
    startSessionFromRoutine(routine!, { startSession, addSet });
    router.push('/(tabs)/workouts/active');
  }

  return (
    <Screen>
      <ScreenHeader title={routine.name} />
      {routine.description ? (
        <Text className="font-body text-muted text-sm mb-4 -mt-2">{routine.description}</Text>
      ) : null}

      <View className="mb-6">
        {routine.exercises.map((re) => {
          const exercise = getExercise(re.exerciseId);
          return (
            <View
              key={`${re.exerciseId}-${re.order}`}
              className="flex-row justify-between items-center py-2.5 border-b border-border"
            >
              <Text className="font-body text-fg">{exercise?.name ?? 'Ejercicio'}</Text>
              <Text className="font-body text-muted text-sm">
                {re.targetSets} × {re.targetReps}
              </Text>
            </View>
          );
        })}
      </View>

      <View className="mb-4">
        <PrimaryButton label="Iniciar Entrenamiento" onPress={handleStart} />
      </View>

      <Text className="font-body-medium text-sm text-muted mb-3">Programar días</Text>
      <ScheduleDayPicker selectedDays={selectedDays} onToggleDay={toggleDay} />
      <View className="mt-4">
        <PrimaryButton label="Guardar horario" onPress={saveSchedule} />
      </View>
    </Screen>
  );
}
