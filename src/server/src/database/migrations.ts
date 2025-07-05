import pool from './db';

/**
 * Migration registry - tracks applied migrations
 */
export async function setupMigrationTable() {
  const client = await pool.connect();
  try {
    // Create the migrations table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Migration table setup complete');
  } catch (error) {
    console.error('Failed to setup migration table:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Check if a migration has been applied
 */
export async function hasMigrationBeenApplied(migrationName: string): Promise<boolean> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT 1 FROM migrations WHERE name = $1',
      [migrationName]
    );
    return (result.rowCount || 0) > 0;
  } catch (error) {
    console.error(`Failed to check migration status for ${migrationName}:`, error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Record a migration as applied
 */
export async function markMigrationAsApplied(migrationName: string): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query(
      'INSERT INTO migrations (name) VALUES ($1)',
      [migrationName]
    );
    console.log(`Migration ${migrationName} marked as applied`);
  } catch (error) {
    console.error(`Failed to mark migration ${migrationName} as applied:`, error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Migration: Add swapped_value column to deposits table
 */
// export async function addSwappedValueColumn(): Promise<void> {
//   const migrationName = 'add_swapped_value_column';
  
//   // Skip if already applied
//   if (await hasMigrationBeenApplied(migrationName)) {
//     console.log(`Migration ${migrationName} already applied, skipping`);
//     return;
//   }
  
//   const client = await pool.connect();
//   try {
//     // Start transaction
//     await client.query('BEGIN');
    
//     console.log('Applying migration: add_swapped_value_column');
    
//     // Add swapped_value column if it doesn't exist
//     await client.query(`
//       ALTER TABLE deposits 
//       ADD COLUMN IF NOT EXISTS swapped_value DECIMAL(18, 9) DEFAULT 0;
//     `);
    
//     // Record migration as applied
//     await markMigrationAsApplied(migrationName);
    
//     // Commit transaction
//     await client.query('COMMIT');
    
//     console.log('Migration applied successfully: add_swapped_value_column');
//   } catch (error) {
//     // Rollback on error
//     await client.query('ROLLBACK');
//     console.error('Migration failed:', error);
//     throw error;
//   } finally {
//     client.release();
//   }
// } EXAMPLE

/**
 * Migration: Add tags and transcript columns to livestreams table
 */
export async function addTagsAndTranscriptColumns(): Promise<void> {
  const migrationName = 'add_tags_and_transcript_columns';
  
  // Skip if already applied
  if (await hasMigrationBeenApplied(migrationName)) {
    console.log(`Migration ${migrationName} already applied, skipping`);
    return;
  }
  
  const client = await pool.connect();
  try {
    // Start transaction
    await client.query('BEGIN');
    
    console.log('Applying migration: add_tags_and_transcript_columns');
    
    // Add tags column (JSON array)
    await client.query(`
      ALTER TABLE livestreams 
      ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]';
    `);
    
    // Add transcript column (text)
    await client.query(`
      ALTER TABLE livestreams 
      ADD COLUMN IF NOT EXISTS transcript TEXT;
    `);
    
    // Add index on tags for faster queries
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_livestreams_tags 
      ON livestreams USING gin(tags);
    `);
    
    // Record migration as applied
    await markMigrationAsApplied(migrationName);
    
    // Commit transaction
    await client.query('COMMIT');
    
    console.log('Migration applied successfully: add_tags_and_transcript_columns');
  } catch (error) {
    // Rollback on error
    await client.query('ROLLBACK');
    console.error('Migration failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Run all migrations in sequence
 */
export async function runMigrations(): Promise<void> {
  try {
    console.log('Starting database migrations...');
    
    // Setup migrations table
    await setupMigrationTable();
    
    // Run individual migrations
    await addTagsAndTranscriptColumns();
    
    console.log('All migrations completed successfully');
  } catch (error) {
    console.error('Migration process failed:', error);
    throw error;
  }
} 