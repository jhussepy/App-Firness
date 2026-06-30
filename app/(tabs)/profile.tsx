import { Pressable, Text, View } from 'react-native';

import { Screen } from '@/components/ui/Screen';
import { useThemeStore } from '@/stores/theme.store';

export default function ProfileScreen() {
  const mode = useThemeStore((s) => s.mode);
  const toggle = useThemeStore((s) => s.toggle);

  return (
    <Screen>
      <View className="pt-4 pb-6">
        <Text className="font-display-bold text-3xl text-fg">Profile</Text>
        <Text className="font-body text-base text-muted mt-1">
          Profile details and settings will live here.
        </Text>
      </View>
      <Pressable
        onPress={toggle}
        className="bg-muted border border-border rounded-lg px-4 py-3 active:opacity-70"
      >
        <Text className="font-body-medium text-fg">
          Theme: {mode === 'dark' ? 'Dark' : 'Light'} (tap to toggle)
        </Text>
      </Pressable>
    </Screen>
  );
}
