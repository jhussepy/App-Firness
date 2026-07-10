import '../global.css';

import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { LogBox, Platform, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { fontAssets } from '@/theme/fonts';
import { useAuthStore } from '@/stores/auth.store';
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
  const session = useAuthStore((s) => s.session);
  const isAuthLoaded = useAuthStore((s) => s.isLoaded);
  const initializeAuth = useAuthStore((s) => s.initialize);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (session) loadProfile();
  }, [session, loadProfile]);

  // react-native-web's <Modal> portals its content to document.body, outside
  // the root <View>'s `dark` class — mirroring the class onto <html> keeps
  // portaled content (any Modal, present or future) in the same dark/light
  // CSS-variable scope as the rest of the app instead of silently falling
  // back to the light-mode `:root` values.
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;
    document.documentElement.classList.toggle('dark', mode === 'dark');
  }, [mode]);

  const isReady = (fontsLoaded || !!fontError) && isAuthLoaded && (!session || isProfileLoaded);

  useEffect(() => {
    if (!isReady) return;
    SplashScreen.hideAsync();

    const inAuth = segments[0] === 'auth';
    const inOnboarding = segments[0] === 'onboarding';
    const isOnboarded = !!profile?.onboardingCompletedAt;

    if (!session && !inAuth) {
      router.replace('/auth');
    } else if (session && inAuth) {
      router.replace(isOnboarded ? '/(tabs)' : '/onboarding');
    } else if (session && !isOnboarded && !inOnboarding) {
      router.replace('/onboarding');
    } else if (session && isOnboarded && inOnboarding) {
      router.replace('/(tabs)');
    }
  }, [isReady, session, profile, segments, router]);

  if (!isReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <View className={`flex-1 bg-bg ${mode === 'dark' ? 'dark' : ''}`}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="auth/index" />
            <Stack.Screen name="onboarding/index" />
            <Stack.Screen name="(tabs)" />
          </Stack>
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
