import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Typography } from "../../components/typography";
import { Theme } from "../../theme/theme";

const DAYS_SHORT = ["M", "T", "W", "T", "F", "S", "S"];
const MONTHS = ["August 2023", "September 2023", "October 2023"];

const CALENDAR_DATA: Record<string, Record<number, "full" | "partial" | "none" | "future">> = {
  "September 2023": {
    1: "full", 2: "full", 3: "partial", 4: "full", 5: "full",
    6: "full", 7: "partial", 8: "full", 9: "partial",
    10: "future", 11: "future", 12: "future", 13: "future",
    14: "future", 15: "future", 16: "future", 17: "future",
    18: "future", 19: "future", 20: "future", 21: "future",
    22: "future", 23: "future", 24: "future", 25: "future",
    26: "future", 27: "future", 28: "future", 29: "future",
    30: "future",
  },
};

const MONTH_START_DAY: Record<string, number> = {
  "September 2023": 5, // Friday
};

const DAYS_IN_MONTH: Record<string, number> = {
  "September 2023": 30,
};

function CalendarMonth({ month }: { month: string }) {
  const data = CALENDAR_DATA[month] ?? {};
  const startDay = MONTH_START_DAY[month] ?? 0;
  const daysInMonth = DAYS_IN_MONTH[month] ?? 30;
  const cells: (number | null)[] = [
    ...Array(startDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <View style={calStyles.monthBlock}>
      <Typography variant="bodyBold" style={calStyles.monthTitle}>{month}</Typography>
      <View style={calStyles.dayLabels}>
        {DAYS_SHORT.map((d, i) => (
          <Typography key={i} variant="captionBold" color={Theme.colors.textSecondary} style={calStyles.dayLabel}>
            {d}
          </Typography>
        ))}
      </View>
      <View style={calStyles.grid}>
        {cells.map((day, idx) => {
          const status = day ? (data[day] ?? "future") : null;
          const bgColor =
            status === "full" ? Theme.colors.primary :
            status === "partial" ? Theme.colors.primaryLight :
            "transparent";
          const textColor =
            status === "full" ? Theme.colors.card :
            status === "partial" ? Theme.colors.primary :
            Theme.colors.textSecondary;

          return (
            <View key={idx} style={calStyles.cell}>
              {day ? (
                <View style={[calStyles.dayCircle, { backgroundColor: bgColor }]}>
                  <Typography
                    variant="captionBold"
                    style={{ color: textColor, fontSize: 12 }}
                  >
                    {day}
                  </Typography>
                </View>
              ) : null}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const calStyles = StyleSheet.create({
  monthBlock: { marginBottom: Theme.spacing.xl },
  monthTitle: { marginBottom: Theme.spacing.md },
  dayLabels: { flexDirection: "row", marginBottom: Theme.spacing.sm },
  dayLabel: { flex: 1, textAlign: "center", fontSize: 11 },
  grid: { flexDirection: "row", flexWrap: "wrap" },
  cell: { width: `${100 / 7}%` as any, alignItems: "center", marginBottom: 6 },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default function CalendarScreen() {
  const [selectedMonth, setSelectedMonth] = useState("September 2023");

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={Theme.colors.background} />

      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Theme.colors.textPrimary} />
        </Pressable>
        <Typography variant="h2">Calendar</Typography>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.legend}>
        {[
          { color: Theme.colors.primary, label: "All done" },
          { color: Theme.colors.primaryLight, label: "Partial" },
          { color: Theme.colors.border, label: "Missed" },
        ].map((l) => (
          <View key={l.label} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: l.color }]} />
            <Typography variant="caption" color={Theme.colors.textSecondary}>{l.label}</Typography>
          </View>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.calCard}>
          <CalendarMonth month="September 2023" />
        </View>
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
    marginBottom: Theme.spacing.md,
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
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Theme.spacing.xl,
    paddingVertical: Theme.spacing.sm,
    marginBottom: Theme.spacing.md,
  },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  scrollContent: {
    paddingHorizontal: Theme.spacing.lg,
    paddingBottom: Theme.spacing.xxxl,
  },
  calCard: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.lg,
    ...Theme.shadows.soft,
  },
});
