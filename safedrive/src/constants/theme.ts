export const Theme = {
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

export function getScoreColor(score: number): string {
  if (score >= 90) return Theme.colors.success;
  if (score >= 75) return Theme.colors.primary;
  if (score >= 60) return Theme.colors.warning;
  return Theme.colors.danger;
}
