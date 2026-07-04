import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Typography } from "../../components/typography";
import { useHabits } from "../../hooks/query/use-habits";
import { Theme } from "../../theme/theme";
import { Habit, HabitStatus } from "../../types";

// ─── Filter Config ─────────────────────────────────────────────────────────────
type FilterTab = "all" | HabitStatus;

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "completed", label: "Completed" },
  { key: "archived", label: "Archived" },
];

// ─── Habit Row ─────────────────────────────────────────────────────────────────
function HabitRow({ habit }: { habit: Habit }) {
  const cat = Theme.colors.categories[habit.category] ?? {
    bg: Theme.colors.primaryLight,
    accent: Theme.colors.primary,
  };
  const isDone = habit.current >= habit.target;

  return (
    <Pressable
      onPress={() => router.push(`/habit/${habit.id}` as any)}
      style={({ pressed }) => [
        styles.habitRow,
        pressed && { backgroundColor: Theme.colors.background },
      ]}
    >
      <View style={[styles.habitIcon, { backgroundColor: cat.bg }]}>
        <Ionicons name={habit.icon as any} size={20} color={cat.accent} />
      </View>
      <View style={styles.habitInfo}>
        <Typography variant="bodyBold">{habit.name}</Typography>
        <Typography variant="caption" color={Theme.colors.textSecondary}>
          {habit.frequency}
        </Typography>
      </View>
      <View style={styles.habitRight}>
        {isDone ? (
          <Ionicons name="checkmark-circle" size={24} color={Theme.colors.primary} />
        ) : (
          <>
            <Typography variant="bodyBold">
              {habit.current}/{habit.target}
            </Typography>
            <Typography variant="caption" color={Theme.colors.textSecondary}>
              {habit.unit}
            </Typography>
          </>
        )}
      </View>
    </Pressable>
  );
}

// ─── Habits Screen ─────────────────────────────────────────────────────────────
export default function HabitsScreen() {
  const { data: habits, isLoading } = useHabits();
  const [filter, setFilter] = useState<FilterTab>("active");

  const filteredHabits = useMemo<Habit[]>(() => {
    if (!habits) return [];
    if (filter === "all") return habits;
    return habits.filter((h) => h.status === filter);
  }, [habits, filter]);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={Theme.colors.background} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <Typography variant="h1">Habits</Typography>
        <Pressable style={styles.searchBtn}>
          <Ionicons name="search" size={20} color={Theme.colors.textPrimary} />
        </Pressable>
      </View>

      {/* ── Filter Tabs ── */}
      <View style={styles.filterRow}>
        {FILTER_TABS.map((tab) => {
          const isActive = filter === tab.key;
          return (
            <Pressable
              key={tab.key}
              onPress={() => setFilter(tab.key)}
              style={[styles.filterTab, isActive && styles.filterTabActive]}
            >
              <Typography
                variant="captionBold"
                style={[styles.filterLabel, isActive && styles.filterLabelActive]}
              >
                {tab.label}
              </Typography>
            </Pressable>
          );
        })}
      </View>

      {/* ── Content ── */}
      {isLoading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={Theme.colors.primary} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.listCard}>
            {filteredHabits.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons
                  name="checkmark-done-circle-outline"
                  size={48}
                  color={Theme.colors.border}
                />
                <Typography
                  variant="body"
                  color={Theme.colors.textSecondary}
                  style={{ marginTop: Theme.spacing.md }}
                >
                  No habits here yet.
                </Typography>
              </View>
            ) : (
              filteredHabits.map((habit, idx) => (
                <View key={habit.id}>
                  <HabitRow habit={habit} />
                  {idx < filteredHabits.length - 1 && <View style={styles.separator} />}
                </View>
              ))
            )}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Theme.colors.background },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Theme.spacing.lg,
    paddingTop: Theme.spacing.lg,
    marginBottom: Theme.spacing.lg,
  },
  searchBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.colors.card,
    justifyContent: "center",
    alignItems: "center",
    ...Theme.shadows.soft,
  },

  filterRow: {
    flexDirection: "row",
    paddingHorizontal: Theme.spacing.lg,
    marginBottom: Theme.spacing.lg,
    gap: Theme.spacing.sm,
  },
  filterTab: {
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.xs + 2,
    borderRadius: Theme.radius.pill,
  },
  filterTabActive: { backgroundColor: Theme.colors.primary },
  filterLabel: { color: Theme.colors.textSecondary, fontSize: 13 },
  filterLabelActive: { color: Theme.colors.card },

  scrollContent: {
    paddingHorizontal: Theme.spacing.lg,
    paddingBottom: 96,
  },
  listCard: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.radius.lg,
    overflow: "hidden",
    ...Theme.shadows.soft,
  },

  loader: { flex: 1, justifyContent: "center", alignItems: "center" },

  habitRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md + 2,
  },
  habitIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Theme.spacing.md,
  },
  habitInfo: { flex: 1, justifyContent: "center" },
  habitRight: {
    alignItems: "flex-end",
    justifyContent: "center",
    minWidth: 52,
  },

  separator: {
    height: 1,
    backgroundColor: Theme.colors.border,
    marginLeft: 76,
    marginRight: Theme.spacing.lg,
  },

  emptyState: {
    paddingVertical: Theme.spacing.xxxl,
    alignItems: "center",
  },
});
