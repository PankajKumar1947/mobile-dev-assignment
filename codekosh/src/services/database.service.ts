import { openDatabaseSync, SQLiteDatabase } from 'expo-sqlite';
import { Snippet, UpdateSnippet } from '../types/snippet';

const DATABASE_NAME = 'codekosh.db';
let db: SQLiteDatabase | null = null;

export const getDb = (): SQLiteDatabase => {
  if (!db) {
    db = openDatabaseSync(DATABASE_NAME);
  }
  return db;
};

export class DatabaseService {
  static async getAllSnippets(): Promise<Snippet[]> {
    const database = getDb();
    const rows = await database.getAllAsync<any>(
      'SELECT * FROM snippets ORDER BY createdAt DESC'
    );
    
    return rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description || undefined,
      code: row.code,
      language: row.language,
      tags: JSON.parse(row.tags || '[]'),
      isFavorite: Boolean(row.isFavorite),
      screenshotUri: row.screenshotUri || undefined,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    }));
  }

  static async getSnippetById(id: string): Promise<Snippet | undefined> {
    const database = getDb();
    const row = await database.getFirstAsync<any>(
      'SELECT * FROM snippets WHERE id = ?',
      [id]
    );
    
    if (!row) return undefined;
    
    return {
      id: row.id,
      title: row.title,
      description: row.description || undefined,
      code: row.code,
      language: row.language,
      tags: JSON.parse(row.tags || '[]'),
      isFavorite: Boolean(row.isFavorite),
      screenshotUri: row.screenshotUri || undefined,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    };
  }

  static async insertSnippet(snippet: Snippet): Promise<void> {
    const database = getDb();
    await database.runAsync(
      `INSERT INTO snippets (id, title, description, code, language, tags, isFavorite, screenshotUri, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        snippet.id,
        snippet.title,
        snippet.description || null,
        snippet.code,
        snippet.language,
        JSON.stringify(snippet.tags),
        snippet.isFavorite ? 1 : 0,
        snippet.screenshotUri || null,
        snippet.createdAt,
        snippet.updatedAt
      ]
    );
  }

  static async updateSnippet(id: string, updates: UpdateSnippet): Promise<void> {
    const database = getDb();
    const fields: string[] = [];
    const values: any[] = [];
    
    Object.entries(updates).forEach(([key, val]) => {
      if (key === 'tags') {
        fields.push('tags = ?');
        values.push(JSON.stringify(val));
      } else if (key === 'isFavorite') {
        fields.push('isFavorite = ?');
        values.push(val ? 1 : 0);
      } else if (key === 'description' || key === 'screenshotUri') {
        fields.push(`${key} = ?`);
        values.push(val === undefined ? null : val);
      } else {
        fields.push(`${key} = ?`);
        values.push(val);
      }
    });
    
    if (fields.length === 0) return;
    
    fields.push('updatedAt = ?');
    values.push(Date.now());
    
    values.push(id);
    
    await database.runAsync(
      `UPDATE snippets SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
  }

  static async deleteSnippet(id: string): Promise<void> {
    const database = getDb();
    await database.runAsync('DELETE FROM snippets WHERE id = ?', [id]);
  }
}
