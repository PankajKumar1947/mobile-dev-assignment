import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Shield } from "lucide-react-native";
import { Theme } from "../constants/theme";

interface AppLogoProps {
  size?: "sm" | "lg";
  direction?: "row" | "column";
}

export function AppLogo({ size = "sm", direction = "row" }: AppLogoProps) {
  const isLg = size === "lg";
  const isCol = direction === "column";

  return (
    <View style={[styles.container, isCol ? styles.column : styles.row]}>
      <View style={[styles.logoCircle, isLg ? styles.logoLg : styles.logoSm]}>
        <Shield color={Theme.colors.primary} size={isLg ? 40 : 22} />
      </View>
      <View style={isCol ? styles.textCenter : styles.textLeft}>
        <Text style={[styles.title, isLg ? styles.titleLg : styles.titleSm]}>Safe Drive</Text>
        {isLg && <Text style={styles.subtitle}>Smart Driving Assistant</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  row: {
    flexDirection: "row",
  },
  column: {
    flexDirection: "column",
  },
  logoCircle: {
    backgroundColor: Theme.colors.card,
    borderWidth: 1.5,
    borderColor: Theme.colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  logoSm: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  logoLg: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  textCenter: {
    alignItems: "center",
  },
  textLeft: {
    alignItems: "flex-start",
  },
  title: {
    color: Theme.colors.text,
    fontFamily: undefined,
  },
  titleSm: {
    fontSize: 18,
    fontWeight: "800",
  },
  titleLg: {
    fontSize: 26,
    fontWeight: "900",
  },
  subtitle: {
    color: Theme.colors.textSecondary,
    fontSize: 13,
    fontWeight: "500",
    marginTop: 2,
  },
});
