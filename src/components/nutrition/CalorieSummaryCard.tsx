import { Text, View } from 'react-native';

import type { NutritionTotals } from '@/lib/nutrition-totals';

interface CalorieSummaryCardProps {
  consumed: NutritionTotals;
  target: NutritionTotals;
}

function MacroBar({ label, consumed, target, color }: { label: string; consumed: number; target: number; color: string }) {
  const pct = target > 0 ? Math.min(100, Math.round((consumed / target) * 100)) : 0;
  return (
    <View className="items-center flex-1">
      <Text className="font-body text-muted text-xs">{label}</Text>
      <Text className="font-body-semibold text-fg mt-0.5">
        {Math.round(consumed)} / {Math.round(target)} g
      </Text>
      <View className="h-1.5 w-16 rounded-full bg-border mt-2 overflow-hidden">
        <View className="h-1.5 rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
      </View>
    </View>
  );
}

export function CalorieSummaryCard({ consumed, target }: CalorieSummaryCardProps) {
  const calPct = target.calories > 0 ? Math.min(100, Math.round((consumed.calories / target.calories) * 100)) : 0;

  return (
    <View className="bg-muted/30 border border-border rounded-2xl p-5 mb-4">
      <View className="items-center">
        <Text className="font-display-bold text-fg" style={{ fontSize: 28 }}>
          {Math.round(consumed.calories).toLocaleString()} / {Math.round(target.calories).toLocaleString()}
        </Text>
        <Text className="font-body text-muted text-sm mt-0.5">kcal</Text>
      </View>

      <View className="h-1.5 w-full rounded-full bg-border mt-4 overflow-hidden">
        <View className="h-1.5 rounded-full bg-accent" style={{ width: `${calPct}%` }} />
      </View>

      <View className="flex-row w-full justify-between mt-5">
        <MacroBar label="Proteínas" consumed={consumed.proteinG} target={target.proteinG} color="#3B82F6" />
        <MacroBar label="Carbos" consumed={consumed.carbG} target={target.carbG} color="#F97316" />
        <MacroBar label="Grasas" consumed={consumed.fatG} target={target.fatG} color="#EAB308" />
      </View>
    </View>
  );
}
