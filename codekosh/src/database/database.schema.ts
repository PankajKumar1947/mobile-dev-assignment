export const CREATE_SNIPPETS_TABLE = `
  CREATE TABLE IF NOT EXISTS snippets (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    code TEXT NOT NULL,
    language TEXT NOT NULL,
    tags TEXT NOT NULL,
    isFavorite INTEGER NOT NULL,
    screenshotUri TEXT,
    attachedFiles TEXT,
    createdAt INTEGER NOT NULL,
    updatedAt INTEGER NOT NULL
  );
`;

export const CREATE_ATTACHMENTS_TABLE = `
  CREATE TABLE IF NOT EXISTS snippet_attachments (
    id TEXT PRIMARY KEY,
    snippetId TEXT NOT NULL,
    name TEXT NOT NULL,
    uri TEXT NOT NULL,
    type TEXT,
    size INTEGER,
    FOREIGN KEY (snippetId) REFERENCES snippets (id) ON DELETE CASCADE
  );
`;
