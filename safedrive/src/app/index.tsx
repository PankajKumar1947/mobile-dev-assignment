import { Cpu, LogOut, Play, Square } from "lucide-react-native";
import React, { useState } from "react";
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DriveSummary } from "../components/drive-summary";
import { EventCard } from "../components/event-card";
import { SensorChart } from "../components/sensor-chart";
import { Theme, getScoreColor } from "../constants/theme";
import { useUser } from "../context/user-context";
import { useDrivingTracker } from "../hooks/use-driving-tracker";
import { getSafetyRating } from "../utils/driving-helpers";
import { DriveSession } from "../services/storage";

export default function Index() {
  const { profile, logout } = useUser();
  const {
    isActive,
    duration,
    score,
    events,
    accelData,
    gyroData,
    startDrive,
    endDrive,
    triggerMockEvent,
  } = useDrivingTracker();

  const [currentSummary, setCurrentSummary] = useState<DriveSession | null>(null);
  const [summaryVisible, setSummaryVisible] = useState(false);
  const [showSimulator, setShowSimulator] = useState(true);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remainingSecs.toString().padStart(2, "0")}`;
  };

  const handleToggleDrive = async () => {
    if (isActive) {
      const summary = await endDrive();
      if (summary) {
        setCurrentSummary(summary);
        setSummaryVisible(true);
      }
    } else {
      startDrive();
    }
  };

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <View style={styles.profileHeader}>
          <View>
            <Text style={styles.profileWelcome}>Hello, {profile?.name}</Text>
            <Text style={styles.profileVehicle}>{profile?.vehicleType} Driver</Text>
          </View>
          <TouchableOpacity style={styles.logoutBtn} onPress={logout} disabled={isActive}>
            <LogOut color={isActive ? Theme.colors.textMuted : Theme.colors.danger} size={16} />
            <Text style={[styles.logoutText, isActive && { color: Theme.colors.textMuted }]}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statePanel}>
          <View style={styles.scoreGaugeContainer}>
            <View style={[styles.scoreGauge, { borderColor: getScoreColor(score) }]}>
              <Text style={[styles.scoreValue, { color: getScoreColor(score) }]}>{score}</Text>
              <Text style={styles.scoreLabel}>Score</Text>
            </View>
            <Text style={[styles.ratingText, { color: getScoreColor(score) }]}>
              {getSafetyRating(score)} rating
            </Text>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statSubTitle}>Duration</Text>
              <Text style={styles.statBigValue}>{formatTime(duration)}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statSubTitle}>Events detected</Text>
              <Text style={[styles.statBigValue, { color: events.length > 0 ? Theme.colors.danger : Theme.colors.text }]}>
                {events.length}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.actionButton, isActive ? styles.buttonStop : styles.buttonStart]}
          onPress={handleToggleDrive}
        >
          {isActive ? (
            <View style={styles.buttonInner}>
              <Square color={Theme.colors.danger} fill={Theme.colors.danger} size={20} />
              <Text style={styles.buttonText}>End drive</Text>
            </View>
          ) : (
            <View style={styles.buttonInner}>
              <Play color={Theme.colors.background} fill={Theme.colors.background} size={20} />
              <Text style={[styles.buttonText, { color: Theme.colors.background }]}>Start drive</Text>
            </View>
          )}
        </TouchableOpacity>

        <SensorChart accel={accelData} gyro={gyroData} />

        <View style={styles.simulatorCard}>
          <TouchableOpacity
            style={styles.simulatorHeader}
            onPress={() => setShowSimulator(!showSimulator)}
          >
            <View style={styles.simTitleCol}>
              <Cpu color={Theme.colors.primary} size={18} />
              <Text style={styles.simulatorTitle}>Telemetry Simulator</Text>
            </View>
            <Text style={styles.toggleText}>{showSimulator ? "Hide" : "Show"}</Text>
          </TouchableOpacity>

          {showSimulator && (
            <View style={styles.simButtonsGrid}>
              <Text style={styles.simHelperText}>
                {isActive ? "Tap to inject simulated driving hazards:" : "Start drive to enable sensor simulations"}
              </Text>
              <View style={styles.simButtonsContainer}>
                <TouchableOpacity
                  disabled={!isActive}
                  style={[styles.simBtn, !isActive && styles.disabledSimBtn]}
                  onPress={() => triggerMockEvent("HARSH_BRAKING")}
                >
                  <Text style={styles.simBtnText}>Harsh Brake</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={!isActive}
                  style={[styles.simBtn, !isActive && styles.disabledSimBtn]}
                  onPress={() => triggerMockEvent("HARSH_ACCELERATION")}
                >
                  <Text style={styles.simBtnText}>Harsh Accel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={!isActive}
                  style={[styles.simBtn, !isActive && styles.disabledSimBtn]}
                  onPress={() => triggerMockEvent("SHARP_TURN")}
                >
                  <Text style={styles.simBtnText}>Sharp Turn</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={!isActive}
                  style={[styles.simBtn, !isActive && styles.disabledSimBtn]}
                  onPress={() => triggerMockEvent("PHONE_HANDLING")}
                >
                  <Text style={styles.simBtnText}>Phone Use</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={!isActive}
                  style={[styles.simBtn, !isActive && styles.disabledSimBtn]}
                  onPress={() => triggerMockEvent("AGGRESSIVE_STEERING")}
                >
                  <Text style={styles.simBtnText}>Aggressive Steer</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={!isActive}
                  style={[styles.simBtn, !isActive && styles.disabledSimBtn]}
                  onPress={() => triggerMockEvent("EXCESSIVE_MOVEMENT")}
                >
                  <Text style={styles.simBtnText}>Excessive Shake</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        <View style={styles.eventsLogContainer}>
          <Text style={styles.sectionHeader}>Session event log</Text>
          {events.length === 0 ? (
            <View style={styles.noEventsBox}>
              <Text style={styles.noEventsText}>No unsafe actions detected yet.</Text>
            </View>
          ) : (
            [...events].reverse().map((e) => <EventCard key={e.id} event={e} />)
          )}
        </View>

      </ScrollView>

      <DriveSummary
        session={currentSummary}
        visible={summaryVisible}
        onClose={() => setSummaryVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 110,
  },
  statePanel: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.roundness.xl,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Theme.colors.border,
    marginBottom: 16,
  },
  scoreGaugeContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  scoreGauge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Theme.colors.background,
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 40,
    fontWeight: "900",
  },
  scoreLabel: {
    color: Theme.colors.textMuted,
    fontSize: 10,
    fontWeight: "700",
  },
  ratingText: {
    fontSize: 13,
    fontWeight: "800",
  },
  statsContainer: {
    flexDirection: "row",
    gap: 16,
    width: "100%",
  },
  statBox: {
    flex: 1,
    backgroundColor: Theme.colors.background,
    borderRadius: Theme.roundness.md,
    paddingVertical: 12,
    alignItems: "center",
  },
  statSubTitle: {
    color: Theme.colors.textMuted,
    fontSize: 10,
    fontWeight: "700",
    marginBottom: 4,
  },
  statBigValue: {
    color: Theme.colors.text,
    fontSize: 18,
    fontWeight: "800",
  },
  actionButton: {
    height: 54,
    borderRadius: Theme.roundness.lg,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonStart: {
    backgroundColor: Theme.colors.primary,
    shadowColor: Theme.colors.primary,
  },
  buttonStop: {
    backgroundColor: Theme.colors.card,
    borderWidth: 1.5,
    borderColor: Theme.colors.danger,
    shadowColor: Theme.colors.danger,
  },
  buttonInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  buttonText: {
    color: Theme.colors.danger,
    fontSize: 15,
    fontWeight: "800",
  },
  simulatorCard: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.roundness.lg,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    padding: 16,
    marginBottom: 16,
  },
  simulatorHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  simTitleCol: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  simulatorTitle: {
    color: Theme.colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
  toggleText: {
    color: Theme.colors.primary,
    fontSize: 12,
    fontWeight: "600",
  },
  simButtonsGrid: {
    marginTop: 12,
  },
  simHelperText: {
    color: Theme.colors.textSecondary,
    fontSize: 12,
    marginBottom: 12,
  },
  simButtonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  simBtn: {
    backgroundColor: Theme.colors.border,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: Theme.roundness.sm,
  },
  disabledSimBtn: {
    opacity: 0.35,
  },
  simBtnText: {
    color: Theme.colors.textLight,
    fontSize: 12,
    fontWeight: "600",
  },
  eventsLogContainer: {
    marginTop: 8,
  },
  sectionHeader: {
    color: Theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 8,
  },
  noEventsBox: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.roundness.md,
    paddingVertical: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  noEventsText: {
    color: Theme.colors.textMuted,
    fontSize: 13,
  },
  profileHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.roundness.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    marginBottom: 16,
  },
  profileWelcome: {
    color: Theme.colors.text,
    fontSize: 16,
    fontWeight: "800",
  },
  profileVehicle: {
    color: Theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: "500",
    marginTop: 2,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Theme.colors.dangerBg,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: Theme.roundness.sm,
    borderWidth: 1,
    borderColor: Theme.colors.dangerBorder,
  },
  logoutText: {
    color: Theme.colors.danger,
    fontSize: 12,
    fontWeight: "700",
  },
});
