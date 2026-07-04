import React from "react";
import { Text as RNText, StyleSheet, TextProps } from "react-native";
import { Theme } from "../theme/theme";

export type TypographyVariant =
  | "h1"
  | "h2"
  | "body"
  | "bodyBold"
  | "caption"
  | "captionBold"
  | "label";

export interface TypographyProps extends TextProps {
  variant?: TypographyVariant;
  color?: string;
  align?: "auto" | "left" | "right" | "center" | "justify";
}

export const Typography: React.FC<TypographyProps> = ({
  children,
  variant = "body",
  color,
  align = "left",
  style,
  ...props
}) => {
  const textStyles = [
    styles[variant],
    { color: color || (variant.startsWith("caption") || variant === "label" ? Theme.colors.textSecondary : Theme.colors.textPrimary) },
    { textAlign: align },
    style,
  ];

  return (
    <RNText style={textStyles} {...props}>
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  h1: {
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 32,
  },
  h2: {
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 24,
  },
  body: {
    fontSize: 15,
    fontWeight: "400",
    lineHeight: 22,
  },
  bodyBold: {
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 22,
  },
  caption: {
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 16,
  },
  captionBold: {
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
  },
});
