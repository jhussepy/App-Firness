import { create } from 'zustand';
import type { Session } from '@supabase/supabase-js';

import { supabase } from '@/lib/supabase';
import { useExerciseStore } from './exercise.store';
import { useNutritionStore } from './nutrition.store';
import { usePlanStore } from './plan.store';
import { useProfileStore } from './profile.store';
import { useProgressStore } from './progress.store';
import { useWorkoutStore } from './workout.store';

// Domain stores cache their AsyncStorage-era `isLoaded` flag in memory and
// only refetch `if (!isLoaded)` — harmless on a single account, but it would
// leak the previous account's data into the next login on the same device
// without a full app reload. Reset everyone on sign-out so every screen
// refetches fresh from the newly-authenticated user's cloud data.
function resetDomainStores() {
  useProfileStore.setState({ profile: null, isLoaded: false });
  useWorkoutStore.setState({ history: [], activeSession: null, isLoaded: false });
  useNutritionStore.setState({ foods: [], entries: [], isLoaded: false });
  useProgressStore.setState({ metrics: [], isLoaded: false });
  useExerciseStore.setState({ exercises: [], isLoaded: false });
  usePlanStore.setState({ routines: [], scheduledRoutines: [], isLoaded: false });
}

interface AuthState {
  session: Session | null;
  isLoaded: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

function mapAuthError(message: string): string {
  if (message.includes('Invalid login credentials')) return 'Correo o contraseña incorrectos.';
  if (message.includes('User already registered')) return 'Ya existe una cuenta con este correo.';
  if (message.includes('Password should be at least')) return 'La contraseña debe tener al menos 6 caracteres.';
  if (message.includes('Unable to validate email address')) return 'Ese correo no es válido.';
  if (message.includes('fetch')) return 'Sin conexión. Revisa tu internet e intenta de nuevo.';
  return 'Algo salió mal. Intenta de nuevo.';
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  isLoaded: false,
  error: null,
  async initialize() {
    const { data } = await supabase.auth.getSession();
    set({ session: data.session, isLoaded: true });
    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session });
    });
  },
  async signUp(email, password) {
    set({ error: null });
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      set({ error: mapAuthError(error.message) });
      throw error;
    }
  },
  async signIn(email, password) {
    set({ error: null });
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      set({ error: mapAuthError(error.message) });
      throw error;
    }
  },
  async signOut() {
    await supabase.auth.signOut();
    resetDomainStores();
  },
  clearError() {
    set({ error: null });
  },
}));
