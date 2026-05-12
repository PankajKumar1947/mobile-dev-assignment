export interface Note {
  id: string;
  title: string;
  content: string;
  date: number;
}

export type CreateNoteInput = Omit<Note, 'id' | 'date'>;
export type UpdateNoteInput = Partial<CreateNoteInput>;
