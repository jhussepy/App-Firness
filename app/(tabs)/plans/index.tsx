import { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';

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
      <View className="pt-4 pb-4 flex-row items-start justify-between">
        <View>
          <Text className="font-display-bold text-3xl text-fg">Planes</Text>
          <Text className="font-body text-base text-muted mt-1">Rutinas predefinidas y personalizadas</Text>
        </View>
        <Pressable
          onPress={() => router.push('/(tabs)/plans/create')}
          accessibilityLabel="Crear rutina"
          className="w-10 h-10 rounded-full bg-primary items-center justify-center active:opacity-85"
        >
          <Plus color="white" size={20} />
        </Pressable>
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
