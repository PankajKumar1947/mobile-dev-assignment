import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../theme';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'default';
}

export const Badge = ({ label, variant = 'default' }: BadgeProps) => {
  const { colors, borderRadius, typography } = useAppTheme();

  const getBgColor = () => {
    switch (variant) {
      case 'primary': return colors.primary;
      case 'secondary': return colors.secondary;
      case 'accent': return colors.accent;
      default: return colors.border;
    }
  };

  const getTextColor = () => {
    if (variant === 'default') return colors.text;
    return '#FFFFFF';
  };

  return (
    <View style={[styles.badge, { backgroundColor: getBgColor(), borderRadius: borderRadius.sm }]}>
      <Text style={[styles.text, { color: getTextColor(), fontSize: typography.fontSizes.xs }]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 4,
    marginBottom: 4,
  },
  text: {
    fontWeight: 'bold',
    textTransform: 'lowercase',
  },
});
