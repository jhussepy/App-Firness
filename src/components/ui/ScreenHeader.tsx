import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

import { useThemeColors } from '@/theme/use-theme-colors';

interface ScreenHeaderProps {
  title: string;
  rightSlot?: ReactNode;
}

// Every pushed (non-tab-root) screen needs an on-screen way back — relying on
// OS swipe-back / browser-back alone leaves web and some Android users
// stranded, since we run the whole app with headerShown: false.
export function ScreenHeader({ title, rightSlot }: ScreenHeaderProps) {
  const router = useRouter();
  const colors = useThemeColors();

  return (
    <View className="flex-row items-center justify-between pt-4 pb-3 gap-3">
      <View className="flex-row items-center gap-3 flex-1">
        <Pressable onPress={() => router.back()} hitSlop={12} accessibilityLabel="Volver">
          <ArrowLeft color={colors.foreground} size={22} />
        </Pressable>
        <Text className="font-display-bold text-2xl text-fg flex-1" numberOfLines={1}>
          {title}
        </Text>
      </View>
      {rightSlot}
    </View>
  );
}
