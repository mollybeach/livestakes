import pool from './db';
import { ensureDatabaseExists } from './dbInitialization';
import { runMigrations } from './migrations';

/**
 * Create the deposits table if it doesn't exist
 */
export async function initializeDatabase() {
  try {
    await ensureDatabaseExists();
    const client = await pool.connect();
    try {
      // Create the deposits table
      await client.query(`

      `);
      
      console.log('Database initialized - all tables ready');
    } finally {
      client.release();
    }
    
    // Run migrations after tables are created
    await runMigrations();
    
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}
