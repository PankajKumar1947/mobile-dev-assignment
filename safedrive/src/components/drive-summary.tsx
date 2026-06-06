import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from "react-native";
import { Award, Flame, Navigation, Clock, Activity, Brain } from "lucide-react-native";
import { DriveSession } from "../services/storage";
import { EVENT_METADATA } from "../utils/event-detector";
import { ThemeType, getScoreColor } from "../constants/theme";
import { useTheme } from "../context/theme-context";
import { getAiFeedback, formatDuration } from "../utils/driving-helpers";

interface DriveSummaryProps {
  session: DriveSession | null;
  visible: boolean;
  onClose: () => void;
}

export function DriveSummary({ session, visible, onClose }: DriveSummaryProps) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  if (!session) return null;

  const scoreColor = getScoreColor(session.score, theme.colors);

  const eventCounts: Record<string, number> = {};
  session.events.forEach((e) => {
    eventCounts[e.type] = (eventCounts[e.type] || 0) + 1;
  });

  const timeDisplay = formatDuration(session.duration);
  const aiFeedbackText = getAiFeedback(session.score, session.events);

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            
            <View style={styles.headerArea}>
              <Text style={styles.title}>Drive Summary</Text>
              <View style={[styles.scoreBadge, { borderColor: scoreColor }]}>
                <Text style={[styles.scoreValue, { color: scoreColor }]}>{session.score}</Text>
                <Text style={styles.scoreMax}>/100</Text>
              </View>
              <Text style={[styles.ratingLabel, { color: scoreColor }]}>{session.rating} drive</Text>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <Clock color={theme.colors.primary} size={20} />
                <Text style={styles.statValue}>{timeDisplay}</Text>
                <Text style={styles.statLabel}>Duration</Text>
              </View>

              <View style={styles.statBox}>
                <Navigation color={theme.colors.success} size={20} />
                <Text style={styles.statValue}>{session.distance?.toFixed(2)} km</Text>
                <Text style={styles.statLabel}>Est. Distance</Text>
              </View>

              <View style={styles.statBox}>
                <Activity color={theme.colors.warning} size={20} />
                <Text style={styles.statValue}>{session.events.length}</Text>
                <Text style={styles.statLabel}>Total Events</Text>
              </View>
            </View>

            <View style={styles.feedbackContainer}>
              <View style={styles.feedbackHeader}>
                <Brain color={theme.colors.accent} size={18} />
                <Text style={styles.feedbackTitle}>AI Driving Insights</Text>
              </View>
              <Text style={styles.feedbackText}>{aiFeedbackText}</Text>
            </View>

            <View style={styles.breakdownContainer}>
              <Text style={styles.sectionTitle}>Event Breakdown</Text>
              {session.events.length === 0 ? (
                <View style={styles.emptyEvents}>
                  <Award color={theme.colors.success} size={36} />
                  <Text style={styles.emptyText}>Excellent drive! No unsafe events detected.</Text>
                </View>
              ) : (
                Object.entries(eventCounts).map(([type, count]) => {
                  const meta = EVENT_METADATA[type as keyof typeof EVENT_METADATA];
                  return (
                    <View key={type} style={styles.breakdownRow}>
                      <View style={styles.breakdownNameCol}>
                        <Flame color={theme.colors.danger} size={16} />
                        <Text style={styles.breakdownName}>{meta?.name || type}</Text>
                      </View>
                      <Text style={styles.breakdownCount}>{count}x</Text>
                      <Text style={styles.breakdownDeduct}>-{(meta?.deduction || 0) * count} pts</Text>
                    </View>
                  );
                })
              )}
            </View>

          </ScrollView>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const getStyles = (theme: ThemeType) => StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.9)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.roundness.xl,
    borderTopRightRadius: theme.roundness.xl,
    height: "90%",
    paddingBottom: 24,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  scrollContent: {
    padding: 24,
  },
  headerArea: {
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 16,
  },
  scoreBadge: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    justifyContent: "center",
    backgroundColor: theme.colors.card,
    alignItems: "center",
    marginBottom: 12,
  },
  scoreValue: {
    fontSize: 38,
    fontWeight: "900",
  },
  scoreMax: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    fontWeight: "600",
    marginTop: -2,
  },
  ratingLabel: {
    fontSize: 14,
    fontWeight: "800",
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  statBox: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: theme.roundness.lg,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  statValue: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "700",
    marginTop: 6,
    marginBottom: 2,
  },
  statLabel: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    fontWeight: "500",
  },
  feedbackContainer: {
    backgroundColor: theme.colors.accentBg,
    borderWidth: 1,
    borderColor: theme.colors.accentBorder,
    borderRadius: theme.roundness.lg,
    padding: 16,
    marginBottom: 24,
  },
  feedbackHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  feedbackTitle: {
    color: "#C084FC",
    fontSize: 14,
    fontWeight: "700",
  },
  feedbackText: {
    color: theme.colors.textLight,
    fontSize: 13,
    lineHeight: 20,
  },
  breakdownContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: 12,
  },
  emptyEvents: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.roundness.lg,
    padding: 24,
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  emptyText: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    textAlign: "center",
  },
  breakdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: theme.roundness.md,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  breakdownNameCol: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 2,
  },
  breakdownName: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: "600",
  },
  breakdownCount: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    flex: 0.5,
    textAlign: "right",
  },
  breakdownDeduct: {
    color: theme.colors.danger,
    fontSize: 13,
    fontWeight: "700",
    flex: 1,
    textAlign: "right",
  },
  closeButton: {
    backgroundColor: theme.colors.primary,
    marginHorizontal: 24,
    height: 52,
    borderRadius: theme.roundness.lg,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  closeButtonText: {
    color: theme.colors.background,
    fontSize: 16,
    fontWeight: "700",
  },
});
