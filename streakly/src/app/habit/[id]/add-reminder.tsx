import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../../components/button";
import { Typography } from "../../../components/typography";
import { Theme } from "../../../theme/theme";

const DAYS_SHORT = ["M", "T", "W", "T", "F", "S", "S"];

export default function AddReminderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [hour, setHour] = useState(8);
  const [minute, setMinute] = useState(0);
  const [period, setPeriod] = useState<"AM" | "PM">("AM");
  const [selectedDays, setSelectedDays] = useState<number[]>([0, 1, 2, 3, 4]);
  const [notificationLabel, setNotificationLabel] = useState("Workout time! 💪");
  const [sound, setSound] = useState("Gentle Chime");
  const [smartReschedule, setSmartReschedule] = useState(true);

  const toggleDay = (dayIndex: number) => {
    setSelectedDays((prev) =>
      prev.includes(dayIndex) ? prev.filter((d) => d !== dayIndex) : [...prev, dayIndex]
    );
  };

  const cycleHour = (dir: 1 | -1) =>
    setHour((h) => ((h + dir - 1 + 12) % 12) + 1);
  const cycleMinute = (dir: 1 | -1) =>
    setMinute((m) => (m + dir * 5 + 60) % 60);

  const handleSave = () => {
    router.back();
  };

  const handleDelete = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={Theme.colors.background} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={22} color={Theme.colors.textPrimary} />
        </Pressable>
        <Typography variant="h2">Add Reminder</Typography>
        <Pressable onPress={handleSave}>
          <Typography variant="bodyBold" color={Theme.colors.primary}>Save</Typography>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* ── Drum Roll Time Picker ── */}
        <View style={styles.timePicker}>
          {/* Hour column */}
          <View style={styles.timeColumn}>
            <Pressable onPress={() => cycleHour(1)}>
              <Typography variant="caption" color={Theme.colors.textSecondary} align="center">
                {((hour % 12) + 12 - 2) % 12 + 1 === 0 ? 12 : ((hour - 2 + 12) % 12) + 1}
              </Typography>
            </Pressable>
            <Typography variant="h1" style={styles.timeValue} align="center">
              {String(hour).padStart(2, "0")}
            </Typography>
            <Pressable onPress={() => cycleHour(-1)}>
              <Typography variant="caption" color={Theme.colors.textSecondary} align="center">
                {(hour % 12) + 1 === 0 ? 12 : (hour % 12) + 1}
              </Typography>
            </Pressable>
          </View>

          <Typography variant="h1" style={styles.timeSeparator}>:</Typography>

          {/* Minute column */}
          <View style={styles.timeColumn}>
            <Pressable onPress={() => cycleMinute(1)}>
              <Typography variant="caption" color={Theme.colors.textSecondary} align="center">
                {String((minute - 5 + 60) % 60).padStart(2, "0")}
              </Typography>
            </Pressable>
            <Typography variant="h1" style={styles.timeValue} align="center">
              {String(minute).padStart(2, "0")}
            </Typography>
            <Pressable onPress={() => cycleMinute(-1)}>
              <Typography variant="caption" color={Theme.colors.textSecondary} align="center">
                {String((minute + 5) % 60).padStart(2, "0")}
              </Typography>
            </Pressable>
          </View>

          {/* AM/PM */}
          <View style={styles.timeColumn}>
            <Pressable onPress={() => setPeriod("AM")}>
              <Typography
                variant="body"
                align="center"
                color={period === "AM" ? Theme.colors.textPrimary : Theme.colors.textSecondary}
                style={period === "AM" ? { fontWeight: "700" } : {}}
              >
                AM
              </Typography>
            </Pressable>
            <View style={{ height: Theme.spacing.xl }} />
            <Pressable onPress={() => setPeriod("PM")}>
              <Typography
                variant="body"
                align="center"
                color={period === "PM" ? Theme.colors.textPrimary : Theme.colors.textSecondary}
                style={period === "PM" ? { fontWeight: "700" } : {}}
              >
                PM
              </Typography>
            </Pressable>
          </View>
        </View>

        {/* ── Repeat Days ── */}
        <View style={styles.section}>
          <Typography variant="bodyBold" style={styles.sectionTitle}>Repeat</Typography>
          <View style={styles.daysRow}>
            {DAYS_SHORT.map((day, i) => {
              const isSelected = selectedDays.includes(i);
              return (
                <Pressable
                  key={i}
                  onPress={() => toggleDay(i)}
                  style={[
                    styles.dayCircle,
                    isSelected && { backgroundColor: Theme.colors.primary },
                  ]}
                >
                  <Typography
                    variant="captionBold"
                    color={isSelected ? Theme.colors.card : Theme.colors.textSecondary}
                    style={styles.dayLabel}
                  >
                    {day}
                  </Typography>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* ── End ── */}
        <Pressable style={styles.rowItem}>
          <Typography variant="body">End</Typography>
          <View style={styles.rowRight}>
            <Typography variant="body" color={Theme.colors.textSecondary}>Never</Typography>
            <Ionicons name="chevron-forward" size={16} color={Theme.colors.textSecondary} />
          </View>
        </Pressable>

        {/* ── Notification Label ── */}
        <View style={styles.section}>
          <Typography variant="bodyBold" style={styles.sectionTitle}>Notification Label</Typography>
          <TextInput
            style={styles.textInput}
            value={notificationLabel}
            onChangeText={setNotificationLabel}
          />
        </View>

        {/* ── Sound ── */}
        <Pressable style={styles.rowItem}>
          <Typography variant="body">Sound</Typography>
          <View style={styles.rowRight}>
            <Typography variant="body" color={Theme.colors.textSecondary}>{sound}</Typography>
            <Ionicons name="chevron-forward" size={16} color={Theme.colors.textSecondary} />
          </View>
        </Pressable>

        {/* ── Smart Reschedule ── */}
        <View style={styles.section}>
          <View style={styles.switchRow}>
            <View style={{ flex: 1 }}>
              <Typography variant="bodyBold">Smart Reschedule</Typography>
              <Typography variant="caption" color={Theme.colors.textSecondary}>
                If I miss a reminder, remind me 30 mins later.
              </Typography>
            </View>
            <Switch
              value={smartReschedule}
              onValueChange={setSmartReschedule}
              trackColor={{ false: Theme.colors.border, true: Theme.colors.primaryLight }}
              thumbColor={smartReschedule ? Theme.colors.primary : Theme.colors.card}
            />
          </View>
        </View>

        {/* ── Delete Reminder ── */}
        <Pressable onPress={handleDelete} style={styles.deleteBtn}>
          <Typography variant="bodyBold" color={Theme.colors.categories.workout.accent}>
            Delete Reminder
          </Typography>
        </Pressable>
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
    paddingTop: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    paddingRight: Theme.spacing.xl,
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

  // Time picker drum roll
  timePicker: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.radius.xl,
    paddingVertical: Theme.spacing.xl,
    marginBottom: Theme.spacing.lg,
    ...Theme.shadows.soft,
  },
  timeColumn: {
    alignItems: "center",
    width: 72,
  },
  timeValue: {
    fontSize: 44,
    lineHeight: 52,
    fontWeight: "700",
    color: Theme.colors.textPrimary,
  },
  timeSeparator: {
    fontSize: 44,
    fontWeight: "700",
    color: Theme.colors.textPrimary,
    marginHorizontal: 4,
  },

  section: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.md,
    ...Theme.shadows.soft,
  },
  sectionTitle: { marginBottom: Theme.spacing.md },

  daysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dayCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Theme.colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  dayLabel: { fontSize: 11 },

  rowItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.md,
    ...Theme.shadows.soft,
  },
  rowRight: { flexDirection: "row", alignItems: "center", gap: 4 },

  textInput: {
    fontSize: 15,
    color: Theme.colors.textPrimary,
    padding: 0,
  },

  switchRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  deleteBtn: {
    alignItems: "center",
    paddingVertical: Theme.spacing.lg,
    marginTop: Theme.spacing.sm,
  },
});
