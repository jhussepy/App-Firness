import { Text, View } from 'react-native';

import { Screen } from '@/components/ui/Screen';

export default function ProgressScreen() {
  return (
    <Screen>
      <View className="pt-4 pb-6">
        <Text className="font-display-bold text-3xl text-fg">Progress</Text>
        <Text className="font-body text-base text-muted mt-1">
          Weight trend and workout volume charts will live here.
        </Text>
      </View>
    </Screen>
  );
}
