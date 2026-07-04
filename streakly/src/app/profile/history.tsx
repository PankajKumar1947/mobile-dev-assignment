import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Typography } from "../../components/typography";
import { Theme } from "../../theme/theme";

const HISTORY = [
  {
    date: "Today, Sep 9",
    completions: [
      { name: "Drink Water", icon: "water", category: "water" as const, done: true },
      { name: "Code 1 Hour", icon: "code-slash", category: "code" as const, done: true },
      { name: "Read", icon: "book", category: "read" as const, done: false },
      { name: "Workout", icon: "barbell", category: "workout" as const, done: false },
    ],
  },
  {
    date: "Yesterday, Sep 8",
    completions: [
      { name: "Drink Water", icon: "water", category: "water" as const, done: true },
      { name: "Code 1 Hour", icon: "code-slash", category: "code" as const, done: true },
      { name: "Read", icon: "book", category: "read" as const, done: true },
      { name: "Workout", icon: "barbell", category: "workout" as const, done: false },
    ],
  },
  {
    date: "Sep 7",
    completions: [
      { name: "Drink Water", icon: "water", category: "water" as const, done: true },
      { name: "Code 1 Hour", icon: "code-slash", category: "code" as const, done: false },
      { name: "Read", icon: "book", category: "read" as const, done: true },
      { name: "Workout", icon: "barbell", category: "workout" as const, done: true },
    ],
  },
  {
    date: "Sep 6",
    completions: [
      { name: "Drink Water", icon: "water", category: "water" as const, done: true },
      { name: "Code 1 Hour", icon: "code-slash", category: "code" as const, done: true },
      { name: "Read", icon: "book", category: "read" as const, done: true },
      { name: "Workout", icon: "barbell", category: "workout" as const, done: true },
    ],
  },
];

export default function HistoryScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={Theme.colors.background} />

      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Theme.colors.textPrimary} />
        </Pressable>
        <Typography variant="h2">History</Typography>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {HISTORY.map((day) => {
          const done = day.completions.filter((c) => c.done).length;
          const total = day.completions.length;
          return (
            <View key={day.date} style={styles.dayBlock}>
              <View style={styles.dayHeader}>
                <Typography variant="bodyBold">{day.date}</Typography>
                <Typography variant="caption" color={Theme.colors.textSecondary}>
                  {done}/{total} completed
                </Typography>
              </View>
              <View style={styles.dayCard}>
                {day.completions.map((item, idx) => {
                  const cat = Theme.colors.categories[item.category];
                  return (
                    <View key={item.name}>
                      <View style={styles.habitRow}>
                        <View style={[styles.habitIcon, { backgroundColor: cat.bg }]}>
                          <Ionicons name={item.icon as any} size={16} color={cat.accent} />
                        </View>
                        <Typography variant="body" style={{ flex: 1 }}>{item.name}</Typography>
                        <Ionicons
                          name={item.done ? "checkmark-circle" : "ellipse-outline"}
                          size={20}
                          color={item.done ? Theme.colors.primary : Theme.colors.border}
                        />
                      </View>
                      {idx < day.completions.length - 1 && <View style={styles.separator} />}
                    </View>
                  );
                })}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Theme.colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Theme.spacing.lg,
    paddingTop: Theme.spacing.lg,
    marginBottom: Theme.spacing.lg,
  },
  backBtn: {
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
  dayBlock: { marginBottom: Theme.spacing.xl },
  dayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Theme.spacing.sm,
  },
  dayCard: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.radius.lg,
    overflow: "hidden",
    ...Theme.shadows.soft,
  },
  habitRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
  },
  habitIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Theme.spacing.md,
  },
  separator: { height: 1, backgroundColor: Theme.colors.border, marginLeft: 62 },
});
