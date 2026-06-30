import { Text, View } from 'react-native';

import { Screen } from '@/components/ui/Screen';

export default function DashboardScreen() {
  return (
    <Screen>
      <View className="pt-4 pb-6">
        <Text className="font-display-bold text-3xl text-fg">Dashboard</Text>
        <Text className="font-body text-base text-muted mt-1">
          Today's summary will live here.
        </Text>
      </View>
    </Screen>
  );
}
