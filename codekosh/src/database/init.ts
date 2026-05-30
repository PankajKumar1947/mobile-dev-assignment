import { getDb } from '../services/database.service';
import { StorageService, STORAGE_KEYS } from '../services/storage.service';
import { Snippet } from '../types/snippet';
import { CREATE_SNIPPETS_TABLE, CREATE_ATTACHMENTS_TABLE } from './database.schema';

export class DatabaseInitService {
  static async init(): Promise<void> {
    const database = getDb();
    
    await database.execAsync('PRAGMA foreign_keys = ON;');
    await database.execAsync(CREATE_SNIPPETS_TABLE);
    await database.execAsync(CREATE_ATTACHMENTS_TABLE);

    try {
      const columns = await database.getAllAsync<{ name: string }>('PRAGMA table_info(snippets)');
      const hasAttachedFiles = columns.some(col => col.name === 'attachedFiles');
      if (!hasAttachedFiles) {
        await database.execAsync('ALTER TABLE snippets ADD COLUMN attachedFiles TEXT;');
      }
    } catch (err) {
      console.error('Error migrating snippets table schema:', err);
    }

    try {
      const rows = await database.getAllAsync<{ id: string; attachedFiles: string }>(
        'SELECT id, attachedFiles FROM snippets WHERE attachedFiles IS NOT NULL AND attachedFiles != ""'
      );
      for (const row of rows) {
        try {
          const files = JSON.parse(row.attachedFiles);
          if (Array.isArray(files) && files.length > 0) {
            for (const file of files) {
              const fileId = Math.random().toString(36).substr(2, 9);
              await database.runAsync(
                `INSERT INTO snippet_attachments (id, snippetId, name, uri, type, size)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [fileId, row.id, file.name, file.uri, file.type || null, file.size || null]
              );
            }
          }
          await database.runAsync('UPDATE snippets SET attachedFiles = NULL WHERE id = ?', [row.id]);
        } catch (parseErr) {
          console.error(`Failed to parse attachedFiles for snippet ${row.id}:`, parseErr);
        }
      }
    } catch (migrationErr) {
      console.error('Failed to migrate attachedFiles column to snippet_attachments table:', migrationErr);
    }

    try {
      const oldSnippets = await StorageService.getObject<Snippet[]>(STORAGE_KEYS.SNIPPETS);
      if (oldSnippets && oldSnippets.length > 0) {
        for (const snippet of oldSnippets) {
          const exists = await database.getFirstAsync<{ id: string }>(
            'SELECT id FROM snippets WHERE id = ?',
            [snippet.id]
          );
          
          if (!exists) {
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
                (snippet as any).screenshotUri || null,
                snippet.createdAt,
                snippet.updatedAt
              ]
            );
          }
        }
        await StorageService.removeItem(STORAGE_KEYS.SNIPPETS);
      }
    } catch (err) {
      console.error('Error during snippets migration:', err);
    }
  }
}
