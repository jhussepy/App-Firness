import '../global.css';

import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { LogBox, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ensureSeeded } from '@/data/seed/seed-loader';
import { fontAssets } from '@/theme/fonts';
import { useProfileStore } from '@/stores/profile.store';
import { useThemeStore } from '@/stores/theme.store';

SplashScreen.preventAutoHideAsync();

// react-native-gifted-charts sets RN Responder-system props on SVG elements,
// which react-native-web doesn't understand on the web target — cosmetic
// console noise only, native platforms are unaffected.
LogBox.ignoreLogs(['Unknown event handler property']);

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(fontAssets);
  const mode = useThemeStore((s) => s.mode);
  const router = useRouter();
  const segments = useSegments();
  const profile = useProfileStore((s) => s.profile);
  const isProfileLoaded = useProfileStore((s) => s.isLoaded);
  const loadProfile = useProfileStore((s) => s.load);

  useEffect(() => {
    ensureSeeded();
    loadProfile();
  }, [loadProfile]);

  const isReady = (fontsLoaded || !!fontError) && isProfileLoaded;

  useEffect(() => {
    if (!isReady) return;
    SplashScreen.hideAsync();

    const inOnboarding = segments[0] === 'onboarding';
    const isOnboarded = !!profile?.onboardingCompletedAt;
    if (!isOnboarded && !inOnboarding) {
      router.replace('/onboarding');
    } else if (isOnboarded && inOnboarding) {
      router.replace('/(tabs)');
    }
  }, [isReady, profile, segments, router]);

  if (!isReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <View className={`flex-1 bg-bg ${mode === 'dark' ? 'dark' : ''}`}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="onboarding/index" />
            <Stack.Screen name="(tabs)" />
          </Stack>
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
