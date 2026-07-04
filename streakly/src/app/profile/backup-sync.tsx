import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Pressable, ScrollView, StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Typography } from "../../components/typography";
import { Theme } from "../../theme/theme";

export default function BackupSyncScreen() {
  const [lastSync] = useState("Sep 9, 2023 at 10:32 AM");
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      Alert.alert("Sync Complete", "Your data is up to date.");
    }, 1500);
  };

  const ITEMS = [
    { label: "Export Data", icon: "download-outline" as const, onPress: () => Alert.alert("Export", "Data exported as JSON.") },
    { label: "Import Data", icon: "cloud-upload-outline" as const, onPress: () => Alert.alert("Import", "Select a backup file to import.") },
    { label: "Delete All Data", icon: "trash-outline" as const, danger: true, onPress: () => Alert.alert("Delete All", "This will permanently erase all your habits and history.", [{ text: "Cancel", style: "cancel" }, { text: "Delete", style: "destructive" }]) },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={Theme.colors.background} />

      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Theme.colors.textPrimary} />
        </Pressable>
        <Typography variant="h2">Backup & Sync</Typography>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.syncCard}>
          <View style={styles.syncIcon}>
            <Ionicons name="cloud-done-outline" size={32} color={Theme.colors.primary} />
          </View>
          <Typography variant="bodyBold" style={{ marginBottom: 4 }}>Synced</Typography>
          <Typography variant="caption" color={Theme.colors.textSecondary}>
            Last synced: {lastSync}
          </Typography>
          <Pressable
            onPress={handleSync}
            style={[styles.syncBtn, isSyncing && { opacity: 0.6 }]}
          >
            <Typography variant="captionBold" color={Theme.colors.card}>
              {isSyncing ? "Syncing..." : "Sync Now"}
            </Typography>
          </Pressable>
        </View>

        <View style={styles.listCard}>
          {ITEMS.map((item, idx) => (
            <View key={item.label}>
              <Pressable
                style={({ pressed }) => [styles.row, pressed && { backgroundColor: Theme.colors.background }]}
                onPress={item.onPress}
              >
                <View style={styles.rowIcon}>
                  <Ionicons
                    name={item.icon}
                    size={18}
                    color={item.danger ? "#DC2626" : Theme.colors.textSecondary}
                  />
                </View>
                <Typography
                  variant="body"
                  style={{ flex: 1, color: item.danger ? "#DC2626" : Theme.colors.textPrimary }}
                >
                  {item.label}
                </Typography>
                <Ionicons name="chevron-forward" size={16} color={Theme.colors.border} />
              </Pressable>
              {idx < ITEMS.length - 1 && <View style={styles.separator} />}
            </View>
          ))}
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
  syncCard: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.xl,
    alignItems: "center",
    marginBottom: Theme.spacing.lg,
    ...Theme.shadows.soft,
  },
  syncIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Theme.colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Theme.spacing.md,
  },
  syncBtn: {
    marginTop: Theme.spacing.lg,
    backgroundColor: Theme.colors.primary,
    paddingHorizontal: Theme.spacing.xl,
    paddingVertical: Theme.spacing.sm + 2,
    borderRadius: Theme.radius.pill,
  },
  listCard: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.radius.lg,
    overflow: "hidden",
    ...Theme.shadows.soft,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Theme.spacing.md,
  },
  separator: { height: 1, backgroundColor: Theme.colors.border, marginLeft: 64 },
});
