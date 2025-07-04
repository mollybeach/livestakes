import { runMigrations } from './database/migrations';
import pool from './database/db';

async function main() {
  console.log('Starting database migration process...');
  
  try {
    await runMigrations();
    console.log('Migrations completed successfully.');
  } catch (error) {
    console.error('Migration process failed:', error);
    process.exit(1);
  } finally {
    // Close the database pool
    console.log('Closing database connections...');
    await pool.end();
    console.log('Database connections closed.');
  }
}

// Run the migration process
main(); 