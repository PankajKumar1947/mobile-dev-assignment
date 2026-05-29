import { getDb } from '../services/database.service';
import { StorageService, STORAGE_KEYS } from '../services/storage.service';
import { Snippet } from '../types/snippet';

export class DatabaseInitService {
  static async init(): Promise<void> {
    const database = getDb();
    
    // Create the snippets table
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS snippets (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        code TEXT NOT NULL,
        language TEXT NOT NULL,
        tags TEXT NOT NULL,
        isFavorite INTEGER NOT NULL,
        screenshotUri TEXT,
        createdAt INTEGER NOT NULL,
        updatedAt INTEGER NOT NULL
      );
    `);

    // Migrate from AsyncStorage if the old key exists
    try {
      const oldSnippets = await StorageService.getObject<Snippet[]>(STORAGE_KEYS.SNIPPETS);
      if (oldSnippets && oldSnippets.length > 0) {
        console.log(`Migrating ${oldSnippets.length} snippets from AsyncStorage to SQLite...`);
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
                snippet.screenshotUri || null,
                snippet.createdAt,
                snippet.updatedAt
              ]
            );
          }
        }
        await StorageService.removeItem(STORAGE_KEYS.SNIPPETS);
        console.log('Migration completed and AsyncStorage key cleaned.');
      }
    } catch (err) {
      console.error('Error during snippets migration:', err);
    }
  }
}
