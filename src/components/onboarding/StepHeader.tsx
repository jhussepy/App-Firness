import { Text, View } from 'react-native';

interface StepHeaderProps {
  icon: string;
  title: string;
  subtitle?: string;
}

export function StepHeader({ icon, title, subtitle }: StepHeaderProps) {
  return (
    <View className="items-center pt-6 pb-8">
      <Text style={{ fontSize: 56 }}>{icon}</Text>
      <Text className="font-display-bold text-2xl text-fg text-center mt-4">{title}</Text>
      {subtitle ? (
        <Text className="font-body text-base text-muted text-center mt-2 px-2">{subtitle}</Text>
      ) : null}
    </View>
  );
}
