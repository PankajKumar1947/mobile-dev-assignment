import { useState, useEffect } from "react";
import { Theme } from "../../theme/theme";

export type InsightsPeriod = "This Week" | "Last Week" | "This Month";

export interface InsightHabit {
  name: string;
  icon: string;
  category: keyof typeof Theme.colors.categories;
  current: number;
  target: number;
}

export interface InsightsData {
  completionRate: number;
  completionDelta: string;
  completionTrend: number[];
  totalCompletions: number;
  completionsDelta: string;
  completionsBars: number[];
  currentStreak: number;
  bestStreak: number;
  habits: InsightHabit[];
}

const DUMMY_INSIGHTS: Record<InsightsPeriod, InsightsData> = {
  "This Week": {
    completionRate: 78,
    completionDelta: "+12% vs last week",
    completionTrend: [0.55, 0.7, 0.85, 0.65, 0.9, 0.78, 0.78],
    totalCompletions: 24,
    completionsDelta: "+6 vs last week",
    completionsBars: [0.45, 0.65, 0.85, 0.55, 0.9, 0.75, 0.7],
    currentStreak: 12,
    bestStreak: 18,
    habits: [
      { name: "Drink Water", icon: "water", category: "water", current: 7, target: 7 },
      { name: "Code 1 Hour", icon: "code-slash", category: "code", current: 5, target: 7 },
      { name: "Read", icon: "book", category: "read", current: 4, target: 7 },
      { name: "Workout", icon: "barbell", category: "workout", current: 3, target: 7 },
    ],
  },
  "Last Week": {
    completionRate: 66,
    completionDelta: "-4% vs prior week",
    completionTrend: [0.7, 0.55, 0.6, 0.45, 0.8, 0.6, 0.7],
    totalCompletions: 18,
    completionsDelta: "-3 vs prior week",
    completionsBars: [0.6, 0.45, 0.55, 0.4, 0.75, 0.55, 0.65],
    currentStreak: 6,
    bestStreak: 18,
    habits: [
      { name: "Drink Water", icon: "water", category: "water", current: 6, target: 7 },
      { name: "Code 1 Hour", icon: "code-slash", category: "code", current: 4, target: 7 },
      { name: "Read", icon: "book", category: "read", current: 3, target: 7 },
      { name: "Workout", icon: "barbell", category: "workout", current: 2, target: 7 },
    ],
  },
  "This Month": {
    completionRate: 74,
    completionDelta: "+8% vs last month",
    completionTrend: [0.6, 0.65, 0.7, 0.72, 0.68, 0.75, 0.74],
    totalCompletions: 96,
    completionsDelta: "+18 vs last month",
    completionsBars: [0.55, 0.6, 0.65, 0.72, 0.7, 0.8, 0.75],
    currentStreak: 12,
    bestStreak: 18,
    habits: [
      { name: "Drink Water", icon: "water", category: "water", current: 28, target: 30 },
      { name: "Code 1 Hour", icon: "code-slash", category: "code", current: 22, target: 30 },
      { name: "Read", icon: "book", category: "read", current: 18, target: 30 },
      { name: "Workout", icon: "barbell", category: "workout", current: 12, target: 15 },
    ],
  },
};

export interface UseInsightsResult {
  data: InsightsData | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useInsights(period: InsightsPeriod): UseInsightsResult {
  const [data, setData] = useState<InsightsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchInsights = () => {
    setIsLoading(true);
    setError(null);
    const timer = setTimeout(() => {
      try {
        setData(DUMMY_INSIGHTS[period]);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch insights"));
        setIsLoading(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  };

  useEffect(() => {
    fetchInsights();
  }, [period]);

  return { data, isLoading, error, refetch: fetchInsights };
}
