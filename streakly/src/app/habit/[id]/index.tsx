import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../../components/button";
import { Typography } from "../../../components/typography";
import { Theme } from "../../../theme/theme";
import { Reminder } from "../../../types";

// ─── Dummy data for the detail screen ─────────────────────────────────────────
const HABIT_DATA: Record<string, {
  name: string;
  subtitle: string;
  icon: string;
  category: "water" | "code" | "read" | "workout" | "meditate" | "noSugar";
  description: string;
  current: number;
  target: number;
  unitIcon: string;
  streakDays: number;
  reminders: Reminder[];
}> = {
  "1": {
    name: "Drink Water",
    subtitle: "8 glasses a day",
    icon: "water",
    category: "water",
    description: "Staying hydrated helps your body and mind perform better.",
    current: 8,
    target: 8,
    unitIcon: "🥛",
    streakDays: 12,
    reminders: [
      { id: "r1", time: "09:00 AM", repeatLabel: "Every day", enabled: true },
      { id: "r2", time: "01:00 PM", repeatLabel: "Every day", enabled: true },
      { id: "r3", time: "07:00 PM", repeatLabel: "Every day", enabled: false },
    ],
  },
  "2": {
    name: "Code 1 Hour",
    subtitle: "Daily",
    icon: "code-slash",
    category: "code",
    description: "Consistent practice builds deep skills over time.",
    current: 45,
    target: 60,
    unitIcon: "💻",
    streakDays: 8,
    reminders: [
      { id: "r1", time: "06:00 PM", repeatLabel: "Every day", enabled: true },
    ],
  },
  "3": {
    name: "Read",
    subtitle: "20 pages a day",
    icon: "book",
    category: "read",
    description: "Build knowledge and improve focus.",
    current: 12,
    target: 20,
    unitIcon: "📖",
    streakDays: 5,
    reminders: [],
  },
  "4": {
    name: "Workout",
    subtitle: "3 times a week",
    icon: "barbell",
    category: "workout",
    description: "Stay strong and healthy.",
    current: 2,
    target: 3,
    unitIcon: "💪",
    streakDays: 12,
    reminders: [
      { id: "r1", time: "08:00 AM", repeatLabel: "Mon, Wed, Fri", enabled: true },
      { id: "r2", time: "06:00 PM", repeatLabel: "Mon, Wed, Fri", enabled: false },
    ],
  },
  "5": {
    name: "Meditate",
    subtitle: "5 minutes a day",
    icon: "leaf",
    category: "meditate",
    description: "A calm mind leads to better decisions.",
    current: 3,
    target: 5,
    unitIcon: "🧘",
    streakDays: 3,
    reminders: [],
  },
  "6": {
    name: "No Sugar",
    subtitle: "5 days a week",
    icon: "nutrition",
    category: "noSugar",
    description: "Cutting sugar improves energy and sleep quality.",
    current: 4,
    target: 5,
    unitIcon: "🥗",
    streakDays: 4,
    reminders: [],
  },
};

export default function HabitDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const habit = HABIT_DATA[id ?? "1"] ?? HABIT_DATA["1"];
  const cat = Theme.colors.categories[habit.category];

  const [reminders, setReminders] = useState<Reminder[]>(habit.reminders);
  const [isDone, setIsDone] = useState(habit.current >= habit.target);

  const toggleReminder = (reminderId: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === reminderId ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const progress = Math.min(habit.current / habit.target, 1);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={Theme.colors.background} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={22} color={Theme.colors.textPrimary} />
        </Pressable>
        <Pressable style={styles.headerBtn}>
          <Ionicons name="ellipsis-horizontal" size={22} color={Theme.colors.textPrimary} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ── Big Icon ── */}
        <View style={styles.iconSection}>
          <View style={[styles.bigIconCircle, { backgroundColor: cat.bg }]}>
            <Ionicons name={habit.icon as any} size={52} color={cat.accent} />
          </View>
          <Typography variant="h1" align="center" style={styles.habitTitle}>
            {habit.name}
          </Typography>
          <Typography variant="caption" align="center" color={Theme.colors.textSecondary}>
            {habit.subtitle}
          </Typography>
        </View>

        {/* ── Progress Unit Icons ── */}
        <View style={styles.unitIconsRow}>
          {Array.from({ length: habit.target }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.unitIconBubble,
                {
                  backgroundColor: i < habit.current ? cat.bg : Theme.colors.border,
                  borderColor: i < habit.current ? cat.accent : "transparent",
                },
              ]}
            >
              <Typography style={styles.unitIconText}>{habit.unitIcon}</Typography>
            </View>
          ))}
        </View>

        {/* ── About this habit ── */}
        <View style={styles.section}>
          <Typography variant="bodyBold" style={styles.sectionTitle}>
            About this habit
          </Typography>
          <Typography variant="body" color={Theme.colors.textSecondary}>
            {habit.description}
          </Typography>
        </View>

        {/* ── Reminders ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Typography variant="bodyBold" style={styles.sectionTitle}>
              Reminders
            </Typography>
            <Pressable onPress={() => router.push(`/habit/${id}/add-reminder` as any)}>
              <Ionicons name="add" size={22} color={Theme.colors.primary} />
            </Pressable>
          </View>

          {reminders.length === 0 ? (
            <Typography variant="caption" color={Theme.colors.textSecondary}>
              No reminders set.
            </Typography>
          ) : (
            reminders.map((reminder) => (
              <View key={reminder.id} style={styles.reminderRow}>
                <Ionicons name="calendar-outline" size={16} color={Theme.colors.textSecondary} />
                <View style={styles.reminderText}>
                  <Typography variant="bodyBold">{reminder.time}</Typography>
                  <Typography variant="caption" color={Theme.colors.textSecondary}>
                    {reminder.repeatLabel}
                  </Typography>
                </View>
                <Switch
                  value={reminder.enabled}
                  onValueChange={() => toggleReminder(reminder.id)}
                  trackColor={{ false: Theme.colors.border, true: Theme.colors.primaryLight }}
                  thumbColor={reminder.enabled ? Theme.colors.primary : Theme.colors.card}
                />
              </View>
            ))
          )}
        </View>

        {/* ── Streak ── */}
        <View style={styles.streakCard}>
          <Typography style={styles.streakEmoji}>🔥</Typography>
          <View style={{ flex: 1 }}>
            <Typography variant="bodyBold">{habit.streakDays} days</Typography>
            <Typography variant="caption" color={Theme.colors.textSecondary}>
              Keep it going!
            </Typography>
          </View>
        </View>

        {/* ── Progress Bar ── */}
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` as any, backgroundColor: cat.accent }]} />
        </View>

        {/* ── CTA ── */}
        <Button
          title={isDone ? "✓ Completed!" : "✓ Mark as Done"}
          variant={isDone ? "secondary" : "primary"}
          onPress={() => setIsDone((v) => !v)}
          style={styles.ctaButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Theme.colors.background },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Theme.spacing.lg,
    paddingTop: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.colors.card,
    justifyContent: "center",
    alignItems: "center",
    ...Theme.shadows.soft,
  },
  scrollContent: {
    paddingHorizontal: Theme.spacing.lg,
    paddingBottom: Theme.spacing.xxxl,
  },
  iconSection: { alignItems: "center", marginBottom: Theme.spacing.xl },
  bigIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Theme.spacing.lg,
    ...Theme.shadows.soft,
  },
  habitTitle: { marginBottom: Theme.spacing.xs },
  unitIconsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: Theme.spacing.sm,
    marginBottom: Theme.spacing.xl,
  },
  unitIconBubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  unitIconText: { fontSize: 16 },
  section: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.lg,
    ...Theme.shadows.soft,
  },
  sectionTitle: { marginBottom: Theme.spacing.md },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Theme.spacing.md,
  },
  reminderRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  reminderText: { flex: 1, marginLeft: Theme.spacing.md },
  streakCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.md,
    ...Theme.shadows.soft,
  },
  streakEmoji: { fontSize: 28, marginRight: Theme.spacing.md },
  progressTrack: {
    height: 8,
    backgroundColor: Theme.colors.border,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: Theme.spacing.xl,
  },
  progressFill: { height: "100%", borderRadius: 4 },
  ctaButton: { marginBottom: Theme.spacing.md },
});
