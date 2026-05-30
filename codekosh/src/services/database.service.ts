import { openDatabaseSync, SQLiteDatabase } from 'expo-sqlite';
import { Snippet, UpdateSnippet, AttachedFile } from '../types/snippet';

const DATABASE_NAME = 'codekosh.db';
let db: SQLiteDatabase | null = null;

export const getDb = (): SQLiteDatabase => {
  if (!db) {
    db = openDatabaseSync(DATABASE_NAME);
  }
  return db;
};

export interface SnippetRow {
  id: string;
  title: string;
  description: string | null;
  code: string;
  language: string;
  tags: string;
  isFavorite: number;
  createdAt: number;
  updatedAt: number;
}

export interface AttachmentRow {
  id: string;
  snippetId: string;
  name: string;
  uri: string;
  type: string | null;
  size: number | null;
}

export class DatabaseService {
  static async getAllSnippets(): Promise<Snippet[]> {
    const database = getDb();
    
    const rows = await database.getAllAsync<SnippetRow>(
      'SELECT * FROM snippets ORDER BY createdAt DESC'
    );
    
    const attachmentRows = await database.getAllAsync<AttachmentRow>(
      'SELECT * FROM snippet_attachments'
    );
    
    const attachmentsMap: Record<string, AttachedFile[]> = {};
    for (const row of attachmentRows) {
      if (!attachmentsMap[row.snippetId]) {
        attachmentsMap[row.snippetId] = [];
      }
      attachmentsMap[row.snippetId].push({
        name: row.name,
        uri: row.uri,
        type: row.type || undefined,
        size: row.size || undefined,
      });
    }
    
    return rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description || undefined,
      code: row.code,
      language: row.language as any,
      tags: JSON.parse(row.tags || '[]'),
      isFavorite: Boolean(row.isFavorite),
      attachedFiles: attachmentsMap[row.id] || [],
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    }));
  }

  static async getSnippetById(id: string): Promise<Snippet | undefined> {
    const database = getDb();
    
    const row = await database.getFirstAsync<SnippetRow>(
      'SELECT * FROM snippets WHERE id = ?',
      [id]
    );
    
    if (!row) return undefined;

    const attachmentRows = await database.getAllAsync<AttachmentRow>(
      'SELECT * FROM snippet_attachments WHERE snippetId = ?',
      [id]
    );
    
    const attachedFiles = attachmentRows.map(r => ({
      name: r.name,
      uri: r.uri,
      type: r.type || undefined,
      size: r.size || undefined,
    }));
    
    return {
      id: row.id,
      title: row.title,
      description: row.description || undefined,
      code: row.code,
      language: row.language as any,
      tags: JSON.parse(row.tags || '[]'),
      isFavorite: Boolean(row.isFavorite),
      attachedFiles,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    };
  }

  static async insertSnippet(snippet: Snippet): Promise<void> {
    const database = getDb();
    
    await database.withTransactionAsync(async () => {
      await database.runAsync(
        `INSERT INTO snippets (id, title, description, code, language, tags, isFavorite, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          snippet.id,
          snippet.title,
          snippet.description || null,
          snippet.code,
          snippet.language,
          JSON.stringify(snippet.tags),
          snippet.isFavorite ? 1 : 0,
          snippet.createdAt,
          snippet.updatedAt
        ]
      );
      
      if (snippet.attachedFiles && snippet.attachedFiles.length > 0) {
        for (const file of snippet.attachedFiles) {
          const fileId = Math.random().toString(36).substr(2, 9);
          await database.runAsync(
            `INSERT INTO snippet_attachments (id, snippetId, name, uri, type, size)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
              fileId,
              snippet.id,
              file.name,
              file.uri,
              file.type || null,
              file.size || null
            ]
          );
        }
      }
    });
  }

  static async updateSnippet(id: string, updates: UpdateSnippet): Promise<void> {
    const database = getDb();
    
    await database.withTransactionAsync(async () => {
      const fields: string[] = [];
      const values: any[] = [];
      
      Object.entries(updates).forEach(([key, val]) => {
        if (key === 'tags') {
          fields.push('tags = ?');
          values.push(JSON.stringify(val));
        } else if (key === 'isFavorite') {
          fields.push('isFavorite = ?');
          values.push(val ? 1 : 0);
        } else if (key === 'description') {
          fields.push('description = ?');
          values.push(val === undefined ? null : val);
        } else if (key !== 'attachedFiles') {
          fields.push(`${key} = ?`);
          values.push(val);
        }
      });
      
      if (fields.length > 0) {
        fields.push('updatedAt = ?');
        values.push(Date.now());
        values.push(id);
        
        await database.runAsync(
          `UPDATE snippets SET ${fields.join(', ')} WHERE id = ?`,
          values
        );
      }
      
      if (updates.attachedFiles !== undefined) {
        await database.runAsync(
          'DELETE FROM snippet_attachments WHERE snippetId = ?',
          [id]
        );
        
        for (const file of updates.attachedFiles) {
          const fileId = Math.random().toString(36).substr(2, 9);
          await database.runAsync(
            `INSERT INTO snippet_attachments (id, snippetId, name, uri, type, size)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
              fileId,
              id,
              file.name,
              file.uri,
              file.type || null,
              file.size || null
            ]
          );
        }
      }
    });
  }

  static async deleteSnippet(id: string): Promise<void> {
    const database = getDb();
    await database.runAsync('DELETE FROM snippets WHERE id = ?', [id]);
  }
}
