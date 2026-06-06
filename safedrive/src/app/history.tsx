import { useIsFocused } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { BarChart2, Compass, Trash2 } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HistoryCard } from "../components/history-card";
import { getScoreColor, Theme } from "../constants/theme";
import { clearSessions, DriveSession, getSessions } from "../services/storage";

export default function HistoryScreen() {
  const isFocused = useIsFocused();
  const router = useRouter();
  const [sessions, setSessions] = useState<DriveSession[]>([]);

  useEffect(() => {
    if (isFocused) {
      loadSessions();
    }
  }, [isFocused]);

  const loadSessions = async () => {
    const data = await getSessions();
    setSessions(data);
  };

  const handleClearHistory = () => {
    Alert.alert(
      "Clear History",
      "Are you sure you want to delete all historical drive records? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await clearSessions();
            setSessions([]);
          },
        },
      ]
    );
  };

  const totalDrives = sessions.length;
  const avgScore = totalDrives > 0
    ? Math.round(sessions.reduce((acc, s) => acc + s.score, 0) / totalDrives)
    : 100;

  const totalDistance = sessions.reduce((acc, s) => acc + (s.distance || 0), 0);
  const totalEvents = sessions.reduce((acc, s) => acc + s.events.length, 0);
  const handlePressCard = (session: DriveSession) => {
    router.push(`/history-details?id=${session.id}`);
  };

  return (
    <View style={styles.safeArea}>
      <View style={styles.container}>
        <FlatList
          data={sessions}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            totalDrives > 0 ? (
              <>
                <View style={styles.analyticsCard}>
                  <View style={styles.analyticsHeader}>
                    <BarChart2 color={Theme.colors.primary} size={18} />
                    <Text style={styles.analyticsTitle}>Lifetime metrics</Text>
                  </View>
                  <View style={styles.analyticsGrid}>
                    <View style={styles.metricItem}>
                      <Text style={styles.metricVal}>{totalDrives}</Text>
                      <Text style={styles.metricLbl}>Drives</Text>
                    </View>
                    <View style={styles.metricItem}>
                      <Text style={[styles.metricVal, { color: getScoreColor(avgScore) }]}>{avgScore}</Text>
                      <Text style={styles.metricLbl}>Avg Score</Text>
                    </View>
                    <View style={styles.metricItem}>
                      <Text style={styles.metricVal}>{totalDistance.toFixed(1)} km</Text>
                      <Text style={styles.metricLbl}>Distance</Text>
                    </View>
                    <View style={styles.metricItem}>
                      <Text style={styles.metricVal}>{totalEvents}</Text>
                      <Text style={styles.metricLbl}>Events</Text>
                    </View>
                  </View>
                </View>

                <TouchableOpacity style={styles.clearBtn} onPress={handleClearHistory}>
                  <Trash2 color={Theme.colors.danger} size={16} />
                  <Text style={styles.clearBtnText}>Clear Drive History</Text>
                </TouchableOpacity>
              </>
            ) : null
          }
          renderItem={({ item }) => (
            <HistoryCard session={item} onPress={() => handlePressCard(item)} />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Compass color={Theme.colors.textMuted} size={48} />
              <Text style={styles.emptyTitle}>No driving sessions yet</Text>
              <Text style={styles.emptySubtitle}>
                Go to the Tracker tab and complete a driving session to see your stats here.
              </Text>
            </View>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  analyticsCard: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.roundness.xl,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    padding: 16,
    marginBottom: 16,
  },
  analyticsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  analyticsTitle: {
    color: Theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: "700",
  },
  analyticsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metricItem: {
    alignItems: "center",
    flex: 1,
  },
  metricVal: {
    color: Theme.colors.text,
    fontSize: 18,
    fontWeight: "800",
  },
  metricLbl: {
    color: Theme.colors.textSecondary,
    fontSize: 11,
    fontWeight: "500",
    marginTop: 2,
  },
  clearBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Theme.colors.dangerBg,
    borderWidth: 1,
    borderColor: Theme.colors.dangerBorder,
    height: 40,
    borderRadius: Theme.roundness.md,
    marginBottom: 16,
  },
  clearBtnText: {
    color: Theme.colors.danger,
    fontSize: 13,
    fontWeight: "600",
  },
  listContent: {
    paddingBottom: 110,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
    gap: 12,
  },
  emptyTitle: {
    color: Theme.colors.textLight,
    fontSize: 16,
    fontWeight: "700",
  },
  emptySubtitle: {
    color: Theme.colors.textMuted,
    fontSize: 13,
    textAlign: "center",
    paddingHorizontal: 32,
    lineHeight: 18,
  },
});
