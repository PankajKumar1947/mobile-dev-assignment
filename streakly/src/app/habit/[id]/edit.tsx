import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Typography } from "../../../components/typography";
import { Theme } from "../../../theme/theme";
import { HabitCategory, Reminder } from "../../../types";

const DAYS_SHORT = ["M", "T", "W", "T", "F", "S", "S"];

// Dummy seed data by habit id
const EDIT_SEED: Record<string, {
  name: string;
  description: string;
  icon: string;
  category: HabitCategory;
  frequencyLabel: string;
  selectedDays: number[];
  target: string;
  targetUnit: string;
  perLabel: string;
  reminders: Reminder[];
}> = {
  "4": {
    name: "Workout",
    description: "Stay strong and healthy.",
    icon: "barbell",
    category: "workout",
    frequencyLabel: "3 times a week",
    selectedDays: [0, 2, 4], // Mon, Wed, Fri
    target: "3",
    targetUnit: "times",
    perLabel: "per week",
    reminders: [
      { id: "r1", time: "08:00 AM", repeatLabel: "Mon, Wed, Fri", enabled: true },
      { id: "r2", time: "06:00 PM", repeatLabel: "Mon, Wed, Fri", enabled: false },
    ],
  },
};

const DEFAULT_SEED = {
  name: "New Habit",
  description: "",
  icon: "star",
  category: "read" as HabitCategory,
  frequencyLabel: "Daily",
  selectedDays: [0, 1, 2, 3, 4],
  target: "1",
  targetUnit: "time",
  perLabel: "per day",
  reminders: [] as Reminder[],
};

export default function EditHabitScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const seed = EDIT_SEED[id ?? ""] ?? DEFAULT_SEED;
  const cat = Theme.colors.categories[seed.category];

  const [name, setName] = useState(seed.name);
  const [description, setDescription] = useState(seed.description);
  const [selectedDays, setSelectedDays] = useState<number[]>(seed.selectedDays);
  const [target, setTarget] = useState(seed.target);
  const [reminders, setReminders] = useState<Reminder[]>(seed.reminders);

  const toggleDay = (dayIndex: number) => {
    setSelectedDays((prev) =>
      prev.includes(dayIndex) ? prev.filter((d) => d !== dayIndex) : [...prev, dayIndex]
    );
  };

  const toggleReminder = (reminderId: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === reminderId ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const handleSave = () => {
    Alert.alert("Habit Updated", `"${name}" has been updated.`, [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  const handleDelete = () => {
    Alert.alert("Delete Habit", `Are you sure you want to delete "${name}"?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => router.back() },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={Theme.colors.background} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={22} color={Theme.colors.textPrimary} />
        </Pressable>
        <Typography variant="h2">Edit Habit</Typography>
        <Pressable onPress={handleSave} style={styles.headerBtn}>
          <Ionicons name="checkmark" size={22} color={Theme.colors.primary} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* ── Icon ── */}
        <View style={styles.iconCenter}>
          <View style={[styles.iconCircle, { backgroundColor: cat.bg }]}>
            <Ionicons name={seed.icon as any} size={38} color={cat.accent} />
          </View>
        </View>

        {/* ── Habit Name ── */}
        <View style={styles.fieldCard}>
          <Typography variant="label" style={styles.fieldLabel}>Habit Name</Typography>
          <TextInput
            style={styles.textInput}
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* ── Description ── */}
        <View style={styles.fieldCard}>
          <Typography variant="label" style={styles.fieldLabel}>Description (optional)</Typography>
          <TextInput
            style={[styles.textInput, { minHeight: 36 }]}
            value={description}
            onChangeText={setDescription}
            multiline
            placeholder="Stay strong and healthy."
            placeholderTextColor={Theme.colors.textSecondary}
          />
        </View>

        {/* ── Frequency ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Typography variant="label" style={styles.fieldLabel}>Frequency</Typography>
          </View>
          <View style={styles.frequencyRow}>
            <Typography variant="body">{seed.frequencyLabel}</Typography>
            <Pressable style={styles.customDaysBtn}>
              <Typography variant="caption" color={Theme.colors.primary}>Custom Days</Typography>
              <Ionicons name="chevron-forward" size={14} color={Theme.colors.primary} />
            </Pressable>
          </View>

          {/* Day Selector */}
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

        {/* ── Target ── */}
        <View style={styles.section}>
          <Typography variant="label" style={styles.fieldLabel}>Target</Typography>
          <View style={styles.targetRow}>
            <TextInput
              style={styles.targetInput}
              value={target}
              onChangeText={setTarget}
              keyboardType="numeric"
            />
            <Typography variant="body" style={{ marginHorizontal: Theme.spacing.md }}>
              {seed.targetUnit}
            </Typography>
            <Typography variant="body" color={Theme.colors.textSecondary}>
              {seed.perLabel}
            </Typography>
          </View>
        </View>

        {/* ── Reminders ── */}
        <View style={styles.section}>
          <Typography variant="label" style={[styles.fieldLabel, { marginBottom: Theme.spacing.md }]}>
            Reminders
          </Typography>
          {reminders.map((reminder) => (
            <View key={reminder.id} style={styles.reminderRow}>
              <Ionicons name="calendar-outline" size={16} color={Theme.colors.textSecondary} />
              <View style={{ flex: 1, marginLeft: Theme.spacing.md }}>
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
          ))}
          <Pressable
            style={styles.addReminderBtn}
            onPress={() =>
              setReminders((prev) => [
                ...prev,
                { id: `r${Date.now()}`, time: "09:00 AM", repeatLabel: "Every day", enabled: true },
              ])
            }
          >
            <Ionicons name="add" size={18} color={Theme.colors.primary} />
            <Typography variant="bodyBold" color={Theme.colors.primary} style={{ marginLeft: 4 }}>
              Add Reminder
            </Typography>
          </Pressable>
        </View>

        {/* ── Delete ── */}
        <Pressable onPress={handleDelete} style={styles.deleteBtn}>
          <Typography variant="bodyBold" color={Theme.colors.categories.workout.accent}>
            Delete Habit
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
  iconCenter: { alignItems: "center", marginBottom: Theme.spacing.xl },
  iconCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    justifyContent: "center",
    alignItems: "center",
    ...Theme.shadows.soft,
  },
  fieldCard: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.md,
    ...Theme.shadows.soft,
  },
  fieldLabel: { marginBottom: Theme.spacing.sm, color: Theme.colors.textSecondary },
  textInput: {
    fontSize: 15,
    color: Theme.colors.textPrimary,
    padding: 0,
  },
  section: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.md,
    ...Theme.shadows.soft,
  },
  sectionHeaderRow: { marginBottom: Theme.spacing.sm },
  frequencyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Theme.spacing.md,
  },
  customDaysBtn: { flexDirection: "row", alignItems: "center" },
  daysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: Theme.spacing.sm,
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
  targetRow: { flexDirection: "row", alignItems: "center" },
  targetInput: {
    width: 56,
    height: 40,
    backgroundColor: Theme.colors.background,
    borderRadius: Theme.radius.sm,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: Theme.colors.textPrimary,
  },
  reminderRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  addReminderBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Theme.spacing.md,
  },
  deleteBtn: {
    alignItems: "center",
    paddingVertical: Theme.spacing.lg,
    marginTop: Theme.spacing.md,
  },
});
