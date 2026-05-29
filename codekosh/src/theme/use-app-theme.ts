import { useColorScheme } from 'react-native';
import { theme } from './colors';
import { AppDarkTheme, AppLightTheme, typography, spacing, borderRadius } from './base';

export const useAppTheme = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const activeTheme = isDark ? AppDarkTheme : AppLightTheme;
  const colors = isDark ? theme.dark : theme.light;

  return {
    isDark,
    theme: activeTheme,
    colors,
    typography,
    spacing,
    borderRadius,
  };
};
