import React from "react";
import { StyleSheet, Pressable, ViewStyle, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "../theme/theme";

export interface IconButtonProps {
  onPress: () => void;
  iconName: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
  backgroundColor?: string;
  style?: ViewStyle;
}

export const IconButton: React.FC<IconButtonProps> = ({
  onPress,
  iconName,
  size = 24,
  color = Theme.colors.textPrimary,
  backgroundColor = "transparent",
  style,
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor, borderRadius: (size * 1.8) / 2 },
        pressed && styles.pressed,
        style,
        Platform.OS === "web" && { cursor: "pointer" } as any,
      ]}
    >
      <Ionicons name={iconName} size={size} color={color} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: Theme.spacing.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
});
