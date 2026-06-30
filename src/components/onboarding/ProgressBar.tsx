import { View } from 'react-native';

interface ProgressBarProps {
  step: number;
  totalSteps: number;
}

export function ProgressBar({ step, totalSteps }: ProgressBarProps) {
  const pct = Math.min(100, Math.round((step / totalSteps) * 100));
  return (
    <View className="h-2 rounded-full bg-muted/40 overflow-hidden">
      <View className="h-2 rounded-full bg-primary" style={{ width: `${pct}%` }} />
    </View>
  );
}
