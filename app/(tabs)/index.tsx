import { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Camera, CalendarRange, Dumbbell, Flame, Minus, Scale, TrendingDown, TrendingUp } from 'lucide-react-native';

import { CalorieSummaryCard } from '@/components/nutrition/CalorieSummaryCard';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Screen } from '@/components/ui/Screen';
import { todayISODate } from '@/lib/date';
import { entriesForDate, macroTargetsToTotals, totalsForEntries } from '@/lib/nutrition-totals';
import { findNextScheduledRoutine, labelForDaysUntil } from '@/lib/next-scheduled-routine';
import { startSessionFromRoutine } from '@/lib/start-routine-session';
import { currentLoggingStreak } from '@/lib/streak';
import { useNutritionStore } from '@/stores/nutrition.store';
import { usePlanStore } from '@/stores/plan.store';
import { useProfileStore } from '@/stores/profile.store';
import { useProgressStore } from '@/stores/progress.store';
import { useWorkoutStore } from '@/stores/workout.store';
import { useThemeColors } from '@/theme/use-theme-colors';

export default function DashboardScreen() {
  const router = useRouter();
  const colors = useThemeColors();

  const profile = useProfileStore((s) => s.profile);
  const loadProfile = useProfileStore((s) => s.load);

  const { foods, entries, isLoaded: isNutritionLoaded, load: loadNutrition } = useNutritionStore();

  const routines = usePlanStore((s) => s.routines);
  const scheduledRoutines = usePlanStore((s) => s.scheduledRoutines);
  const isPlanLoaded = usePlanStore((s) => s.isLoaded);
  const loadPlan = usePlanStore((s) => s.load);

  const metrics = useProgressStore((s) => s.metrics);
  const isMetricsLoaded = useProgressStore((s) => s.isLoaded);
  const loadMetrics = useProgressStore((s) => s.load);

  const activeSession = useWorkoutStore((s) => s.activeSession);
  const startSession = useWorkoutStore((s) => s.startSession);
  const addSet = useWorkoutStore((s) => s.addSet);

  useEffect(() => {
    loadProfile();
    if (!isNutritionLoaded) loadNutrition();
    if (!isPlanLoaded) loadPlan();
    if (!isMetricsLoaded) loadMetrics();
  }, [loadProfile, isNutritionLoaded, loadNutrition, isPlanLoaded, loadPlan, isMetricsLoaded, loadMetrics]);

  const firstName = profile?.name?.split(' ')[0] ?? '';

  const todaysEntries = entriesForDate(entries, todayISODate());
  const consumed = totalsForEntries(todaysEntries, foods);
  const target = macroTargetsToTotals(
    profile?.dailyMacroTargets ?? { proteinG: 0, carbG: 0, fatG: 0 },
    profile?.dailyCalorieTarget ?? 0
  );

  const streak = currentLoggingStreak(entries);

  const weightMetrics = metrics.filter((m) => m.type === 'weight');
  const latestWeight = weightMetrics[weightMetrics.length - 1];
  const previousWeight = weightMetrics[weightMetrics.length - 2];
  const weightDelta = latestWeight && previousWeight ? latestWeight.value - previousWeight.value : 0;

  const next = findNextScheduledRoutine(scheduledRoutines, routines);

  function handleStartNext() {
    if (!next) return;
    startSessionFromRoutine(next.routine, { startSession, addSet });
    router.push('/(tabs)/workouts/active');
  }

  function handleQuickStart() {
    if (!activeSession) startSession();
    router.push('/(tabs)/workouts/active');
  }

  return (
    <Screen wide>
      <View className="pt-4 pb-4">
        <Text className="font-display-bold text-3xl text-fg">
          {firstName ? `Hola, ${firstName}` : 'Dashboard'}
        </Text>
        <Text className="font-body text-base text-muted mt-1">Este es tu resumen de hoy.</Text>
      </View>

      <View className="md:flex-row md:gap-4">
        <View className="md:flex-1">
          {profile?.dailyCalorieTarget ? <CalorieSummaryCard consumed={consumed} target={target} /> : null}

          <View className="flex-row gap-3 mt-1 mb-1">
            <Pressable
              onPress={() => router.push('/(tabs)/nutrition/scan')}
              className="flex-1 flex-row items-center justify-center gap-2 bg-muted/30 border border-border rounded-2xl py-3.5 active:opacity-80"
            >
              <Camera color={colors.primary} size={18} />
              <Text className="font-body-semibold text-fg text-sm">Escanear comida</Text>
            </Pressable>
            <Pressable
              onPress={handleQuickStart}
              className="flex-1 flex-row items-center justify-center gap-2 bg-muted/30 border border-border rounded-2xl py-3.5 active:opacity-80"
            >
              <Dumbbell color={colors.primary} size={18} />
              <Text className="font-body-semibold text-fg text-sm">
                {activeSession ? 'Continuar' : 'Entrenar'}
              </Text>
            </Pressable>
          </View>
        </View>

        <View className="md:flex-1">
          <View className="flex-row gap-3 mt-1 mb-1">
            <View className="flex-1 bg-muted/30 border border-border rounded-2xl p-4 items-center">
              <Flame color={colors.primary} size={20} />
              <Text className="font-display-bold text-fg mt-2" style={{ fontSize: 18 }}>
                {streak}
              </Text>
              <Text className="font-body text-muted text-xs mt-0.5 text-center">
                {streak === 1 ? 'día seguido' : 'días seguidos'}
              </Text>
            </View>
            <View className="flex-1 bg-muted/30 border border-border rounded-2xl p-4 items-center">
              <Scale color={colors.primary} size={20} />
              <View className="flex-row items-center gap-1 mt-2">
                <Text className="font-display-bold text-fg" style={{ fontSize: 18 }}>
                  {latestWeight ? `${latestWeight.value} kg` : '—'}
                </Text>
                {weightDelta !== 0 ? (
                  weightDelta < 0 ? (
                    <TrendingDown color={colors.accent} size={14} />
                  ) : (
                    <TrendingUp color={colors.destructive} size={14} />
                  )
                ) : latestWeight ? (
                  <Minus color={colors.muted} size={14} />
                ) : null}
              </View>
              <Text className="font-body text-muted text-xs mt-0.5 text-center">Peso actual</Text>
            </View>
          </View>

          <View className="bg-muted/30 border border-border rounded-2xl p-5 mt-1">
            <View className="flex-row items-center gap-2 mb-1">
              {next ? (
                <CalendarRange color={colors.primary} size={18} />
              ) : (
                <Dumbbell color={colors.muted} size={18} />
              )}
              <Text className="font-body-semibold text-fg">Próximo entrenamiento</Text>
            </View>

            {next ? (
              <>
                <Text className="font-body text-fg text-base mt-1">{next.routine.name}</Text>
                <Text className="font-body text-muted text-sm mt-0.5">
                  {labelForDaysUntil(next.daysUntil)} · {next.routine.exercises.length} ejercicios
                </Text>
                {next.daysUntil === 0 ? (
                  <View className="mt-3">
                    <PrimaryButton label="Comenzar ahora" onPress={handleStartNext} />
                  </View>
                ) : null}
              </>
            ) : (
              <>
                <Text className="font-body text-muted text-sm mt-1">
                  Aún no has programado ninguna rutina.
                </Text>
                <Pressable
                  onPress={() => router.push('/(tabs)/plans')}
                  className="mt-3 self-start active:opacity-70"
                >
                  <Text className="font-body-semibold text-primary text-sm">Ir a Planes →</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </View>
    </Screen>
  );
}
