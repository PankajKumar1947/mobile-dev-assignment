import { Ionicons } from "@expo/vector-icons";

export type HabitCategory = "water" | "code" | "read" | "workout" | "meditate" | "noSugar";
export type HabitStatus = "active" | "completed" | "archived";

export interface Habit {
  id: string;
  name: string;
  category: HabitCategory;
  icon: keyof typeof Ionicons.glyphMap;
  frequency: string;
  current: number;
  target: number;
  unit: string;
  status: HabitStatus;
  time?: string;
  completedAt?: string;
}
