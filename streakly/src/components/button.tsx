import React from "react";
import {
  StyleSheet,
  Pressable,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  Platform,
} from "react-native";
import { Theme } from "../theme/theme";
import { Typography } from "./typography";

export type ButtonVariant = "primary" | "secondary" | "outline" | "text";

export interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  onPress,
  title,
  variant = "primary",
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
}) => {
  const getButtonStyles = (): ViewStyle[] => {
    const base: ViewStyle[] = [styles.button];

    switch (variant) {
      case "primary":
        base.push({
          backgroundColor: Theme.colors.primary,
        });
        break;
      case "secondary":
        base.push({
          backgroundColor: Theme.colors.primaryLight,
        });
        break;
      case "outline":
        base.push({
          backgroundColor: "transparent",
          borderWidth: 1.5,
          borderColor: Theme.colors.primary,
        });
        break;
      case "text":
        base.push({
          backgroundColor: "transparent",
          paddingVertical: Theme.spacing.xs,
          paddingHorizontal: Theme.spacing.sm,
        });
        break;
    }

    if (disabled) {
      base.push(styles.disabled);
    }

    return base;
  };

  const getTextStyle = (): TextStyle => {
    switch (variant) {
      case "primary":
        return { color: Theme.colors.card };
      case "secondary":
      case "outline":
      case "text":
        return { color: Theme.colors.primary };
    }
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        ...getButtonStyles(),
        pressed && !disabled && !loading && styles.pressed,
        style,
        Platform.OS === "web" && { cursor: disabled ? "not-allowed" : "pointer" } as any,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "primary" ? Theme.colors.card : Theme.colors.primary}
          size="small"
        />
      ) : (
        <>
          {icon && <React.Fragment>{icon}</React.Fragment>}
          <Typography
            variant="bodyBold"
            style={[getTextStyle(), icon ? { marginLeft: Theme.spacing.sm } : {}, textStyle]}
          >
            {title}
          </Typography>
        </>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: Theme.radius.pill,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Theme.spacing.xl,
    marginVertical: Theme.spacing.xs,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.5,
  },
});
