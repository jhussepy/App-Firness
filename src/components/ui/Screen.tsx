import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ScreenProps {
  children: ReactNode;
  scroll?: boolean;
}

// md:max-w-lg + md:mx-auto keeps this a comfortable mobile-app-width column
// on wide (tablet/desktop web) viewports instead of stretching edge-to-edge.
export function Screen({ children, scroll = true }: ScreenProps) {
  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      <View className="flex-1 w-full md:max-w-lg md:mx-auto">
        {scroll ? (
          <ScrollView className="flex-1 px-4" contentContainerClassName="pb-8">
            {children}
          </ScrollView>
        ) : (
          <View className="flex-1 px-4">{children}</View>
        )}
      </View>
    </SafeAreaView>
  );
}
