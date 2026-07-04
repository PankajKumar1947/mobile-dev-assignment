import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Typography } from "../../components/typography";
import { Theme } from "../../theme/theme";

type SettingItem =
  | { label: string; icon: keyof typeof Ionicons.glyphMap; value: string; type: "chevron" }
  | { label: string; icon: keyof typeof Ionicons.glyphMap; type: "arrow" };

const SETTING_GROUPS: { title?: string; items: SettingItem[] }[] = [
  {
    items: [
      { label: "Appearance", icon: "color-palette-outline", value: "Light", type: "chevron" },
      { label: "Language", icon: "language-outline", value: "English", type: "chevron" },
      { label: "Units", icon: "scale-outline", value: "Metric", type: "chevron" },
    ],
  },
  {
    items: [
      { label: "Data & Storage", icon: "folder-outline", type: "arrow" },
      { label: "Security", icon: "shield-outline", type: "arrow" },
    ],
  },
  {
    items: [
      { label: "Privacy Policy", icon: "document-text-outline", type: "arrow" },
      { label: "Terms of Service", icon: "reader-outline", type: "arrow" },
      { label: "Rate the App", icon: "star-outline", type: "arrow" },
    ],
  },
];

export default function SettingsScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={Theme.colors.background} />

      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Theme.colors.textPrimary} />
        </Pressable>
        <Typography variant="h2">Settings</Typography>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {SETTING_GROUPS.map((group, gIdx) => (
          <View key={gIdx} style={[styles.settingsCard, gIdx < SETTING_GROUPS.length - 1 && { marginBottom: Theme.spacing.md }]}>
            {group.items.map((item, idx) => (
              <View key={item.label}>
                <Pressable
                  style={({ pressed }) => [styles.settingRow, pressed && { backgroundColor: Theme.colors.background }]}
                  onPress={() => {}}
                >
                  <View style={styles.settingIcon}>
                    <Ionicons name={item.icon} size={18} color={Theme.colors.textSecondary} />
                  </View>
                  <Typography variant="body" style={{ flex: 1 }}>{item.label}</Typography>
                  {item.type === "chevron" && "value" in item && (
                    <Typography variant="caption" color={Theme.colors.textSecondary} style={{ marginRight: 4 }}>
                      {item.value}
                    </Typography>
                  )}
                  <Ionicons name="chevron-forward" size={16} color={Theme.colors.border} />
                </Pressable>
                {idx < group.items.length - 1 && <View style={styles.separator} />}
              </View>
            ))}
          </View>
        ))}

        <Pressable
          style={styles.logoutBtn}
          onPress={() => Alert.alert("Log Out", "Are you sure you want to log out?", [
            { text: "Cancel", style: "cancel" },
            { text: "Log Out", style: "destructive" },
          ])}
        >
          <Ionicons name="log-out-outline" size={18} color="#DC2626" />
          <Typography variant="bodyBold" style={styles.logoutText}>Log Out</Typography>
        </Pressable>

        <Typography variant="caption" color={Theme.colors.textSecondary} style={styles.version}>
          Version 1.2.0
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
  settingsCard: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.radius.lg,
    overflow: "hidden",
    marginBottom: Theme.spacing.md,
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
  separator: { height: 1, backgroundColor: Theme.colors.border, marginLeft: 64 },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Theme.spacing.sm,
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.radius.lg,
    paddingVertical: Theme.spacing.lg,
    marginTop: Theme.spacing.md,
    ...Theme.shadows.soft,
  },
  logoutText: { color: "#DC2626" },
  version: { textAlign: "center", marginTop: Theme.spacing.xl },
});
