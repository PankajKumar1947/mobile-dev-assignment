import { useState, useEffect } from "react";
import { Profile } from "../../types";

const DUMMY_PROFILE: Profile = {
  id: "user-1",
  name: "Alex Johnson",
  avatarInitials: "AJ",
  level: 8,
  currentXP: 1420,
  nextLevelXP: 2000,
};

export interface UseProfileResult {
  data: Profile | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useProfile(): UseProfileResult {
  const [data, setData] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProfile = () => {
    setIsLoading(true);
    setError(null);
    const timer = setTimeout(() => {
      try {
        setData(DUMMY_PROFILE);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch profile"));
        setIsLoading(false);
      }
    }, 200);
    return () => clearTimeout(timer);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return { data, isLoading, error, refetch: fetchProfile };
}
