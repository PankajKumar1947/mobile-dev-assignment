import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HabitProgressBar, MiniBarChart, MiniLineChart } from "../../components/charts";
import { Typography } from "../../components/typography";
import { useInsights, InsightsPeriod } from "../../hooks/query/use-insights";
import { Theme } from "../../theme/theme";

const PERIODS: InsightsPeriod[] = ["This Week", "Last Week", "This Month"];

function StatCard({ children }: { children: React.ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}

export default function InsightsScreen() {
  const [period, setPeriod] = useState<InsightsPeriod>("This Week");
  const [showPicker, setShowPicker] = useState(false);
  const { data, isLoading } = useInsights(period);

  const isPositiveDelta = data?.completionDelta.startsWith("+") ?? true;
  const deltaColor = isPositiveDelta ? Theme.colors.primary : "#DC2626";

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={Theme.colors.background} />

      <View style={styles.header}>
        <Typography variant="h1">Insights</Typography>
        <Pressable onPress={() => setShowPicker(true)} style={styles.periodBtn}>
          <Typography variant="captionBold" color={Theme.colors.textSecondary}>
            {period}
          </Typography>
          <Ionicons name="chevron-down" size={14} color={Theme.colors.textSecondary} />
        </Pressable>
      </View>

      {isLoading || !data ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={Theme.colors.primary} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <StatCard>
            <Typography variant="label" color={Theme.colors.textSecondary} style={styles.cardLabel}>
              Completion Rate
            </Typography>
            <View style={styles.statRow}>
              <View style={{ flex: 1 }}>
                <Typography variant="h1" style={styles.bigNumber}>
                  {data.completionRate}%
                </Typography>
                <View style={styles.deltaRow}>
                  <Ionicons
                    name={isPositiveDelta ? "trending-up" : "trending-down"}
                    size={13}
                    color={deltaColor}
                  />
                  <Typography variant="caption" style={{ color: deltaColor, marginLeft: 4 }}>
                    {data.completionDelta}
                  </Typography>
                </View>
              </View>
              <MiniLineChart data={data.completionTrend} width={110} height={56} color={Theme.colors.primary} />
            </View>
          </StatCard>

          <StatCard>
            <Typography variant="label" color={Theme.colors.textSecondary} style={styles.cardLabel}>
              Total Completions
            </Typography>
            <View style={styles.statRow}>
              <View style={{ flex: 1 }}>
                <Typography variant="h1" style={styles.bigNumber}>
                  {data.totalCompletions}
                </Typography>
                <View style={styles.deltaRow}>
                  <Ionicons name="trending-up" size={13} color={Theme.colors.primary} />
                  <Typography variant="caption" style={{ color: Theme.colors.primary, marginLeft: 4 }}>
                    {data.completionsDelta}
                  </Typography>
                </View>
              </View>
              <MiniBarChart data={data.completionsBars} width={110} height={56} color={Theme.colors.primary} />
            </View>
          </StatCard>

          <StatCard>
            <Typography variant="label" color={Theme.colors.textSecondary} style={styles.cardLabel}>
              Current Streak
            </Typography>
            <View style={styles.statRow}>
              <View style={{ flex: 1 }}>
                <Typography variant="h1" style={styles.bigNumber}>
                  {data.currentStreak} days
                </Typography>
                <Typography variant="caption" color={Theme.colors.textSecondary}>
                  Best: {data.bestStreak} days
                </Typography>
              </View>
              <Typography style={styles.fireEmoji}>🔥</Typography>
            </View>
          </StatCard>

          <StatCard>
            <Typography variant="bodyBold" style={styles.activityTitle}>
              Habit Activity
            </Typography>
            {data.habits.map((habit, idx) => {
              const cat = Theme.colors.categories[habit.category];
              return (
                <View key={idx} style={styles.habitRow}>
                  <View style={[styles.activityIcon, { backgroundColor: cat.bg }]}>
                    <Ionicons name={habit.icon as any} size={14} color={cat.accent} />
                  </View>
                  <Typography variant="body" style={styles.activityName}>
                    {habit.name}
                  </Typography>
                  <HabitProgressBar current={habit.current} target={habit.target} color={cat.accent} />
                  <Typography variant="captionBold" color={Theme.colors.textSecondary}>
                    {habit.current}/{habit.target}
                  </Typography>
                </View>
              );
            })}
          </StatCard>
        </ScrollView>
      )}

      <Modal
        visible={showPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPicker(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowPicker(false)}>
          <View style={styles.pickerSheet}>
            <Typography variant="bodyBold" style={styles.pickerTitle}>
              Select Period
            </Typography>
            {PERIODS.map((p) => (
              <Pressable
                key={p}
                style={[styles.pickerRow, p === period && styles.pickerRowActive]}
                onPress={() => { setPeriod(p); setShowPicker(false); }}
              >
                <Typography
                  variant="body"
                  style={p === period ? { color: Theme.colors.primary, fontWeight: "700" } : undefined}
                >
                  {p}
                </Typography>
                {p === period && <Ionicons name="checkmark" size={16} color={Theme.colors.primary} />}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Theme.colors.background },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Theme.spacing.lg,
    paddingTop: Theme.spacing.lg,
    marginBottom: Theme.spacing.lg,
  },
  periodBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.spacing.xs,
    backgroundColor: Theme.colors.card,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.xs + 2,
    borderRadius: Theme.radius.pill,
    ...Theme.shadows.soft,
  },
  scrollContent: {
    paddingHorizontal: Theme.spacing.lg,
    paddingBottom: 96,
  },
  card: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.md,
    ...Theme.shadows.soft,
  },
  cardLabel: { marginBottom: Theme.spacing.sm },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bigNumber: {
    fontSize: 36,
    lineHeight: 42,
    fontWeight: "700",
    color: Theme.colors.textPrimary,
    marginBottom: 4,
  },
  deltaRow: { flexDirection: "row", alignItems: "center" },
  fireEmoji: { fontSize: 44 },
  activityTitle: { marginBottom: Theme.spacing.md },
  habitRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Theme.spacing.sm,
  },
  activityIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Theme.spacing.sm,
  },
  activityName: { width: 92, fontSize: 13 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 96,
    paddingRight: Theme.spacing.lg,
  },
  pickerSheet: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.radius.lg,
    width: 200,
    overflow: "hidden",
    ...Theme.shadows.medium,
  },
  pickerTitle: {
    paddingHorizontal: Theme.spacing.lg,
    paddingTop: Theme.spacing.lg,
    paddingBottom: Theme.spacing.sm,
    color: Theme.colors.textSecondary,
    fontSize: 11,
  },
  pickerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
  },
  pickerRowActive: { backgroundColor: Theme.colors.primaryLight },
});
