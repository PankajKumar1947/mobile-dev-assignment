import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Note, CreateNoteInput } from '../types/notes';

interface NoteContextType {
  notes: Note[];
  addNote: (note: CreateNoteInput) => void;
  updateNote: (id: string, note: CreateNoteInput) => void;
  deleteNote: (id: string) => void;
}

const NoteContext = createContext<NoteContextType | undefined>(undefined);

export function NoteProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([]);

  const addNote = (newNote: CreateNoteInput) => {
    const note: Note = {
      ...newNote,
      id: Date.now().toString(),
      date: Date.now(),
    };
    setNotes((prev) => [note, ...prev]);
  };

  const updateNote = (id: string, updatedNote: CreateNoteInput) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...updatedNote, date: Date.now() } : n))
    );
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NoteContext.Provider
      value={{
        notes,
        addNote,
        updateNote,
        deleteNote,
      }}
    >
      {children}
    </NoteContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NoteContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NoteProvider');
  }
  return context;
}
