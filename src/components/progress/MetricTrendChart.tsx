import { Text, View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

import { useThemeColors } from '@/theme/use-theme-colors';

export interface TrendPoint {
  date: string;
  value: number;
  label: string;
}

interface MetricTrendChartProps {
  points: TrendPoint[];
  unit: string;
  emptyMessage: string;
  decimals?: number;
}

// Fewer than 4 points makes a line chart look sparse/meaningless — a simple
// before/after readout communicates the same information more clearly.
const MIN_POINTS_FOR_CHART = 4;

export function MetricTrendChart({ points, unit, emptyMessage, decimals = 1 }: MetricTrendChartProps) {
  const colors = useThemeColors();

  if (points.length === 0) {
    return (
      <View className="bg-muted/30 border border-border rounded-2xl p-6 items-center">
        <Text className="font-body text-muted text-center">{emptyMessage}</Text>
      </View>
    );
  }

  if (points.length < MIN_POINTS_FOR_CHART) {
    const first = points[0];
    const last = points[points.length - 1];
    const delta = last.value - first.value;
    return (
      <View className="bg-muted/30 border border-border rounded-2xl p-5">
        <Text className="font-body text-muted text-sm mb-2">
          Necesitas {MIN_POINTS_FOR_CHART - points.length} registro(s) más para ver la tendencia en un gráfico
        </Text>
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="font-body text-muted text-xs">{first.label}</Text>
            <Text className="font-display-bold text-fg" style={{ fontSize: 20 }}>
              {first.value.toFixed(decimals)} {unit}
            </Text>
          </View>
          <Text className={`font-body-semibold ${delta <= 0 ? 'text-accent' : 'text-destructive'}`}>
            {delta > 0 ? '+' : ''}
            {delta.toFixed(decimals)} {unit}
          </Text>
          <View className="items-end">
            <Text className="font-body text-muted text-xs">{last.label}</Text>
            <Text className="font-display-bold text-fg" style={{ fontSize: 20 }}>
              {last.value.toFixed(decimals)} {unit}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  const data = points.map((p) => ({ value: p.value, label: p.label }));

  return (
    <View className="bg-muted/30 border border-border rounded-2xl p-4">
      <LineChart
        data={data}
        color={colors.primary}
        thickness={3}
        curved
        dataPointsColor={colors.primary}
        yAxisTextStyle={{ color: colors.foreground }}
        xAxisLabelTextStyle={{ color: colors.foreground, fontSize: 10 }}
        yAxisColor={colors.border}
        xAxisColor={colors.border}
        rulesColor={colors.border}
        areaChart
        startFillColor={colors.primary}
        startOpacity={0.25}
        endOpacity={0}
        noOfSections={4}
        height={160}
        adjustToWidth
      />
    </View>
  );
}
