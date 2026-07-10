import { ActivityIndicator, Text, View } from 'react-native';

import { useThemeColors } from '@/theme/use-theme-colors';

// Data now lives in Supabase instead of on-device AsyncStorage, so
// `!isLoaded` briefly means "still fetching over the network" rather than
// "instant local read finished" — screens need to show this instead of
// letting their empty state ("Aún no tienes...") flash first and look like
// a real, permanent empty result.
export function LoadingState({ label = 'Cargando...' }: { label?: string }) {
  const colors = useThemeColors();
  return (
    <View className="items-center pt-16">
      <ActivityIndicator color={colors.primary} size="large" />
      <Text className="font-body text-muted text-sm mt-3">{label}</Text>
    </View>
  );
}
