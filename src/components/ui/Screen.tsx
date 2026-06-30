import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ScreenProps {
  children: ReactNode;
  scroll?: boolean;
}

export function Screen({ children, scroll = true }: ScreenProps) {
  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      {scroll ? (
        <ScrollView className="flex-1 px-4" contentContainerClassName="pb-8">
          {children}
        </ScrollView>
      ) : (
        <View className="flex-1 px-4">{children}</View>
      )}
    </SafeAreaView>
  );
}
