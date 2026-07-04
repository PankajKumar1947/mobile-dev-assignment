import { useState, useEffect } from "react";
import { Theme } from "../../theme/theme";
import { Category } from "../../types";

const DUMMY_CATEGORIES: Category[] = [
  {
    id: "cat-1",
    key: "water",
    name: "Hydration",
    icon: "water",
    description: "Keep track of water intake and stay hydrated",
    color: Theme.colors.categories.water.accent,
    bgColor: Theme.colors.categories.water.bg,
  },
  {
    id: "cat-2",
    key: "code",
    name: "Development",
    icon: "code-slash",
    description: "Write code, learn programming languages, and build projects",
    color: Theme.colors.categories.code.accent,
    bgColor: Theme.colors.categories.code.bg,
  },
  {
    id: "cat-3",
    key: "read",
    name: "Reading",
    icon: "book",
    description: "Read books, articles, or papers to expand knowledge",
    color: Theme.colors.categories.read.accent,
    bgColor: Theme.colors.categories.read.bg,
  },
  {
    id: "cat-4",
    key: "workout",
    name: "Fitness",
    icon: "barbell",
    description: "Exercises, runs, workouts, and physical activities",
    color: Theme.colors.categories.workout.accent,
    bgColor: Theme.colors.categories.workout.bg,
  },
  {
    id: "cat-5",
    key: "meditate",
    name: "Mindfulness",
    icon: "leaf",
    description: "Meditation, breathing, and mental health checkins",
    color: Theme.colors.categories.meditate.accent,
    bgColor: Theme.colors.categories.meditate.bg,
  },
  {
    id: "cat-6",
    key: "noSugar",
    name: "Diet",
    icon: "nutrition",
    description: "Monitor food consumption and sugar limitations",
    color: Theme.colors.categories.noSugar.accent,
    bgColor: Theme.colors.categories.noSugar.bg,
  },
];

export interface UseCategoriesResult {
  data: Category[] | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useCategories(): UseCategoriesResult {
  const [data, setData] = useState<Category[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCategories = () => {
    setIsLoading(true);
    setError(null);
    
    // Simulate API network call delay
    const timer = setTimeout(() => {
      try {
        setData(DUMMY_CATEGORIES);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch categories"));
        setIsLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    data,
    isLoading,
    error,
    refetch: fetchCategories,
  };
}
