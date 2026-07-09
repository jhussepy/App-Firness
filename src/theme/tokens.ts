import rawColors from './colors.json';

interface ModeColors {
  background: string;
  foreground: string;
  muted: string;
  border: string;
}

// Brand colors are mode-independent; background/foreground/muted/border
// have separate light/dark values (see global.css for the CSS-variable
// versions used by Tailwind/NativeWind className styling). Components that
// need raw hex values for native style props (not classNames) should use
// useThemeColors() instead of reading `dark`/`light` directly.
export const colors = rawColors as {
  primary: string;
  secondary: string;
  accent: string;
  destructive: string;
  ring: string;
  macro: { protein: string; carb: string; fat: string };
  dark: ModeColors;
  light: ModeColors;
};

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
} as const;
