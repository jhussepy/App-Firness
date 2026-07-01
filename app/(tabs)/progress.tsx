import { useEffect, useMemo, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { Dumbbell, Flame, Scale } from 'lucide-react-native';

import { MetricTrendChart } from '@/components/progress/MetricTrendChart';
import { StatCard } from '@/components/progress/StatCard';
import { Screen } from '@/components/ui/Screen';
import { formatShortDate } from '@/lib/date';
import { entriesForDate, totalsForEntries } from '@/lib/nutrition-totals';
import { useNutritionStore } from '@/stores/nutrition.store';
import { useProgressStore } from '@/stores/progress.store';
import { useWorkoutStore } from '@/stores/workout.store';
import { useThemeColors } from '@/theme/use-theme-colors';

function sessionVolume(sets: { reps: number; weightKg: number }[]): number {
  return sets.reduce((sum, s) => sum + s.reps * s.weightKg, 0);
}

export default function ProgressScreen() {
  const colors = useThemeColors();
  const metrics = useProgressStore((s) => s.metrics);
  const isMetricsLoaded = useProgressStore((s) => s.isLoaded);
  const loadMetrics = useProgressStore((s) => s.load);
  const logMetric = useProgressStore((s) => s.logMetric);

  const history = useWorkoutStore((s) => s.history);
  const isHistoryLoaded = useWorkoutStore((s) => s.isLoaded);
  const loadHistory = useWorkoutStore((s) => s.loadHistory);

  const { foods, entries, isLoaded: isNutritionLoaded, load: loadNutrition } = useNutritionStore();

  const [newWeight, setNewWeight] = useState('');

  useEffect(() => {
    if (!isMetricsLoaded) loadMetrics();
    if (!isHistoryLoaded) loadHistory();
    if (!isNutritionLoaded) loadNutrition();
  }, [isMetricsLoaded, loadMetrics, isHistoryLoaded, loadHistory, isNutritionLoaded, loadNutrition]);

  const weightPoints = useMemo(
    () =>
      metrics
        .filter((m) => m.type === 'weight')
        .map((m) => ({ date: m.date, value: m.value, label: formatShortDate(m.date) })),
    [metrics]
  );

  const volumePoints = useMemo(
    () =>
      history
        .filter((s) => s.completedAt)
        .map((s) => ({
          date: s.completedAt!,
          value: sessionVolume(s.sets),
          label: formatShortDate(s.completedAt!),
        }))
        .sort((a, b) => a.date.localeCompare(b.date)),
    [history]
  );

  const currentWeight = weightPoints.length > 0 ? weightPoints[weightPoints.length - 1].value : undefined;

  const workoutsThisMonth = useMemo(() => {
    const now = new Date();
    return history.filter((s) => {
      const d = new Date(s.startedAt);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;
  }, [history]);

  const avgCalories7Day = useMemo(() => {
    let sum = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const iso = d.toISOString().slice(0, 10);
      sum += totalsForEntries(entriesForDate(entries, iso), foods).calories;
    }
    return Math.round(sum / 7);
  }, [entries, foods]);

  async function handleLogWeight() {
    const value = parseFloat(newWeight);
    if (!value) return;
    await logMetric({ date: new Date().toISOString(), type: 'weight', value, unit: 'kg' });
    setNewWeight('');
  }

  return (
    <Screen>
      <View className="pt-4 pb-4">
        <Text className="font-display-bold text-3xl text-fg">Progress</Text>
      </View>

      <View className="flex-row gap-3 mb-5">
        <StatCard
          icon={<Scale color={colors.primary} size={20} />}
          label="Peso actual"
          value={currentWeight ? `${currentWeight} kg` : '—'}
        />
        <StatCard
          icon={<Dumbbell color={colors.primary} size={20} />}
          label="Entrenamientos este mes"
          value={String(workoutsThisMonth)}
        />
        <StatCard
          icon={<Flame color={colors.primary} size={20} />}
          label="Kcal prom. (7 días)"
          value={avgCalories7Day.toLocaleString()}
        />
      </View>

      <Text className="font-body-semibold text-fg text-base mb-2">Tendencia de peso</Text>
      <View className="mb-3">
        <MetricTrendChart points={weightPoints} unit="kg" emptyMessage="Aún no hay registros de peso." />
      </View>
      <View className="flex-row items-center gap-2 mb-6">
        <TextInput
          value={newWeight}
          onChangeText={setNewWeight}
          placeholder="Nuevo peso (kg)"
          placeholderTextColor={colors.muted}
          keyboardType="decimal-pad"
          className="flex-1 bg-muted/30 border border-border rounded-2xl px-4 py-3 font-body text-fg"
        />
        <Pressable
          onPress={handleLogWeight}
          className="bg-primary rounded-2xl px-5 py-3.5 active:opacity-85"
        >
          <Text className="font-body-semibold text-white">Registrar</Text>
        </Pressable>
      </View>

      <Text className="font-body-semibold text-fg text-base mb-2">Volumen de entrenamiento</Text>
      <MetricTrendChart
        points={volumePoints}
        unit="kg"
        decimals={0}
        emptyMessage="Completa entrenamientos para ver tu volumen total."
      />
    </Screen>
  );
}
