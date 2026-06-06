import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { AlertTriangle, Info, ShieldAlert } from "lucide-react-native";
import { DetectedEvent, EVENT_METADATA } from "../utils/event-detector";
import { Theme } from "../constants/theme";

interface EventCardProps {
  event: DetectedEvent;
}

export function EventCard({ event }: EventCardProps) {
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
          bg: "#451A03",
          border: Theme.colors.danger,
          text: "#FDBA74",
          icon: <ShieldAlert color={Theme.colors.danger} size={20} />,
        };
      case "medium":
        return {
          bg: "#422006",
          border: Theme.colors.warning,
          text: "#FCD34D",
          icon: <AlertTriangle color={Theme.colors.warning} size={20} />,
        };
      case "low":
      default:
        return {
          bg: Theme.colors.card,
          border: Theme.colors.border,
          text: Theme.colors.textSecondary,
          icon: <Info color={Theme.colors.textSecondary} size={20} />,
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

const styles = StyleSheet.create({
  container: {
    borderRadius: Theme.roundness.md,
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
    color: Theme.colors.danger,
    fontSize: 14,
    fontWeight: "800",
  },
  desc: {
    color: Theme.colors.textLight,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  time: {
    color: Theme.colors.textMuted,
    fontSize: 11,
  },
  value: {
    color: Theme.colors.textMuted,
    fontSize: 11,
  },
});
