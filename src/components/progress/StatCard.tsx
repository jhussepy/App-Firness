import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string;
}

export function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <View className="flex-1 bg-muted/30 border border-border rounded-2xl p-4 items-center">
      {icon}
      <Text className="font-display-bold text-fg mt-2" style={{ fontSize: 18 }}>
        {value}
      </Text>
      <Text className="font-body text-muted text-xs mt-0.5 text-center">{label}</Text>
    </View>
  );
}
