import AsyncStorage from "@react-native-async-storage/async-storage";
import { DetectedEvent } from "../utils/event-detector";

export interface UserProfile {
  name: string;
  vehicleType: string;
}

export interface DriveSession {
  id: string;
  startTime: number;
  endTime: number;
  duration: number;
  score: number;
  rating: string;
  events: DetectedEvent[];
  pointsDeducted: number;
  distance?: number;
}

const STORAGE_KEY = "@safedrive:sessions";
const PROFILE_KEY = "@safedrive:profile";

export async function saveSession(session: DriveSession): Promise<void> {
  try {
    const existing = await getSessions();
    const updated = [session, ...existing];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error(error);
  }
}

export async function getSessions(): Promise<DriveSession[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function clearSessions(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error(error);
  }
}

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  try {
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.error(error);
  }
}

export async function getUserProfile(): Promise<UserProfile | null> {
  try {
    const data = await AsyncStorage.getItem(PROFILE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function deleteUserProfile(): Promise<void> {
  try {
    await AsyncStorage.removeItem(PROFILE_KEY);
  } catch (error) {
    console.error(error);
  }
}

const THEME_KEY = "@safedrive:theme";

export async function saveThemeMode(mode: "light" | "dark"): Promise<void> {
  try {
    await AsyncStorage.setItem(THEME_KEY, mode);
  } catch (error) {
    console.error(error);
  }
}

export async function getThemeMode(): Promise<"light" | "dark"> {
  try {
    const mode = await AsyncStorage.getItem(THEME_KEY);
    return (mode === "light" || mode === "dark") ? mode : "dark";
  } catch (error) {
    console.error(error);
    return "dark";
  }
}

