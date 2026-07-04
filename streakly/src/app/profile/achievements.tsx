import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Typography } from "../../components/typography";
import { useAchievements } from "../../hooks/query/use-achievements";
import { Theme } from "../../theme/theme";
import { Achievement } from "../../types";

function AchievementRow({ item }: { item: Achievement }) {
  const isUnlocked = item.status === "unlocked";
  const isInProgress = item.status === "in-progress";

  return (
    <View style={styles.achievementRow}>
      <View style={[styles.emojiCircle, !isUnlocked && styles.emojiCircleLocked]}>
        <Typography style={styles.emoji}>{item.emoji}</Typography>
      </View>
      <View style={styles.achievementInfo}>
        <Typography variant="bodyBold">{item.title}</Typography>
        <Typography variant="caption" color={Theme.colors.textSecondary}>
          {item.description}
        </Typography>
        {isInProgress && item.current !== undefined && item.target !== undefined && (
          <View style={styles.progressRow}>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${(item.current / item.target) * 100}%` as any },
                ]}
              />
            </View>
            <Typography variant="captionBold" color={Theme.colors.textSecondary} style={styles.progressLabel}>
              {item.current}/{item.target}
            </Typography>
          </View>
        )}
      </View>
      {isUnlocked ? (
        <View style={styles.unlockedBadge}>
          <Typography variant="captionBold" style={styles.unlockedText}>Unlocked</Typography>
        </View>
      ) : isInProgress ? null : (
        <Ionicons name="lock-closed" size={16} color={Theme.colors.border} />
      )}
    </View>
  );
}

export default function AchievementsScreen() {
  const { data, totalUnlocked, isLoading } = useAchievements();

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={Theme.colors.background} />

      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Theme.colors.textPrimary} />
        </Pressable>
        <Typography variant="h2">Achievements</Typography>
        <View style={{ width: 40 }} />
      </View>

      {isLoading || !data ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={Theme.colors.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryIconCircle}>
              <Typography style={styles.summaryCount}>{totalUnlocked}</Typography>
            </View>
            <View style={{ flex: 1 }}>
              <Typography variant="bodyBold">{totalUnlocked} Achievements</Typography>
              <Typography variant="caption" color={Theme.colors.textSecondary}>Unlocked</Typography>
            </View>
            <Pressable>
              <Typography variant="captionBold" color={Theme.colors.primary}>View All</Typography>
            </Pressable>
          </View>

          <Typography variant="bodyBold" style={styles.sectionLabel}>Recent</Typography>

          <View style={styles.listCard}>
            {data.map((item, idx) => (
              <View key={item.id}>
                <AchievementRow item={item} />
                {idx < data.length - 1 && <View style={styles.separator} />}
              </View>
            ))}
          </View>
        </ScrollView>
      )}
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
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  scrollContent: {
    paddingHorizontal: Theme.spacing.lg,
    paddingBottom: Theme.spacing.xxxl,
  },
  summaryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.xl,
    ...Theme.shadows.soft,
  },
  summaryIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Theme.colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Theme.spacing.md,
  },
  summaryCount: {
    fontSize: 22,
    fontWeight: "700",
    color: Theme.colors.primary,
  },
  sectionLabel: { marginBottom: Theme.spacing.md },
  listCard: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.radius.lg,
    overflow: "hidden",
    ...Theme.shadows.soft,
  },
  achievementRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
  },
  emojiCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFF8E7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: Theme.spacing.md,
  },
  emojiCircleLocked: { backgroundColor: Theme.colors.background },
  emoji: { fontSize: 22 },
  achievementInfo: { flex: 1 },
  progressRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  progressTrack: {
    flex: 1,
    height: 5,
    backgroundColor: Theme.colors.border,
    borderRadius: 3,
    overflow: "hidden",
    marginRight: Theme.spacing.sm,
  },
  progressFill: {
    height: "100%",
    backgroundColor: Theme.colors.primary,
    borderRadius: 3,
  },
  progressLabel: { minWidth: 32, textAlign: "right" },
  unlockedBadge: {
    backgroundColor: Theme.colors.primaryLight,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 3,
    borderRadius: Theme.radius.pill,
  },
  unlockedText: { color: Theme.colors.primary, fontSize: 11 },
  separator: {
    height: 1,
    backgroundColor: Theme.colors.border,
    marginLeft: 76,
  },
});
