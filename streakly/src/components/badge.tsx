import React from "react";
import { StyleSheet, View, ViewStyle, TextStyle } from "react-native";
import { Theme } from "../theme/theme";
import { Typography } from "./typography";

export type BadgeCategory = keyof typeof Theme.colors.categories;

export interface BadgeProps {
  label: string;
  category?: BadgeCategory;
  variant?: "solid" | "pastel";
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  category,
  variant = "pastel",
  style,
  textStyle,
}) => {
  const getBadgeStyles = (): ViewStyle => {
    if (!category) {
      return {
        backgroundColor: Theme.colors.primaryLight,
      };
    }

    const catTheme = Theme.colors.categories[category];
    if (variant === "solid") {
      return {
        backgroundColor: catTheme.accent,
      };
    }

    return {
      backgroundColor: catTheme.bg,
    };
  };

  const getTextStyle = (): TextStyle => {
    if (!category) {
      return {
        color: Theme.colors.primary,
      };
    }

    const catTheme = Theme.colors.categories[category];
    if (variant === "solid") {
      return {
        color: Theme.colors.card,
      };
    }

    return {
      color: catTheme.accent,
    };
  };

  return (
    <View style={[styles.badge, getBadgeStyles(), style]}>
      <Typography variant="captionBold" style={[getTextStyle(), textStyle]}>
        {label}
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.radius.pill,
    justifyContent: "center",
    alignItems: "center",
  },
});
