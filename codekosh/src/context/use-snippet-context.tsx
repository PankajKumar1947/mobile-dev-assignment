import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Snippet, SnippetSummary, CreateSnippet, UpdateSnippet } from '../types/snippet';
import { DatabaseService } from '../services/database.service';
import { DatabaseInitService } from '../config/database-init';
import * as FileSystem from 'expo-file-system/legacy';

interface SnippetContextType {
  summaries: SnippetSummary[];
  loading: boolean;
  createSnippet: (snippet: CreateSnippet & { id?: string }) => Promise<void>;
  updateSnippet: (id: string, updates: UpdateSnippet) => Promise<void>;
  deleteSnippet: (id: string) => Promise<void>;
  getSnippetById: (id: string) => Promise<Snippet | undefined>;
  toggleFavorite: (id: string) => Promise<void>;
}

const SnippetContext = createContext<SnippetContextType | undefined>(undefined);

const DUMMY_SNIPPETS: Snippet[] = [
  {
    id: '1',
    title: 'React Native useAppTheme Hook',
    description: 'A custom hook to handle light and dark mode switching using the system color scheme.',
    code: `export const useAppTheme = () => {\n  const colorScheme = useColorScheme();\n  const isDark = colorScheme === 'dark';\n  return { isDark, colors: isDark ? theme.dark : theme.light };\n};`,
    language: 'typescript',
    tags: ['react-native', 'theme', 'hook'],
    isFavorite: true,
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 86400000,
  },
  {
    id: '2',
    title: 'Python Quick Sort',
    description: 'A classic implementation of the quicksort algorithm using list comprehensions for conciseness.',
    code: `def quicksort(arr):\n    if len(arr) <= 1:\n        return arr\n    pivot = arr[len(arr) // 2]\n    left = [x for x in arr if x < pivot]\n    middle = [x for x in arr if x == pivot]\n    right = [x for x in arr if x > pivot]\n    return quicksort(left) + middle + quicksort(right)`,
    language: 'python',
    tags: ['algorithm', 'sorting'],
    isFavorite: false,
    createdAt: Date.now() - 172800000,
    updatedAt: Date.now() - 172800000,
  },
];

export const SnippetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);

  const summaries: SnippetSummary[] = snippets.map(({ code, updatedAt, ...summary }) => summary);

  useEffect(() => {
    const initDbAndLoadSnippets = async () => {
      try {
        await DatabaseInitService.init();
        let saved = await DatabaseService.getAllSnippets();
        if (saved && saved.length > 0) {
          setSnippets(saved);
        } else {
          for (const s of DUMMY_SNIPPETS) {
            await DatabaseService.insertSnippet(s);
          }
          saved = await DatabaseService.getAllSnippets();
          setSnippets(saved);
        }
      } catch (error) {
        console.error('Error initializing database or loading snippets:', error);
        setSnippets(DUMMY_SNIPPETS);
      } finally {
        setLoading(false);
      }
    };
    initDbAndLoadSnippets();
  }, []);

  const createSnippet = useCallback(async (newSnippet: CreateSnippet & { id?: string }) => {
    const snippet: Snippet = {
      ...newSnippet,
      id: newSnippet.id || Math.random().toString(36).substr(2, 9),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    try {
      await DatabaseService.insertSnippet(snippet);
      setSnippets(prev => [snippet, ...prev]);
    } catch (error) {
      console.error('Error inserting snippet into SQLite:', error);
    }
  }, []);

  const updateSnippet = useCallback(async (id: string, updates: UpdateSnippet) => {
    try {
      await DatabaseService.updateSnippet(id, updates);
      setSnippets(prev => 
        prev.map(s => s.id === id ? { ...s, ...updates, updatedAt: Date.now() } : s)
      );
    } catch (error) {
      console.error('Error updating snippet in SQLite:', error);
    }
  }, []);

  const deleteSnippet = useCallback(async (id: string) => {
    try {
      const snippet = snippets.find(s => s.id === id);
      if (snippet) {
        const folderName = `${snippet.title.replace(/[^a-zA-Z0-9]/g, '_') || 'Unnamed'}_${snippet.id}`;
        const folderPath = (FileSystem.documentDirectory || '') + 'snippets/' + folderName + '/';
        await FileSystem.deleteAsync(folderPath, { idempotent: true });
      }
      await DatabaseService.deleteSnippet(id);
      setSnippets(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error deleting snippet from SQLite:', error);
    }
  }, [snippets]);

  const getSnippetById = useCallback(async (id: string) => {
    try {
      return await DatabaseService.getSnippetById(id);
    } catch (error) {
      console.error('Error fetching snippet by id from SQLite:', error);
      return snippets.find(s => s.id === id);
    }
  }, [snippets]);

  const toggleFavorite = useCallback(async (id: string) => {
    const snippet = snippets.find(s => s.id === id);
    if (!snippet) return;
    
    const newFavoriteState = !snippet.isFavorite;
    try {
      await DatabaseService.updateSnippet(id, { isFavorite: newFavoriteState });
      setSnippets(prev => 
        prev.map(s => s.id === id ? { ...s, isFavorite: newFavoriteState, updatedAt: Date.now() } : s)
      );
    } catch (error) {
      console.error('Error toggling favorite in SQLite:', error);
    }
  }, [snippets]);

  return (
    <SnippetContext.Provider value={{ 
      summaries, 
      loading, 
      createSnippet, 
      updateSnippet, 
      deleteSnippet, 
      getSnippetById,
      toggleFavorite
    }}>
      {children}
    </SnippetContext.Provider>
  );
};

export const useSnippetContext = () => {
  const context = useContext(SnippetContext);
  if (context === undefined) {
    throw new Error('useSnippetContext must be used within a SnippetProvider');
  }
  return context;
};
