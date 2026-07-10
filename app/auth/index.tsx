import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { Mail } from 'lucide-react-native';

import { GoogleIcon } from '@/components/ui/GoogleIcon';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Screen } from '@/components/ui/Screen';
import { TextField } from '@/components/ui/TextField';
import { useThemeColors } from '@/theme/use-theme-colors';
import { useAuthStore } from '@/stores/auth.store';
import { isSupabaseConfigured } from '@/lib/supabase';

type Mode = 'signIn' | 'signUp';

export default function AuthScreen() {
  const colors = useThemeColors();
  const signIn = useAuthStore((s) => s.signIn);
  const signUp = useAuthStore((s) => s.signUp);
  const signInWithGoogle = useAuthStore((s) => s.signInWithGoogle);
  const error = useAuthStore((s) => s.error);
  const clearError = useAuthStore((s) => s.clearError);

  const [mode, setMode] = useState<Mode>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  const canSubmit = email.trim().length > 3 && password.length >= 6 && !submitting;

  async function handleSubmit() {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      if (mode === 'signIn') {
        await signIn(email.trim(), password);
      } else {
        await signUp(email.trim(), password);
        setSignUpSuccess(true);
      }
    } catch {
      // error is already set on the store; nothing else to do here.
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogle() {
    setGoogleSubmitting(true);
    try {
      await signInWithGoogle();
    } catch {
      // error is already set on the store; nothing else to do here.
    } finally {
      setGoogleSubmitting(false);
    }
  }

  function switchMode(next: Mode) {
    setMode(next);
    setSignUpSuccess(false);
    clearError();
  }

  return (
    <Screen>
      <View className="items-center pt-12 pb-8">
        <View className="w-16 h-16 rounded-full bg-primary/15 items-center justify-center mb-4">
          <Mail color={colors.primary} size={28} />
        </View>
        <Text className="font-display-bold text-3xl text-fg text-center">
          {mode === 'signIn' ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}
        </Text>
        <Text className="font-body text-muted text-sm text-center mt-2 px-4">
          {mode === 'signIn'
            ? 'Inicia sesión para acceder a tus datos en cualquier dispositivo.'
            : 'Tus entrenamientos, nutrición y progreso se guardan y se sincronizan automáticamente.'}
        </Text>
      </View>

      {!isSupabaseConfigured ? (
        <View className="bg-destructive/10 border border-destructive/40 rounded-2xl px-4 py-3 mb-4">
          <Text className="font-body text-destructive text-sm">
            La sincronización en la nube aún no está configurada en este servidor.
          </Text>
        </View>
      ) : null}

      {!signUpSuccess ? (
        <>
          <Pressable
            onPress={handleGoogle}
            disabled={googleSubmitting || !isSupabaseConfigured}
            className={`flex-row items-center justify-center gap-3 rounded-2xl py-4 px-6 border border-border bg-muted/30 mb-5 ${
              googleSubmitting || !isSupabaseConfigured ? 'opacity-50' : 'active:opacity-80'
            }`}
          >
            {googleSubmitting ? <ActivityIndicator color={colors.foreground} size="small" /> : <GoogleIcon size={18} />}
            <Text className="font-body-semibold text-base text-fg">Continuar con Google</Text>
          </Pressable>

          <View className="flex-row items-center gap-3 mb-5">
            <View className="flex-1 h-px bg-border" />
            <Text className="font-body text-muted text-xs">o con tu correo</Text>
            <View className="flex-1 h-px bg-border" />
          </View>
        </>
      ) : null}

      {signUpSuccess ? (
        <View className="bg-accent/10 border border-accent/40 rounded-2xl px-4 py-4 mb-4">
          <Text className="font-body-semibold text-accent text-sm mb-1">Revisa tu correo</Text>
          <Text className="font-body text-fg text-sm leading-5">
            Te enviamos un enlace de confirmación a {email.trim()}. Confírmalo y luego inicia sesión.
          </Text>
        </View>
      ) : (
        <>
          <TextField
            label="Correo electrónico"
            value={email}
            onChangeText={setEmail}
            placeholder="tu@correo.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextField
            label="Contraseña"
            value={password}
            onChangeText={setPassword}
            placeholder="Mínimo 6 caracteres"
            secureTextEntry
            autoCapitalize="none"
          />

          {error ? (
            <Text className="font-body text-destructive text-sm mb-4 text-center">{error}</Text>
          ) : null}

          <PrimaryButton
            label={submitting ? 'Un momento...' : mode === 'signIn' ? 'Iniciar sesión' : 'Crear cuenta'}
            onPress={handleSubmit}
            disabled={!canSubmit || !isSupabaseConfigured}
          />
        </>
      )}

      <Pressable
        onPress={() => switchMode(mode === 'signIn' ? 'signUp' : 'signIn')}
        className="items-center mt-5 active:opacity-70"
      >
        <Text className="font-body text-muted text-sm">
          {mode === 'signIn' ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
          <Text className="font-body-semibold text-primary">
            {mode === 'signIn' ? 'Regístrate' : 'Inicia sesión'}
          </Text>
        </Text>
      </Pressable>
    </Screen>
  );
}
