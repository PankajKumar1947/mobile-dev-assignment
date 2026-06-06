import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Calendar, Clock, Navigation, AlertTriangle, ChevronRight } from "lucide-react-native";
import { DriveSession } from "../services/storage";
import { ThemeType, getScoreColor } from "../constants/theme";
import { useTheme } from "../context/theme-context";
import { formatDuration } from "../utils/driving-helpers";

interface HistoryCardProps {
  session: DriveSession;
  onPress: () => void;
}

export function HistoryCard({ session, onPress }: HistoryCardProps) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const dateStr = new Date(session.startTime).toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timeStr = new Date(session.startTime).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const scoreColor = getScoreColor(session.score, theme.colors);
  const timeDisplay = formatDuration(session.duration);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.leftBorder} />
      <View style={styles.body}>
        <View style={styles.topRow}>
          <View style={styles.dateTime}>
            <Calendar color={theme.colors.textMuted} size={14} />
            <Text style={styles.dateText}>{dateStr} • {timeStr}</Text>
          </View>
          <View style={[styles.scoreContainer, { backgroundColor: scoreColor + "20" }]}>
            <Text style={[styles.scoreText, { color: scoreColor }]}>{session.score}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Clock color={theme.colors.textSecondary} size={13} />
            <Text style={styles.statText}>{timeDisplay}</Text>
          </View>
          <View style={styles.stat}>
            <Navigation color={theme.colors.textSecondary} size={13} />
            <Text style={styles.statText}>{session.distance?.toFixed(2)} km</Text>
          </View>
          <View style={styles.stat}>
            <AlertTriangle color={theme.colors.danger} size={13} />
            <Text style={styles.statText}>{session.events.length} events</Text>
          </View>
        </View>
      </View>
      <ChevronRight color="#475569" size={20} style={styles.chevron} />
    </TouchableOpacity>
  );
}

const getStyles = (theme: ThemeType) => StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: theme.colors.card,
    borderRadius: theme.roundness.lg,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: "hidden",
    alignItems: "center",
  },
  leftBorder: {
    width: 4,
    height: "100%",
    backgroundColor: theme.colors.border,
  },
  body: {
    flex: 1,
    padding: 16,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  dateTime: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dateText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: "500",
  },
  scoreContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.roundness.sm,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: "800",
  },
  statsRow: {
    flexDirection: "row",
    gap: 16,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    color: theme.colors.textLight,
    fontSize: 12,
    fontWeight: "500",
  },
  chevron: {
    marginRight: 12,
  },
});
