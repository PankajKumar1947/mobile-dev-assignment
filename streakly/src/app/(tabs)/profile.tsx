import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Typography } from "../../components/typography";
import { useProfile } from "../../hooks/query/use-profile";
import { Theme } from "../../theme/theme";

const MENU_ITEMS: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  badge?: string;
  route: string;
}[] = [
  { label: "Achievements", icon: "trophy-outline", badge: "12/30", route: "/profile/achievements" },
  { label: "History", icon: "time-outline", route: "/profile/history" },
  { label: "Calendar", icon: "calendar-outline", route: "/profile/calendar" },
  { label: "Reminders", icon: "notifications-outline", route: "/profile/notifications" },
  { label: "Backup & Sync", icon: "cloud-upload-outline", route: "/profile/backup-sync" },
  { label: "Help & Support", icon: "help-circle-outline", route: "/profile/help" },
  { label: "Settings", icon: "settings-outline", route: "/profile/settings" },
];

export default function ProfileScreen() {
  const { data: profile, isLoading } = useProfile();

  const xpPercent = profile ? profile.currentXP / profile.nextLevelXP : 0;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={Theme.colors.background} />

      <View style={styles.header}>
        <Pressable onPress={() => router.push("/profile/settings" as any)} style={styles.iconBtn}>
          <Ionicons name="settings-outline" size={20} color={Theme.colors.textPrimary} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {isLoading || !profile ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={Theme.colors.primary} />
          </View>
        ) : (
          <>
            <View style={styles.avatarSection}>
              <View style={styles.avatarCircle}>
                <Typography style={styles.avatarInitials}>{profile.avatarInitials}</Typography>
              </View>
              <Typography variant="h2" style={styles.name}>{profile.name}</Typography>
              <Typography variant="caption" color={Theme.colors.textSecondary}>
                Level {profile.level}
              </Typography>
              <Typography variant="caption" color={Theme.colors.textSecondary} style={{ marginTop: 2 }}>
                {profile.currentXP.toLocaleString()} XP to next level
              </Typography>
              <View style={styles.xpTrack}>
                <View style={[styles.xpFill, { width: `${xpPercent * 100}%` as any }]} />
              </View>
            </View>

            <View style={styles.menuCard}>
              {MENU_ITEMS.map((item, idx) => (
                <View key={item.label}>
                  <Pressable
                    style={({ pressed }) => [styles.menuRow, pressed && { backgroundColor: Theme.colors.background }]}
                    onPress={() => router.push(item.route as any)}
                  >
                    <View style={styles.menuIcon}>
                      <Ionicons name={item.icon} size={18} color={Theme.colors.textSecondary} />
                    </View>
                    <Typography variant="body" style={styles.menuLabel}>{item.label}</Typography>
                    {item.badge && (
                      <Typography variant="captionBold" color={Theme.colors.textSecondary} style={styles.menuBadge}>
                        {item.badge}
                      </Typography>
                    )}
                    <Ionicons name="chevron-forward" size={16} color={Theme.colors.border} />
                  </Pressable>
                  {idx < MENU_ITEMS.length - 1 && <View style={styles.separator} />}
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Theme.colors.background },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: Theme.spacing.lg,
    paddingTop: Theme.spacing.lg,
  },
  iconBtn: {
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
    paddingBottom: 96,
  },
  loader: { paddingTop: 80, alignItems: "center" },
  avatarSection: { alignItems: "center", paddingVertical: Theme.spacing.xl },
  avatarCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Theme.colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Theme.spacing.md,
    borderWidth: 3,
    borderColor: Theme.colors.primary,
  },
  avatarInitials: { fontSize: 30, fontWeight: "700", color: Theme.colors.primary },
  name: { marginBottom: 4 },
  xpTrack: {
    width: "60%",
    height: 6,
    backgroundColor: Theme.colors.border,
    borderRadius: 3,
    overflow: "hidden",
    marginTop: Theme.spacing.md,
  },
  xpFill: {
    height: "100%",
    backgroundColor: Theme.colors.primary,
    borderRadius: 3,
  },
  menuCard: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.radius.lg,
    overflow: "hidden",
    ...Theme.shadows.soft,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md + 2,
  },
  menuIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Theme.spacing.md,
  },
  menuLabel: { flex: 1 },
  menuBadge: { marginRight: Theme.spacing.sm },
  separator: {
    height: 1,
    backgroundColor: Theme.colors.border,
    marginLeft: 64,
  },
});
