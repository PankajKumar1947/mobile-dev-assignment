import { useState, useEffect } from "react";
import { Habit } from "../../types";

const DUMMY_HABITS: Habit[] = [
  {
    id: "1",
    name: "Drink Water",
    category: "water",
    icon: "water",
    frequency: "8 glasses a day",
    current: 7,
    target: 8,
    unit: "Today",
    status: "active",
    time: undefined,
  },
  {
    id: "2",
    name: "Code 1 Hour",
    category: "code",
    icon: "code-slash",
    frequency: "Daily",
    current: 45,
    target: 60,
    unit: "min",
    status: "active",
    time: "06:00 PM",
  },
  {
    id: "3",
    name: "Read",
    category: "read",
    icon: "book",
    frequency: "20 pages a day",
    current: 12,
    target: 20,
    unit: "pages",
    status: "active",
    time: undefined,
  },
  {
    id: "4",
    name: "Workout",
    category: "workout",
    icon: "barbell",
    frequency: "3 times a week",
    current: 2,
    target: 3,
    unit: "This week",
    status: "active",
    time: undefined,
  },
  {
    id: "5",
    name: "Meditate",
    category: "meditate",
    icon: "leaf",
    frequency: "5 minutes a day",
    current: 3,
    target: 5,
    unit: "Today",
    status: "active",
    time: undefined,
  },
  {
    id: "6",
    name: "No Sugar",
    category: "noSugar",
    icon: "nutrition",
    frequency: "5 days a week",
    current: 4,
    target: 5,
    unit: "This week",
    status: "active",
    time: undefined,
  },
];

export interface UseHabitsResult {
  data: Habit[] | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useHabits(): UseHabitsResult {
  const [data, setData] = useState<Habit[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchHabits = () => {
    setIsLoading(true);
    setError(null);

    const timer = setTimeout(() => {
      try {
        setData(DUMMY_HABITS);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch habits"));
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  return {
    data,
    isLoading,
    error,
    refetch: fetchHabits,
  };
}
