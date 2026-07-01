import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { RoutineCard } from '@/components/plans/RoutineCard';
import { Screen } from '@/components/ui/Screen';
import { usePlanStore } from '@/stores/plan.store';

export default function PlansScreen() {
  const router = useRouter();
  const routines = usePlanStore((s) => s.routines);
  const scheduledRoutines = usePlanStore((s) => s.scheduledRoutines);
  const isLoaded = usePlanStore((s) => s.isLoaded);
  const load = usePlanStore((s) => s.load);

  useEffect(() => {
    if (!isLoaded) load();
  }, [isLoaded, load]);

  function daysFor(routineId: string): number[] | undefined {
    return scheduledRoutines.find((s) => s.routineId === routineId && s.active)?.daysOfWeek;
  }

  return (
    <Screen>
      <View className="pt-4 pb-4">
        <Text className="font-display-bold text-3xl text-fg">Plans</Text>
        <Text className="font-body text-base text-muted mt-1">Rutinas predefinidas y personalizadas</Text>
      </View>

      {routines.map((routine) => (
        <RoutineCard
          key={routine.id}
          routine={routine}
          scheduledDays={daysFor(routine.id)}
          onPress={() => router.push(`/(tabs)/plans/${routine.id}`)}
        />
      ))}
    </Screen>
  );
}
