const colors = require('./src/theme/colors.json');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: colors.primary,
        secondary: colors.secondary,
        accent: colors.accent,
        destructive: colors.destructive,
        ring: colors.ring,
        macro: colors.macro,
        // Mode-aware tokens: literal values come from the CSS variables in
        // global.css (:root = light, .dark = dark), so plain `bg-bg`/`text-fg`
        // classes automatically switch when the `dark` class toggles.
        bg: 'rgb(var(--color-bg) / <alpha-value>)',
        fg: 'rgb(var(--color-fg) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
      },
      fontFamily: {
        display: ['BarlowCondensed_600SemiBold'],
        'display-bold': ['BarlowCondensed_700Bold'],
        body: ['Barlow_400Regular'],
        'body-medium': ['Barlow_500Medium'],
        'body-semibold': ['Barlow_600SemiBold'],
      },
    },
  },
  plugins: [],
};
