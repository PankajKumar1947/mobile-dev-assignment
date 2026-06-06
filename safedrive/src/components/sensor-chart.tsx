import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Vector3D } from "../utils/sensor-math";
import { ThemeType } from "../constants/theme";
import { useTheme } from "../context/theme-context";

interface SensorChartProps {
  accel: Vector3D;
  gyro: Vector3D;
}

export function SensorChart({ accel, gyro }: SensorChartProps) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const gX = accel.x / 9.81;
  const gY = accel.y / 9.81;

  const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));
  
  const dotX = clamp(gX * 25, -45, 45);
  const dotY = clamp(-gY * 25, -45, 45);

  const accelMag = Math.sqrt(gX * gX + gY * gY);
  const gyroMag = Math.sqrt(gyro.x * gyro.x + gyro.y * gyro.y + gyro.z * gyro.z);

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        <View style={styles.gforceMapContainer}>
          <Text style={styles.mapTitle}>G-force balance</Text>
          <View style={styles.circleOuter}>
            <View style={[styles.circleLine, { width: 60, height: 60, borderRadius: 30 }]} />
            <View style={[styles.circleLine, { width: 30, height: 30, borderRadius: 15 }]} />
            <View style={styles.crosshairH} />
            <View style={styles.crosshairV} />
            <View style={[styles.gDot, { transform: [{ translateX: dotX }, { translateY: dotY }] }]} />
          </View>
          <View style={styles.labelContainer}>
            <Text style={styles.gText}>Lat: {gX.toFixed(2)}G</Text>
            <Text style={styles.gText}>Lon: {gY.toFixed(2)}G</Text>
          </View>
        </View>

        <View style={styles.metricsContainer}>
          <Text style={styles.mapTitle}>Live telemetry</Text>
          
          <View style={styles.metricRow}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>Acceleration</Text>
              <Text style={styles.metricValue}>{accelMag.toFixed(2)} G</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${Math.min(100, accelMag * 50)}%`, backgroundColor: accelMag > 0.4 ? theme.colors.danger : theme.colors.success }]} />
            </View>
          </View>

          <View style={styles.metricRow}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>Rotation Rate</Text>
              <Text style={styles.metricValue}>{gyroMag.toFixed(2)} rad/s</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${Math.min(100, gyroMag * 50)}%`, backgroundColor: gyroMag > 1.0 ? theme.colors.warning : theme.colors.primary }]} />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const getStyles = (theme: ThemeType) => StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.roundness.lg,
    padding: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  grid: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
  },
  gforceMapContainer: {
    alignItems: "center",
    flex: 1,
  },
  mapTitle: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 10,
  },
  circleOuter: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: "#475569",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    position: "relative",
  },
  circleLine: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderStyle: "dashed",
    position: "absolute",
  },
  crosshairH: {
    position: "absolute",
    width: 100,
    height: 1,
    backgroundColor: theme.colors.border,
  },
  crosshairV: {
    position: "absolute",
    height: 100,
    width: 1,
    backgroundColor: theme.colors.border,
  },
  gDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.danger,
    position: "absolute",
    shadowColor: theme.colors.danger,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
  labelContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  gText: {
    color: theme.colors.textLight,
    fontSize: 10,
    fontWeight: "600",
  },
  metricsContainer: {
    flex: 1,
    justifyContent: "center",
    gap: 12,
  },
  metricRow: {
    width: "100%",
  },
  metricHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  metricLabel: {
    color: theme.colors.textLight,
    fontSize: 12,
    fontWeight: "500",
  },
  metricValue: {
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: "700",
  },
  progressBarBg: {
    height: 6,
    backgroundColor: theme.colors.background,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 3,
  },
});
