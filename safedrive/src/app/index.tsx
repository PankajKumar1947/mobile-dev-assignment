import { Cpu, LogOut, Play, Square, Sun, Moon } from "lucide-react-native";
import React, { useState } from "react";
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { DriveSummary } from "../components/drive-summary";
import { EventCard } from "../components/event-card";
import { SensorChart } from "../components/sensor-chart";
import { ThemeType, getScoreColor } from "../constants/theme";
import { useUser } from "../context/user-context";
import { useTheme } from "../context/theme-context";
import { useDrivingTracker } from "../hooks/use-driving-tracker";
import { getSafetyRating } from "../utils/driving-helpers";
import { DriveSession } from "../services/storage";

export default function Index() {
  const { profile, logout } = useUser();
  const { theme, isDark, toggleTheme } = useTheme();
  const styles = getStyles(theme);

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
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <View style={styles.profileHeader}>
          <View>
            <Text style={styles.profileWelcome}>Hello, {profile?.name}</Text>
            <Text style={styles.profileVehicle}>{profile?.vehicleType} Driver</Text>
          </View>
          <TouchableOpacity style={styles.logoutBtn} onPress={logout} disabled={isActive}>
            <LogOut color={isActive ? theme.colors.textMuted : theme.colors.danger} size={16} />
            <Text style={[styles.logoutText, isActive && { color: theme.colors.textMuted }]}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statePanel}>
          <View style={styles.scoreGaugeContainer}>
            <View style={[styles.scoreGauge, { borderColor: getScoreColor(score, theme.colors) }]}>
              <Text style={[styles.scoreValue, { color: getScoreColor(score, theme.colors) }]}>{score}</Text>
              <Text style={styles.scoreLabel}>Score</Text>
            </View>
            <Text style={[styles.ratingText, { color: getScoreColor(score, theme.colors) }]}>
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
              <Text style={[styles.statBigValue, { color: events.length > 0 ? theme.colors.danger : theme.colors.text }]}>
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
              <Square color={theme.colors.danger} fill={theme.colors.danger} size={20} />
              <Text style={styles.buttonText}>End drive</Text>
            </View>
          ) : (
            <View style={styles.buttonInner}>
              <Play color={theme.colors.background} fill={theme.colors.background} size={20} />
              <Text style={[styles.buttonText, { color: theme.colors.background }]}>Start drive</Text>
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
              <Cpu color={theme.colors.primary} size={18} />
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

const getStyles = (theme: ThemeType) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 110,
  },
  statePanel: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.roundness.xl,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
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
    backgroundColor: theme.colors.background,
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 40,
    fontWeight: "900",
  },
  scoreLabel: {
    color: theme.colors.textMuted,
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
    backgroundColor: theme.colors.background,
    borderRadius: theme.roundness.md,
    paddingVertical: 12,
    alignItems: "center",
  },
  statSubTitle: {
    color: theme.colors.textMuted,
    fontSize: 10,
    fontWeight: "700",
    marginBottom: 4,
  },
  statBigValue: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "800",
  },
  actionButton: {
    height: 54,
    borderRadius: theme.roundness.lg,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonStart: {
    backgroundColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
  },
  buttonStop: {
    backgroundColor: theme.colors.card,
    borderWidth: 1.5,
    borderColor: theme.colors.danger,
    shadowColor: theme.colors.danger,
  },
  buttonInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  buttonText: {
    color: theme.colors.danger,
    fontSize: 15,
    fontWeight: "800",
  },
  simulatorCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.roundness.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
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
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
  toggleText: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: "600",
  },
  simButtonsGrid: {
    marginTop: 12,
  },
  simHelperText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    marginBottom: 12,
  },
  simButtonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  simBtn: {
    backgroundColor: theme.colors.border,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: theme.roundness.sm,
  },
  disabledSimBtn: {
    opacity: 0.35,
  },
  simBtnText: {
    color: theme.colors.textLight,
    fontSize: 12,
    fontWeight: "600",
  },
  eventsLogContainer: {
    marginTop: 8,
  },
  sectionHeader: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 8,
  },
  noEventsBox: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.roundness.md,
    paddingVertical: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  noEventsText: {
    color: theme.colors.textMuted,
    fontSize: 13,
  },
  profileHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    borderRadius: theme.roundness.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 16,
  },
  profileWelcome: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "800",
  },
  profileVehicle: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: "500",
    marginTop: 2,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  themeBtn: {
    backgroundColor: theme.colors.border,
    width: 36,
    height: 36,
    borderRadius: theme.roundness.sm,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: theme.colors.dangerBg,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: theme.roundness.sm,
    borderWidth: 1,
    borderColor: theme.colors.dangerBorder,
  },
  logoutText: {
    color: theme.colors.danger,
    fontSize: 12,
    fontWeight: "700",
  },
});
