import { Text, View } from 'react-native';

import { Screen } from '@/components/ui/Screen';

export default function WorkoutsScreen() {
  return (
    <Screen>
      <View className="pt-4 pb-6">
        <Text className="font-display-bold text-3xl text-fg">Workouts</Text>
        <Text className="font-body text-base text-muted mt-1">
          Session history and "start workout" will live here.
        </Text>
      </View>
    </Screen>
  );
}
