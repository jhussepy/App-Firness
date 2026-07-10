import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// EXPO_PUBLIC_* vars are inlined into the client bundle at build time —
// that's fine here, the anon key is meant to be public. Real access control
// happens server-side via Postgres Row Level Security policies.
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Expo Router's static web export prerenders every route in a Node SSR pass
// (no `window`), but this module is evaluated eagerly at import time and
// supabase-js reads session storage synchronously during client
// construction — AsyncStorage's web implementation touches `window` and
// crashes the export. `window` is defined in both real browsers and React
// Native's native runtime, so its absence reliably means "Node SSR pass".
const noopStorage = {
  getItem: async () => null,
  setItem: async () => {},
  removeItem: async () => {},
};
const authStorage = typeof window === 'undefined' ? noopStorage : AsyncStorage;

export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder', {
  auth: {
    storage: authStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
