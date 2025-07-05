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
 * Migration: Create markets table
 */
export async function createMarketsTable(): Promise<void> {
  const migrationName = 'create_markets_table';
  
  // Skip if already applied
  if (await hasMigrationBeenApplied(migrationName)) {
    console.log(`Migration ${migrationName} already applied, skipping`);
    return;
  }
  
  const client = await pool.connect();
  try {
    // Start transaction
    await client.query('BEGIN');
    
    console.log('Applying migration: create_markets_table');
    
    // Create markets table
    await client.query(`
      CREATE TABLE IF NOT EXISTS markets (
        id SERIAL PRIMARY KEY,
        contract_address TEXT UNIQUE NOT NULL,
        creator_wallet_address TEXT NOT NULL,
        question TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        category TEXT DEFAULT 'general',
        tags JSONB DEFAULT '[]',
        livestream_id INTEGER REFERENCES livestreams(id) ON DELETE SET NULL,
        expiry_date TIMESTAMP WITH TIME ZONE,
        status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed', 'resolved')),
        total_volume DECIMAL(18, 9) DEFAULT 0,
        yes_volume DECIMAL(18, 9) DEFAULT 0,
        no_volume DECIMAL(18, 9) DEFAULT 0,
        resolved_outcome BOOLEAN,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Add indexes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_markets_creator ON markets(creator_wallet_address);
      CREATE INDEX IF NOT EXISTS idx_markets_category ON markets(category);
      CREATE INDEX IF NOT EXISTS idx_markets_livestream ON markets(livestream_id);
      CREATE INDEX IF NOT EXISTS idx_markets_status ON markets(status);
      CREATE INDEX IF NOT EXISTS idx_markets_tags ON markets USING gin(tags);
    `);
    
    // Record migration as applied
    await markMigrationAsApplied(migrationName);
    
    // Commit transaction
    await client.query('COMMIT');
    
    console.log('Migration applied successfully: create_markets_table');
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
 * Migration: Add market_ids column to livestreams table
 */
export async function addMarketIdsColumn(): Promise<void> {
  const migrationName = 'add_market_ids_column';
  
  // Skip if already applied
  if (await hasMigrationBeenApplied(migrationName)) {
    console.log(`Migration ${migrationName} already applied, skipping`);
    return;
  }
  
  const client = await pool.connect();
  try {
    // Start transaction
    await client.query('BEGIN');
    
    console.log('Applying migration: add_market_ids_column');
    
    // Add market_ids column (JSON array of market addresses)
    await client.query(`
      ALTER TABLE livestreams 
      ADD COLUMN IF NOT EXISTS market_ids JSONB DEFAULT '[]';
    `);
    
    // Add index on market_ids for faster queries
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_livestreams_market_ids 
      ON livestreams USING gin(market_ids);
    `);
    
    // Record migration as applied
    await markMigrationAsApplied(migrationName);
    
    // Commit transaction
    await client.query('COMMIT');
    
    console.log('Migration applied successfully: add_market_ids_column');
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
 * Migration: Create market_metadata table for off-chain market data
 */
export async function createMarketMetadataTable(): Promise<void> {
  const migrationName = 'create_market_metadata_table';
  
  // Skip if already applied
  if (await hasMigrationBeenApplied(migrationName)) {
    console.log(`Migration ${migrationName} already applied, skipping`);
    return;
  }
  
  const client = await pool.connect();
  try {
    // Start transaction
    await client.query('BEGIN');
    
    console.log('Applying migration: create_market_metadata_table');
    
    // Create market_metadata table for off-chain data
    await client.query(`
      CREATE TABLE IF NOT EXISTS market_metadata (
        id SERIAL PRIMARY KEY,
        contract_address TEXT UNIQUE NOT NULL,
        creator_wallet_address TEXT NOT NULL,
        description TEXT,
        category TEXT DEFAULT 'general',
        tags JSONB DEFAULT '[]',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Add indexes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_market_metadata_creator ON market_metadata(creator_wallet_address);
      CREATE INDEX IF NOT EXISTS idx_market_metadata_category ON market_metadata(category);
      CREATE INDEX IF NOT EXISTS idx_market_metadata_tags ON market_metadata USING gin(tags);
    `);
    
    // Record migration as applied
    await markMigrationAsApplied(migrationName);
    
    // Commit transaction
    await client.query('COMMIT');
    
    console.log('Migration applied successfully: create_market_metadata_table');
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
 * Migration: Replace market_ids array with single market_address for 1:1 relationship
 */
export async function addMarketAddressColumn(): Promise<void> {
  const migrationName = 'add_market_address_column';
  
  // Skip if already applied
  if (await hasMigrationBeenApplied(migrationName)) {
    console.log(`Migration ${migrationName} already applied, skipping`);
    return;
  }
  
  const client = await pool.connect();
  try {
    // Start transaction
    await client.query('BEGIN');
    
    console.log('Applying migration: add_market_address_column');
    
    // Add market_address column (single contract address)
    await client.query(`
      ALTER TABLE livestreams 
      ADD COLUMN IF NOT EXISTS market_address TEXT;
    `);
    
    // Add index on market_address for faster queries
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_livestreams_market_address 
      ON livestreams(market_address);
    `);
    
    // Copy existing market_ids data to market_address (take first address if array exists)
    await client.query(`
      UPDATE livestreams 
      SET market_address = (
        CASE 
          WHEN market_ids IS NOT NULL AND jsonb_array_length(market_ids) > 0 
          THEN market_ids->>0
          ELSE NULL 
        END
      )
      WHERE market_ids IS NOT NULL;
    `);
    
    console.log('✅ Successfully migrated market_ids to market_address');
    
    // Record migration as applied
    await markMigrationAsApplied(migrationName);
    
    // Commit transaction
    await client.query('COMMIT');
    
    console.log('Migration applied successfully: add_market_address_column');
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
    await addMarketIdsColumn();
    await createMarketMetadataTable();
    await addMarketAddressColumn();
    
    console.log('All migrations completed successfully');
  } catch (error) {
    console.error('Migration process failed:', error);
    throw error;
  }
} 