import { useThemeStore } from '@/stores/theme.store';
import { colors } from './tokens';

// For native style props (e.g. Tabs screenOptions) that can't read the CSS
// variables Tailwind/NativeWind classNames use. Mirrors the same tokens.
export function useThemeColors() {
  const mode = useThemeStore((s) => s.mode);
  const scheme = mode === 'dark' ? colors.dark : colors.light;

  return {
    ...scheme,
    primary: colors.primary,
    secondary: colors.secondary,
    accent: colors.accent,
    destructive: colors.destructive,
    ring: colors.ring,
    macro: colors.macro,
  };
}
