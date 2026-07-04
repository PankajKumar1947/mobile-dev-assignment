import React from "react";
import { StyleSheet, View } from "react-native";
import { Theme } from "../theme/theme";

// ─── Line Chart ─────────────────────────────────────────────────────────────────
interface LineChartProps {
  data: number[]; // values 0-1 (normalised)
  width: number;
  height: number;
  color?: string;
}

export function MiniLineChart({ data, width, height, color = Theme.colors.primary }: LineChartProps) {
  if (data.length < 2) return null;

  const stepX = width / (data.length - 1);
  const pts = data.map((v, i) => ({
    x: i * stepX,
    y: height - v * height,
  }));

  // Build polyline points for SVG-style via View absolutely positioned segments
  const segments = pts.slice(0, -1).map((p, i) => {
    const next = pts[i + 1];
    const dx = next.x - p.x;
    const dy = next.y - p.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    return { x: p.x, y: p.y, len, angle };
  });

  return (
    <View style={{ width, height, overflow: "hidden" }}>
      {/* Fill gradient simulation using a trapezoid of views */}
      {pts.map((p, i) => {
        if (i === 0) return null;
        const prev = pts[i - 1];
        return (
          <View
            key={`fill-${i}`}
            style={{
              position: "absolute",
              left: prev.x,
              top: Math.min(prev.y, p.y),
              width: p.x - prev.x,
              height: height - Math.min(prev.y, p.y),
              backgroundColor: color,
              opacity: 0.08,
            }}
          />
        );
      })}

      {/* Line segments */}
      {segments.map((seg, i) => (
        <View
          key={`seg-${i}`}
          style={{
            position: "absolute",
            left: seg.x,
            top: seg.y - 1.5,
            width: seg.len,
            height: 3,
            backgroundColor: color,
            borderRadius: 2,
            transformOrigin: "left center",
            transform: [{ rotate: `${seg.angle}deg` }],
          }}
        />
      ))}

      {/* Data point dots */}
      {pts.map((p, i) => (
        <View
          key={`dot-${i}`}
          style={{
            position: "absolute",
            left: p.x - 4,
            top: p.y - 4,
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: Theme.colors.card,
            borderWidth: 2,
            borderColor: color,
          }}
        />
      ))}
    </View>
  );
}

// ─── Bar Chart ─────────────────────────────────────────────────────────────────
interface BarChartProps {
  data: number[]; // values 0-1 (normalised)
  width: number;
  height: number;
  color?: string;
  labels?: string[];
}

export function MiniBarChart({
  data,
  width,
  height,
  color = Theme.colors.primary,
  labels,
}: BarChartProps) {
  const barW = Math.floor((width / data.length) * 0.55);
  const gap = Math.floor((width - barW * data.length) / (data.length + 1));

  return (
    <View style={{ width, height }}>
      {data.map((v, i) => {
        const barH = Math.max(4, v * (height - 16));
        const x = gap + i * (barW + gap);
        const y = height - barH - (labels ? 14 : 0);
        return (
          <View
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: barW,
              height: barH,
              borderRadius: barW / 2,
              backgroundColor: color,
              opacity: v > 0.6 ? 1 : 0.45,
            }}
          />
        );
      })}
    </View>
  );
}

// ─── Habit Progress Bar ──────────────────────────────────────────────────────────
interface HabitProgressBarProps {
  current: number;
  target: number;
  color: string;
}

export function HabitProgressBar({ current, target, color }: HabitProgressBarProps) {
  const pct = Math.min(current / target, 1);
  return (
    <View style={progressStyles.track}>
      <View
        style={[
          progressStyles.fill,
          { width: `${pct * 100}%` as any, backgroundColor: color },
        ]}
      />
    </View>
  );
}

const progressStyles = StyleSheet.create({
  track: {
    flex: 1,
    height: 6,
    backgroundColor: Theme.colors.border,
    borderRadius: 3,
    overflow: "hidden",
    marginHorizontal: 10,
  },
  fill: {
    height: "100%",
    borderRadius: 3,
  },
});
