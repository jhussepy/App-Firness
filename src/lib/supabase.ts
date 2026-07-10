import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

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
// crashes the export. `Platform.OS` is statically 'web' during that SSR
// pass too (it's not runtime feature detection), so the only reliable check
// for "this is a real browser tab" is the presence of `window` itself.
const isRealBrowser = Platform.OS === 'web' && typeof window !== 'undefined';

const noopStorage = {
  getItem: async () => null,
  setItem: async () => {},
  removeItem: async () => {},
};
const authStorage = isRealBrowser ? AsyncStorage : Platform.OS === 'web' ? noopStorage : AsyncStorage;

export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder', {
  auth: {
    storage: authStorage,
    autoRefreshToken: true,
    persistSession: true,
    // Web: pick up the ?code=/#access_token= Google adds after redirecting
    // back from its consent screen. Native has no address bar to detect a
    // session from — that flow is handled explicitly in auth.store.ts via
    // expo-web-browser instead.
    detectSessionInUrl: isRealBrowser,
  },
});
