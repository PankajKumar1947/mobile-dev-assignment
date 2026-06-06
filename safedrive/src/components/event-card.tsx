import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { AlertTriangle, Info, ShieldAlert } from "lucide-react-native";
import { DetectedEvent, EVENT_METADATA } from "../utils/event-detector";
import { ThemeType } from "../constants/theme";
import { useTheme } from "../context/theme-context";

interface EventCardProps {
  event: DetectedEvent;
}

export function EventCard({ event }: EventCardProps) {
  const { theme, isDark } = useTheme();
  const styles = getStyles(theme);
  const meta = EVENT_METADATA[event.type];
  const timeStr = new Date(event.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const getSeverityStyles = () => {
    switch (event.severity) {
      case "high":
        return {
          bg: isDark ? "#451A03" : "rgba(239, 68, 68, 0.1)",
          border: theme.colors.danger,
          text: isDark ? "#FDBA74" : "#B91C1C",
          icon: <ShieldAlert color={theme.colors.danger} size={20} />,
        };
      case "medium":
        return {
          bg: isDark ? "#422006" : "rgba(245, 158, 11, 0.1)",
          border: theme.colors.warning,
          text: isDark ? "#FCD34D" : "#B45309",
          icon: <AlertTriangle color={theme.colors.warning} size={20} />,
        };
      case "low":
      default:
        return {
          bg: theme.colors.card,
          border: theme.colors.border,
          text: theme.colors.textSecondary,
          icon: <Info color={theme.colors.textSecondary} size={20} />,
        };
    }
  };

  const stylesTheme = getSeverityStyles();

  return (
    <View style={[styles.container, { backgroundColor: stylesTheme.bg, borderColor: stylesTheme.border }]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          {stylesTheme.icon}
          <Text style={[styles.title, { color: stylesTheme.text }]}>{meta?.name || event.type}</Text>
        </View>
        <Text style={styles.deduction}>-{event.scoreDeduction} pts</Text>
      </View>
      <Text style={styles.desc}>{event.description}</Text>
      <View style={styles.footer}>
        <Text style={styles.time}>{timeStr}</Text>
        <Text style={styles.value}>Val: {event.value.toFixed(2)}</Text>
      </View>
    </View>
  );
}

const getStyles = (theme: ThemeType) => StyleSheet.create({
  container: {
    borderRadius: theme.roundness.md,
    borderWidth: 1,
    padding: 12,
    marginVertical: 6,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
  },
  deduction: {
    color: theme.colors.danger,
    fontSize: 14,
    fontWeight: "800",
  },
  desc: {
    color: theme.colors.textLight,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  time: {
    color: theme.colors.textMuted,
    fontSize: 11,
  },
  value: {
    color: theme.colors.textMuted,
    fontSize: 11,
  },
});
