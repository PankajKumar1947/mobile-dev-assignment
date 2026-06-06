import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Clock, Navigation, Activity, Brain, Award, Flame } from "lucide-react-native";
import { getSessions, DriveSession } from "../services/storage";
import { EVENT_METADATA } from "../utils/event-detector";
import { EventCard } from "../components/event-card";
import { Theme, getScoreColor } from "../constants/theme";
import { getAiFeedback, formatDuration } from "../utils/driving-helpers";

export default function HistoryDetailsScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [session, setSession] = useState<DriveSession | null>(null);

  useEffect(() => {
    async function loadSession() {
      if (!params.id) return;
      const allSessions = await getSessions();
      const found = allSessions.find((s) => s.id === params.id);
      if (found) {
        setSession(found);
      }
    }
    loadSession();
  }, [params.id]);

  if (!session) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const scoreColor = getScoreColor(session.score);
  const timeDisplay = formatDuration(session.duration);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.push("/history")}>
          <ArrowLeft color={Theme.colors.text} size={22} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Drive details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.scoreCard}>
          <View style={[styles.scoreBadge, { borderColor: scoreColor }]}>
            <Text style={[styles.scoreValue, { color: scoreColor }]}>{session.score}</Text>
            <Text style={styles.scoreMax}>/100</Text>
          </View>
          <Text style={[styles.ratingLabel, { color: scoreColor }]}>{session.rating} drive</Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Clock color={Theme.colors.primary} size={20} />
            <Text style={styles.statValue}>{timeDisplay}</Text>
            <Text style={styles.statLabel}>Duration</Text>
          </View>
          <View style={styles.statBox}>
            <Navigation color={Theme.colors.success} size={20} />
            <Text style={styles.statValue}>{session.distance?.toFixed(2)} km</Text>
            <Text style={styles.statLabel}>Est. Distance</Text>
          </View>
          <View style={styles.statBox}>
            <Activity color={Theme.colors.warning} size={20} />
            <Text style={styles.statValue}>{session.events.length}</Text>
            <Text style={styles.statLabel}>Total Events</Text>
          </View>
        </View>

        <View style={styles.feedbackContainer}>
          <View style={styles.feedbackHeader}>
            <Brain color={Theme.colors.accent} size={18} />
            <Text style={styles.feedbackTitle}>AI driving insights</Text>
          </View>
          <Text style={styles.feedbackText}>{getAiFeedback(session.score, session.events)}</Text>
        </View>

        <View style={styles.eventsLogContainer}>
          <Text style={styles.sectionTitle}>Event logs</Text>
          {session.events.length === 0 ? (
            <View style={styles.emptyEvents}>
              <Award color={Theme.colors.success} size={36} />
              <Text style={styles.emptyText}>Excellent drive! No unsafe events detected.</Text>
            </View>
          ) : (
            session.events.map((e) => <EventCard key={e.id} event={e} />)
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: Theme.colors.textSecondary,
    fontSize: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 56,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Theme.colors.card,
  },
  headerTitle: {
    color: Theme.colors.text,
    fontSize: 18,
    fontWeight: "700",
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 120,
  },
  scoreCard: {
    alignItems: "center",
    marginBottom: 24,
  },
  scoreBadge: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    justifyContent: "center",
    backgroundColor: Theme.colors.card,
    alignItems: "center",
    marginBottom: 12,
  },
  scoreValue: {
    fontSize: 38,
    fontWeight: "900",
  },
  scoreMax: {
    color: Theme.colors.textSecondary,
    fontSize: 14,
    fontWeight: "600",
    marginTop: -2,
  },
  ratingLabel: {
    fontSize: 14,
    fontWeight: "800",
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  statBox: {
    flex: 1,
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.roundness.lg,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  statValue: {
    color: Theme.colors.text,
    fontSize: 16,
    fontWeight: "700",
    marginTop: 6,
    marginBottom: 2,
  },
  statLabel: {
    color: Theme.colors.textSecondary,
    fontSize: 11,
    fontWeight: "500",
  },
  feedbackContainer: {
    backgroundColor: Theme.colors.accentBg,
    borderWidth: 1,
    borderColor: Theme.colors.accentBorder,
    borderRadius: Theme.roundness.lg,
    padding: 16,
    marginBottom: 24,
  },
  feedbackHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  feedbackTitle: {
    color: "#C084FC",
    fontSize: 14,
    fontWeight: "700",
  },
  feedbackText: {
    color: Theme.colors.textLight,
    fontSize: 13,
    lineHeight: 20,
  },
  eventsLogContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: Theme.colors.textSecondary,
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: 12,
  },
  emptyEvents: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.roundness.lg,
    padding: 24,
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  emptyText: {
    color: Theme.colors.textSecondary,
    fontSize: 13,
    textAlign: "center",
  },
});
