import { useEffect } from 'react';
import { Text, View } from 'react-native';

import { Screen } from '@/components/ui/Screen';
import { useProfileStore } from '@/stores/profile.store';

export default function DashboardScreen() {
  const profile = useProfileStore((s) => s.profile);
  const load = useProfileStore((s) => s.load);

  useEffect(() => {
    load();
  }, [load]);

  const firstName = profile?.name?.split(' ')[0] ?? '';

  return (
    <Screen>
      <View className="pt-4 pb-6">
        <Text className="font-display-bold text-3xl text-fg">
          {firstName ? `Hola, ${firstName}` : 'Dashboard'}
        </Text>
        <Text className="font-body text-base text-muted mt-1">Este es tu resumen de hoy.</Text>
      </View>

      {profile?.dailyCalorieTarget ? (
        <View className="bg-muted/30 border border-border rounded-2xl p-5 mb-4">
          <Text className="font-body text-muted text-sm">Objetivo de calorías</Text>
          <Text className="font-display-bold text-fg mt-1" style={{ fontSize: 26 }}>
            {profile.dailyCalorieTarget.toLocaleString()} kcal
          </Text>
        </View>
      ) : null}

      <View className="bg-muted/30 border border-border rounded-2xl p-5">
        <Text className="font-body-semibold text-fg">Próximo entrenamiento</Text>
        <Text className="font-body text-muted text-sm mt-1">
          Aún no has programado ninguna rutina. Ve a la pestaña Plans para empezar.
        </Text>
      </View>
    </Screen>
  );
}
