import { DarkTheme, DefaultTheme, Theme } from '@react-navigation/native';
import { theme } from './colors';

export const AppLightTheme: Theme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: theme.light.primary,
    background: theme.light.background,
    card: theme.light.surface,
    text: theme.light.text,
    border: theme.light.border,
    notification: theme.light.accent,
  },
};

export const AppDarkTheme: Theme = {
  ...DarkTheme,
  dark: true,
  colors: {
    ...DarkTheme.colors,
    primary: theme.dark.primary,
    background: theme.dark.background,
    card: theme.dark.surface,
    text: theme.dark.text,
    border: theme.dark.border,
    notification: theme.dark.accent,
  },
};

export const typography = {
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
  },
  fontWeights: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  // We can add font families here once they are loaded
  fonts: {
    mono: 'monospace',
    sans: 'System',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
};

export const borderRadius = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};
