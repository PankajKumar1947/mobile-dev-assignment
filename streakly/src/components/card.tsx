import React from "react";
import {
  StyleSheet,
  View,
  Pressable,
  ViewStyle,
  Platform,
} from "react-native";
import { Theme } from "../theme/theme";

export interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  variant?: "soft" | "medium" | "glass";
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  variant = "soft",
}) => {
  const cardStyle = [
    styles.card,
    variant === "glass" ? styles.glass : Theme.shadows[variant],
    style,
  ];

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          cardStyle,
          pressed && styles.pressed,
          Platform.OS === "web" && { cursor: "pointer" } as any,
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.radius.md,
    padding: Theme.spacing.lg,
    marginVertical: Theme.spacing.xs,
  },
  glass: {
    backgroundColor: Theme.colors.glass,
    borderColor: Theme.colors.glassBorder,
    borderWidth: 1.5,
    ...Platform.select({
      web: {
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      } as any,
    }),
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});
