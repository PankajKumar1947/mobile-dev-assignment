import React from 'react';
import { TouchableOpacity, StyleSheet, TouchableOpacityProps } from 'react-native';
import { useAppTheme } from '../theme';
import { Ionicons } from '@expo/vector-icons';

interface IconButtonProps extends TouchableOpacityProps {
  icon: keyof typeof Ionicons.glyphMap;
  size?: number;
  variant?: 'primary' | 'secondary' | 'surface';
}

export const IconButton = ({ icon, size = 24, variant = 'primary', style, ...props }: IconButtonProps) => {
  const { colors } = useAppTheme();

  const getBgColor = () => {
    switch (variant) {
      case 'primary': return colors.primary;
      case 'secondary': return colors.secondary;
      case 'surface': return colors.surface;
      default: return colors.primary;
    }
  };

  const getIconColor = () => {
    if (variant === 'surface') return colors.text;
    return '#FFFFFF';
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: getBgColor(),
          width: size * 1.8,
          height: size * 1.8,
          borderRadius: size,
        },
        style,
      ]}
      activeOpacity={0.7}
      {...props}
    >
      <Ionicons name={icon} size={size} color={getIconColor()} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});
