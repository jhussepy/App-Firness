import { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LogOut } from 'lucide-react-native';

import { LoadingState } from '@/components/ui/LoadingState';
import { Screen } from '@/components/ui/Screen';
import { useAuthStore } from '@/stores/auth.store';
import { useProfileStore } from '@/stores/profile.store';
import { useThemeColors } from '@/theme/use-theme-colors';
import { useThemeStore } from '@/stores/theme.store';

const GOAL_LABEL: Record<string, string> = {
  lose_fat: 'Perder Grasa',
  gain_muscle: 'Ganancia Muscular',
  maintain: 'Mantener Peso',
};

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between py-3 border-b border-border">
      <Text className="font-body text-muted">{label}</Text>
      <Text className="font-body-semibold text-fg">{value}</Text>
    </View>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const profile = useProfileStore((s) => s.profile);
  const isLoaded = useProfileStore((s) => s.isLoaded);
  const load = useProfileStore((s) => s.load);
  const mode = useThemeStore((s) => s.mode);
  const toggle = useThemeStore((s) => s.toggle);
  const session = useAuthStore((s) => s.session);
  const signOut = useAuthStore((s) => s.signOut);

  useEffect(() => {
    load();
  }, [load]);

  if (!isLoaded) {
    return (
      <Screen>
        <LoadingState />
      </Screen>
    );
  }

  return (
    <Screen>
      <View className="pt-4 pb-6">
        <Text className="font-display-bold text-3xl text-fg">{profile?.name ?? 'Perfil'}</Text>
        <Text className="font-body text-base text-muted mt-1">
          {profile?.goal ? GOAL_LABEL[profile.goal] : 'Configura tu perfil'}
        </Text>
        {session?.user.email ? (
          <Text className="font-body text-muted text-xs mt-1">{session.user.email}</Text>
        ) : null}
      </View>

      {profile?.dailyCalorieTarget ? (
        <View className="bg-muted/30 border border-border rounded-2xl p-5 mb-6 items-center">
          <Text className="font-body text-muted text-sm">Objetivo diario</Text>
          <Text className="font-display-bold text-fg mt-1" style={{ fontSize: 28 }}>
            {profile.dailyCalorieTarget.toLocaleString()} kcal
          </Text>
          {profile.dailyMacroTargets ? (
            <View className="flex-row w-full justify-between mt-4">
              <View className="items-center flex-1">
                <Text className="font-body text-muted text-xs">Proteínas</Text>
                <Text className="font-body-semibold text-fg mt-0.5">{profile.dailyMacroTargets.proteinG} g</Text>
              </View>
              <View className="items-center flex-1">
                <Text className="font-body text-muted text-xs">Carbos</Text>
                <Text className="font-body-semibold text-fg mt-0.5">{profile.dailyMacroTargets.carbG} g</Text>
              </View>
              <View className="items-center flex-1">
                <Text className="font-body text-muted text-xs">Grasas</Text>
                <Text className="font-body-semibold text-fg mt-0.5">{profile.dailyMacroTargets.fatG} g</Text>
              </View>
            </View>
          ) : null}
        </View>
      ) : null}

      <View className="bg-muted/30 border border-border rounded-2xl px-4 mb-6">
        <StatRow label="Peso actual" value={profile?.weightKg ? `${profile.weightKg} kg` : '—'} />
        <StatRow label="Peso objetivo" value={profile?.targetWeightKg ? `${profile.targetWeightKg} kg` : '—'} />
        <StatRow label="Altura" value={profile?.heightCm ? `${profile.heightCm} cm` : '—'} />
        <StatRow label="Edad" value={profile?.age ? `${profile.age} años` : '—'} />
      </View>

      <Pressable
        onPress={toggle}
        className="bg-muted/30 border border-border rounded-2xl px-4 py-4 active:opacity-70 mb-3"
      >
        <Text className="font-body-medium text-fg">
          Tema: {mode === 'dark' ? 'Oscuro' : 'Claro'} (toca para cambiar)
        </Text>
      </Pressable>

      <Pressable
        onPress={() => router.push('/profile/edit')}
        className="bg-muted/30 border border-border rounded-2xl px-4 py-4 active:opacity-70 mb-3"
      >
        <Text className="font-body-medium text-fg">Editar perfil</Text>
      </Pressable>

      <Pressable
        onPress={signOut}
        className="flex-row items-center justify-center gap-2 border border-destructive/40 rounded-2xl px-4 py-4 active:opacity-70"
      >
        <LogOut color={colors.destructive} size={18} />
        <Text className="font-body-medium text-destructive">Cerrar sesión</Text>
      </Pressable>
    </Screen>
  );
}
