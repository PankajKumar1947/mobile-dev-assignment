import { useState, useEffect } from "react";
import { Achievement } from "../../types";

const DUMMY_ACHIEVEMENTS: Achievement[] = [
  {
    id: "a1",
    title: "12 Days Streak",
    description: "Keep going strong!",
    emoji: "🔥",
    status: "unlocked",
    unlockedAt: "2023-09-01",
  },
  {
    id: "a2",
    title: "Early Bird",
    description: "Complete a habit before 9 AM",
    emoji: "🌅",
    status: "unlocked",
    unlockedAt: "2023-08-28",
  },
  {
    id: "a3",
    title: "Hydration Hero",
    description: "Drink water 50 times",
    emoji: "💧",
    status: "in-progress",
    current: 46,
    target: 50,
  },
  {
    id: "a4",
    title: "Consistency Master",
    description: "Complete 7 days in a row",
    emoji: "✅",
    status: "in-progress",
    current: 5,
    target: 7,
  },
  {
    id: "a5",
    title: "Book Worm",
    description: "Read for 30 consecutive days",
    emoji: "📚",
    status: "locked",
    current: 12,
    target: 30,
  },
  {
    id: "a6",
    title: "Iron Will",
    description: "Complete all habits for an entire week",
    emoji: "💪",
    status: "locked",
    current: 0,
    target: 7,
  },
];

export interface UseAchievementsResult {
  data: Achievement[] | null;
  totalUnlocked: number;
  totalCount: number;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useAchievements(): UseAchievementsResult {
  const [data, setData] = useState<Achievement[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAchievements = () => {
    setIsLoading(true);
    setError(null);
    const timer = setTimeout(() => {
      try {
        setData(DUMMY_ACHIEVEMENTS);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch achievements"));
        setIsLoading(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const totalUnlocked = data?.filter((a) => a.status === "unlocked").length ?? 0;
  const totalCount = data?.length ?? 0;

  return { data, totalUnlocked, totalCount, isLoading, error, refetch: fetchAchievements };
}
