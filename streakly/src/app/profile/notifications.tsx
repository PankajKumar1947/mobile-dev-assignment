import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
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
import { Typography } from "../../components/typography";
import { Theme } from "../../theme/theme";

export default function NotificationsScreen() {
  const [habitReminders, setHabitReminders] = useState(true);
  const [streakNudges, setStreakNudges] = useState(true);
  const [announcements, setAnnouncements] = useState(true);
  const [generalReminders, setGeneralReminders] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={Theme.colors.background} />

      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Theme.colors.textPrimary} />
        </Pressable>
        <Typography variant="h2">Notifications</Typography>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Typography variant="label" color={Theme.colors.textSecondary} style={styles.sectionLabel}>
          Local Notifications
        </Typography>
        <Typography variant="caption" color={Theme.colors.textSecondary} style={styles.sectionCaption}>
          Scheduled reminders on your device.
        </Typography>

        <View style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingIcon}>
              <Ionicons name="calendar-outline" size={18} color={Theme.colors.textSecondary} />
            </View>
            <View style={styles.settingInfo}>
              <Typography variant="body">Habit Reminders</Typography>
              <Typography variant="caption" color={Theme.colors.textSecondary}>Scheduled on your device.</Typography>
            </View>
            <Switch
              value={habitReminders}
              onValueChange={setHabitReminders}
              trackColor={{ false: Theme.colors.border, true: Theme.colors.primaryLight }}
              thumbColor={habitReminders ? Theme.colors.primary : Theme.colors.card}
            />
          </View>

          <View style={styles.separator} />

          <Pressable style={styles.settingRow}>
            <View style={styles.settingIcon}>
              <Ionicons name="moon-outline" size={18} color={Theme.colors.textSecondary} />
            </View>
            <View style={styles.settingInfo}>
              <Typography variant="body">Quiet Hours</Typography>
              <Typography variant="caption" color={Theme.colors.textSecondary}>10:00 PM – 7:00 AM</Typography>
            </View>
            <Ionicons name="chevron-forward" size={16} color={Theme.colors.border} />
          </Pressable>
        </View>

        <Typography variant="label" color={Theme.colors.textSecondary} style={[styles.sectionLabel, { marginTop: Theme.spacing.xl }]}>
          Push Notifications
        </Typography>
        <Typography variant="caption" color={Theme.colors.textSecondary} style={styles.sectionCaption}>
          From the server. Requires internet.
        </Typography>

        <View style={styles.settingsCard}>
          {[
            { label: "Streak Nudges", caption: "Encouraging reminders", icon: "flame-outline" as const, value: streakNudges, setter: setStreakNudges },
            { label: "Announcements", caption: "News and updates.", icon: "megaphone-outline" as const, value: announcements, setter: setAnnouncements },
            { label: "General Reminders", caption: "Important reminders", icon: "notifications-outline" as const, value: generalReminders, setter: setGeneralReminders },
          ].map((item, idx, arr) => (
            <View key={item.label}>
              <View style={styles.settingRow}>
                <View style={styles.settingIcon}>
                  <Ionicons name={item.icon} size={18} color={Theme.colors.textSecondary} />
                </View>
                <View style={styles.settingInfo}>
                  <Typography variant="body">{item.label}</Typography>
                  <Typography variant="caption" color={Theme.colors.textSecondary}>{item.caption}</Typography>
                </View>
                <Switch
                  value={item.value}
                  onValueChange={item.setter}
                  trackColor={{ false: Theme.colors.border, true: Theme.colors.primaryLight }}
                  thumbColor={item.value ? Theme.colors.primary : Theme.colors.card}
                />
              </View>
              {idx < arr.length - 1 && <View style={styles.separator} />}
            </View>
          ))}
        </View>

        <Typography variant="caption" color={Theme.colors.textSecondary} style={styles.footer}>
          You can manage push notification permissions in your device settings.
        </Typography>
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
  sectionLabel: { marginBottom: 2 },
  sectionCaption: { marginBottom: Theme.spacing.md },
  settingsCard: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.radius.lg,
    overflow: "hidden",
    ...Theme.shadows.soft,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
  },
  settingIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Theme.spacing.md,
  },
  settingInfo: { flex: 1 },
  separator: { height: 1, backgroundColor: Theme.colors.border, marginLeft: 64 },
  footer: {
    marginTop: Theme.spacing.xl,
    textAlign: "center",
    lineHeight: 18,
  },
});
