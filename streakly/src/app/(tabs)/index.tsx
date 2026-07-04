import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "../../components/card";
import { Typography } from "../../components/typography";
import { useHabits } from "../../hooks/query/use-habits";
import { Theme } from "../../theme/theme";
import { Habit } from "../../types";

// ─── Constants ─────────────────────────────────────────────────────────────────
const DAYS = ["M", "T", "W", "T", "F", "S", "S"];
const TODAY_INDEX = 5;
const DATES = [4, 5, 6, 7, 8, 9, 10];
const DOT_COUNT = 8;

export default function TodayScreen() {
  const { data: initialHabits } = useHabits();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [selectedDay, setSelectedDay] = useState(TODAY_INDEX);

  useEffect(() => {
    if (initialHabits) setHabits(initialHabits);
  }, [initialHabits]);

  const completedHabits = habits.filter((h) => h.current >= h.target).length;

  const weeklyProgressData = [
    { day: "M", completion: 0.5 },
    { day: "T", completion: 0.8 },
    { day: "W", completion: 1.0 },
    { day: "T", completion: 0.7 },
    { day: "F", completion: habits.length > 0 ? completedHabits / habits.length : 0 },
    { day: "S", completion: 0.6 },
    { day: "S", completion: 0.3 },
  ];

  const toggleHabit = (id: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h;
        const isDone = h.current >= h.target;
        return { ...h, current: isDone ? 0 : h.target };
      })
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={Theme.colors.background} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <View>
            <Typography variant="caption" color={Theme.colors.textSecondary}>
              9 September 2023
            </Typography>
            <Typography variant="h1">Today</Typography>
          </View>
          <Pressable style={styles.calendarBtn}>
            <Ionicons name="calendar-outline" size={20} color={Theme.colors.textPrimary} />
          </Pressable>
        </View>

        {/* ── Week Day Selector ── */}
        <View style={styles.weekRow}>
          {DAYS.map((day, i) => {
            const isSelected = i === selectedDay;
            return (
              <Pressable
                key={i}
                onPress={() => setSelectedDay(i)}
                style={[styles.dayCell, isSelected && styles.dayCellActive]}
              >
                <Typography
                  variant="captionBold"
                  color={isSelected ? Theme.colors.card : Theme.colors.textSecondary}
                  style={styles.dayText}
                >
                  {day}
                </Typography>
                <Typography
                  variant="bodyBold"
                  color={isSelected ? Theme.colors.card : Theme.colors.textPrimary}
                  style={styles.dateText}
                >
                  {DATES[i]}
                </Typography>
              </Pressable>
            );
          })}
        </View>

        {/* ── Amazing Banner ── */}
        <Card style={styles.bannerCard}>
          <View style={styles.bannerRow}>
            <View style={styles.trophyCircle}>
              <Typography style={styles.trophyEmoji}>🏆</Typography>
            </View>
            <View style={{ flex: 1 }}>
              <Typography variant="bodyBold">Amazing, Alex! 🎉</Typography>
              <Typography variant="caption">
                You completed {completedHabits} habits today
              </Typography>
            </View>
          </View>
        </Card>

        {/* ── 2-Col Habit Cards ── */}
        <View style={styles.habitGrid}>
          {habits.map((habit) => {
            const cat = Theme.colors.categories[habit.category] ?? {
              bg: Theme.colors.primaryLight,
              accent: Theme.colors.primary,
            };
            const isDone = habit.current >= habit.target;
            const filledDots = Math.round((habit.current / habit.target) * DOT_COUNT);

            return (
              <Pressable
                key={habit.id}
                onPress={() => toggleHabit(habit.id)}
                style={({ pressed }) => [styles.habitCard, pressed && { opacity: 0.85 }]}
              >
                <View style={styles.habitCardHeader}>
                  <View style={[styles.habitIcon, { backgroundColor: cat.bg }]}>
                    <Ionicons name={habit.icon as any} size={18} color={cat.accent} />
                  </View>
                  {isDone && (
                    <Ionicons name="checkmark-circle" size={18} color={Theme.colors.primary} />
                  )}
                </View>
                <Typography variant="bodyBold" style={styles.habitCardName}>
                  {habit.name}
                </Typography>
                <Typography variant="caption" color={Theme.colors.textSecondary}>
                  {habit.frequency}
                </Typography>
                {/* Progress dots */}
                <View style={styles.dotsRow}>
                  {Array.from({ length: DOT_COUNT }).map((_, di) => (
                    <View
                      key={di}
                      style={[
                        styles.dot,
                        { backgroundColor: di < filledDots ? cat.accent : Theme.colors.border },
                      ]}
                    />
                  ))}
                </View>
                <View style={styles.habitCardFooter}>
                  <Typography variant="captionBold" color={Theme.colors.textSecondary}>
                    {habit.current}/{habit.target} {habit.unit}
                  </Typography>
                  {habit.time && (
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Ionicons name="time-outline" size={11} color={Theme.colors.textSecondary} />
                      <Typography
                        variant="caption"
                        color={Theme.colors.textSecondary}
                        style={{ marginLeft: 2, fontSize: 10 }}
                      >
                        {habit.time}
                      </Typography>
                    </View>
                  )}
                  {!habit.time && isDone && (
                    <Ionicons name="checkmark" size={14} color={Theme.colors.primary} />
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* ── Glassmorphic Daily Quote ── */}
        <Card variant="glass" style={styles.quoteCard}>
          <View style={{ paddingRight: 64, zIndex: 1 }}>
            <Typography
              variant="captionBold"
              color={Theme.colors.primary}
              style={{ marginBottom: 6 }}
            >
              Daily Quote
            </Typography>
            <Typography variant="body" style={styles.quoteText}>
              Discipline is choosing between what you want now and what you want most.
            </Typography>
          </View>
          <View style={styles.leafOrn} pointerEvents="none">
            <Ionicons name="leaf" size={80} color="rgba(59,142,99,0.13)" />
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Theme.colors.background },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: Theme.spacing.lg,
    paddingTop: Theme.spacing.lg,
    paddingBottom: 96,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: Theme.spacing.xl,
  },
  calendarBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.colors.card,
    justifyContent: "center",
    alignItems: "center",
    ...Theme.shadows.soft,
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.sm,
    marginBottom: Theme.spacing.lg,
    ...Theme.shadows.soft,
  },
  dayCell: {
    flex: 1,
    alignItems: "center",
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.radius.md,
  },
  dayCellActive: { backgroundColor: Theme.colors.primary },
  dayText: { fontSize: 10, marginBottom: 2 },
  dateText: { fontSize: 15 },
  bannerCard: {
    marginBottom: Theme.spacing.lg,
    padding: Theme.spacing.md,
    borderRadius: Theme.radius.lg,
  },
  bannerRow: { flexDirection: "row", alignItems: "center" },
  trophyCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFF8E7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: Theme.spacing.md,
  },
  trophyEmoji: { fontSize: 22 },
  habitGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: Theme.spacing.lg,
  },
  habitCard: {
    width: "48.5%",
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    ...Theme.shadows.soft,
  },
  habitCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Theme.spacing.md,
  },
  habitIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
  },
  habitCardName: { fontSize: 13, marginBottom: 2 },
  dotsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: Theme.spacing.sm,
    marginBottom: Theme.spacing.xs,
    gap: 4,
  },
  dot: { width: 7, height: 7, borderRadius: 3.5 },
  habitCardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Theme.spacing.xs,
  },
  quoteCard: {
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.lg,
    overflow: "hidden",
    marginBottom: Theme.spacing.xl,
  },
  quoteText: {
    fontSize: 14,
    lineHeight: 21,
    fontStyle: "italic",
    color: Theme.colors.textPrimary,
  },
  leafOrn: { position: "absolute", right: -4, bottom: -12 },
});
