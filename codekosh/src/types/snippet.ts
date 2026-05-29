export type ProgrammingLanguage = 
  | 'typescript' 
  | 'javascript' 
  | 'python' 
  | 'go' 
  | 'rust' 
  | 'xml' 
  | 'css' 
  | 'markdown';

export interface SnippetSummary {
  id: string;
  title: string;
  description?: string;
  language: ProgrammingLanguage;
  tags: string[];
  isFavorite: boolean;
  createdAt: number;
  screenshotUri?: string;
}

export interface Snippet extends SnippetSummary {
  code: string;
  updatedAt: number;
}

export type CreateSnippet = Omit<Snippet, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateSnippet = Partial<CreateSnippet>;
