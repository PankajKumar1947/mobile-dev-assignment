import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
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
import { Button } from "../../components/button";
import { Typography } from "../../components/typography";
import { Theme } from "../../theme/theme";
import { HabitCategory, Reminder } from "../../types";

// ─── Category icons available for selection ────────────────────────────────────
const CATEGORY_OPTIONS: { key: HabitCategory; icon: string; label: string }[] = [
  { key: "water", icon: "water", label: "Water" },
  { key: "code", icon: "code-slash", label: "Code" },
  { key: "read", icon: "book", label: "Read" },
  { key: "workout", icon: "barbell", label: "Workout" },
  { key: "meditate", icon: "leaf", label: "Meditate" },
  { key: "noSugar", icon: "nutrition", label: "Diet" },
];

type FrequencyType = "daily" | "weekdays" | "customDays" | "everyXDays";

const FREQUENCY_OPTIONS: { key: FrequencyType; label: string }[] = [
  { key: "daily", label: "Daily" },
  { key: "weekdays", label: "Weekdays" },
  { key: "customDays", label: "Custom Days" },
  { key: "everyXDays", label: "Every X Days" },
];

export default function CreateHabitScreen() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<HabitCategory>("read");
  const [frequency, setFrequency] = useState<FrequencyType>("daily");
  const [targetValue, setTargetValue] = useState("20");
  const [targetUnit, setTargetUnit] = useState("pages");
  const [reminders, setReminders] = useState<Reminder[]>([
    { id: "r1", time: "07:00 PM", repeatLabel: "Every day", enabled: true },
  ]);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  const cat = Theme.colors.categories[category];

  const toggleReminder = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const handleCreate = () => {
    if (!name.trim()) {
      Alert.alert("Habit Name Required", "Please enter a name for your habit.");
      return;
    }
    Alert.alert("Habit Created!", `"${name}" has been added to your habits.`, [
      { text: "OK", onPress: () => router.back() },
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
        <Typography variant="h2">Create New Habit</Typography>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* ── Icon Picker ── */}
        <Pressable
          style={styles.iconPickerCenter}
          onPress={() => setShowCategoryPicker((v) => !v)}
        >
          <View style={[styles.iconCircle, { backgroundColor: cat.bg }]}>
            <Ionicons name={CATEGORY_OPTIONS.find((c) => c.key === category)?.icon as any} size={38} color={cat.accent} />
          </View>
          <Typography variant="caption" color={Theme.colors.textSecondary} style={{ marginTop: 6 }}>
            Tap to change icon
          </Typography>
        </Pressable>

        {/* Category Picker Row */}
        {showCategoryPicker && (
          <View style={styles.categoryRow}>
            {CATEGORY_OPTIONS.map((opt) => {
              const optCat = Theme.colors.categories[opt.key];
              const isSelected = category === opt.key;
              return (
                <Pressable
                  key={opt.key}
                  onPress={() => { setCategory(opt.key); setShowCategoryPicker(false); }}
                  style={[styles.categoryOption, isSelected && { borderColor: optCat.accent, borderWidth: 2 }]}
                >
                  <View style={[styles.categoryOptionIcon, { backgroundColor: optCat.bg }]}>
                    <Ionicons name={opt.icon as any} size={20} color={optCat.accent} />
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}

        {/* ── Habit Name ── */}
        <View style={styles.fieldCard}>
          <Typography variant="label" style={styles.fieldLabel}>Habit Name</Typography>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="e.g. Read 20 pages"
              placeholderTextColor={Theme.colors.textSecondary}
            />
            {name.length > 0 && (
              <Pressable onPress={() => setName("")}>
                <Ionicons name="close-circle" size={18} color={Theme.colors.textSecondary} />
              </Pressable>
            )}
          </View>
        </View>

        {/* ── Description ── */}
        <View style={styles.fieldCard}>
          <Typography variant="label" style={styles.fieldLabel}>Description (optional)</Typography>
          <TextInput
            style={[styles.textInput, styles.multilineInput]}
            value={description}
            onChangeText={setDescription}
            placeholder="Build knowledge and improve focus."
            placeholderTextColor={Theme.colors.textSecondary}
            multiline
            numberOfLines={2}
          />
        </View>

        {/* ── Frequency ── */}
        <View style={styles.section}>
          <Typography variant="bodyBold" style={styles.sectionTitle}>Frequency</Typography>
          {FREQUENCY_OPTIONS.map((opt) => {
            const isSelected = frequency === opt.key;
            return (
              <Pressable
                key={opt.key}
                onPress={() => setFrequency(opt.key)}
                style={styles.frequencyRow}
              >
                <Ionicons name="calendar-outline" size={18} color={Theme.colors.textSecondary} />
                <Typography variant="body" style={{ flex: 1, marginLeft: Theme.spacing.md }}>
                  {opt.label}
                </Typography>
                {isSelected && (
                  <View style={styles.checkCircle}>
                    <Ionicons name="checkmark" size={14} color={Theme.colors.card} />
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>

        {/* ── Target ── */}
        <View style={styles.section}>
          <Typography variant="bodyBold" style={styles.sectionTitle}>Target</Typography>
          <View style={styles.targetRow}>
            <TextInput
              style={styles.targetInput}
              value={targetValue}
              onChangeText={setTargetValue}
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.targetInput, { flex: 1, marginHorizontal: Theme.spacing.sm }]}
              value={targetUnit}
              onChangeText={setTargetUnit}
              placeholder="pages"
              placeholderTextColor={Theme.colors.textSecondary}
            />
            <Typography variant="body" color={Theme.colors.textSecondary}>per day</Typography>
          </View>
        </View>

        {/* ── Reminders ── */}
        <View style={styles.section}>
          <Typography variant="bodyBold" style={styles.sectionTitle}>Reminders</Typography>
          {reminders.map((reminder) => (
            <View key={reminder.id} style={styles.reminderRow}>
              <Ionicons name="calendar-outline" size={16} color={Theme.colors.textSecondary} />
              <View style={{ flex: 1, marginLeft: Theme.spacing.md }}>
                <Typography variant="bodyBold">{reminder.time}</Typography>
                <Typography variant="caption" color={Theme.colors.textSecondary}>{reminder.repeatLabel}</Typography>
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

        {/* ── Create Habit CTA ── */}
        <Button title="Create Habit" variant="primary" onPress={handleCreate} style={styles.ctaButton} />
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
  iconPickerCenter: { alignItems: "center", marginBottom: Theme.spacing.xl },
  iconCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    justifyContent: "center",
    alignItems: "center",
    ...Theme.shadows.soft,
  },
  categoryRow: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: Theme.spacing.md,
    marginBottom: Theme.spacing.xl,
    backgroundColor: Theme.colors.card,
    padding: Theme.spacing.md,
    borderRadius: Theme.radius.lg,
    ...Theme.shadows.soft,
  },
  categoryOption: {
    borderRadius: Theme.radius.md,
    padding: 4,
    borderColor: "transparent",
    borderWidth: 2,
  },
  categoryOptionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  fieldCard: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.md,
    ...Theme.shadows.soft,
  },
  fieldLabel: { marginBottom: Theme.spacing.sm, color: Theme.colors.textSecondary },
  inputRow: { flexDirection: "row", alignItems: "center" },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: Theme.colors.textPrimary,
    padding: 0,
  },
  multilineInput: { minHeight: 40, textAlignVertical: "top" },
  section: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.md,
    ...Theme.shadows.soft,
  },
  sectionTitle: { marginBottom: Theme.spacing.md },
  frequencyRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
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
  ctaButton: { marginTop: Theme.spacing.md },
});
