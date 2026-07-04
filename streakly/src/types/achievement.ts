export type AchievementStatus = "unlocked" | "in-progress" | "locked";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  status: AchievementStatus;
  current?: number;
  target?: number;
  unlockedAt?: string;
}
