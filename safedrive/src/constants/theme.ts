export const DarkTheme = {
  colors: {
    background: "#0A0E1A",
    card: "#121A2E",
    border: "#1E2B4B",
    text: "#F8FAFC",
    textSecondary: "#94A3B8",
    textMuted: "#64748B",
    textLight: "#CBD5E1",
    primary: "#06B6D4",
    success: "#10F3A5",
    warning: "#F59E0B",
    danger: "#F43F5E",
    accent: "#D946EF",
    accentBg: "rgba(217, 70, 239, 0.08)",
    accentBorder: "rgba(217, 70, 239, 0.2)",
    dangerBg: "rgba(244, 63, 94, 0.08)",
    dangerBorder: "rgba(244, 63, 94, 0.2)",
    successBg: "rgba(16, 243, 165, 0.08)",
    primaryBg: "rgba(6, 182, 212, 0.08)",
  },
  roundness: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    round: 9999,
  },
};

export const LightTheme = {
  colors: {
    background: "#F8FAFC",
    card: "#FFFFFF",
    border: "#E2E8F0",
    text: "#0F172A",
    textSecondary: "#475569",
    textMuted: "#94A3B8",
    textLight: "#334155",
    primary: "#0EA5E9",
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
    accent: "#D946EF",
    accentBg: "rgba(217, 70, 239, 0.05)",
    accentBorder: "rgba(217, 70, 239, 0.15)",
    dangerBg: "rgba(239, 68, 68, 0.05)",
    dangerBorder: "rgba(239, 68, 68, 0.15)",
    successBg: "rgba(16, 185, 129, 0.05)",
    primaryBg: "rgba(14, 165, 233, 0.05)",
  },
  roundness: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    round: 9999,
  },
};

export type ThemeType = typeof DarkTheme;

// Maintain backwards compatibility for static imports during refactoring
export const Theme = DarkTheme;

export function getScoreColor(score: number, colors: typeof DarkTheme.colors = Theme.colors): string {
  if (score >= 90) return colors.success;
  if (score >= 75) return colors.primary;
  if (score >= 60) return colors.warning;
  return colors.danger;
}
