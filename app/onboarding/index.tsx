import { Text, View } from 'react-native';

import { Screen } from '@/components/ui/Screen';

export default function OnboardingScreen() {
  return (
    <Screen>
      <View className="pt-12">
        <Text className="font-display-bold text-3xl text-fg">Welcome to App-Firness</Text>
        <Text className="font-body text-base text-muted mt-2">
          Profile setup will live here.
        </Text>
      </View>
    </Screen>
  );
}
