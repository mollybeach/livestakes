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
 * Migration: Create users table
 */
export async function createUsersTable(): Promise<void> {
  const migrationName = 'create_users_table';
  
  // Skip if already applied
  if (await hasMigrationBeenApplied(migrationName)) {
    console.log(`Migration ${migrationName} already applied, skipping`);
    return;
  }
  
  const client = await pool.connect();
  try {
    // Start transaction
    await client.query('BEGIN');
    
    console.log('Applying migration: create_users_table');
    
    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        wallet_address TEXT UNIQUE NOT NULL,
        email TEXT,
        username TEXT,
        avatar_url TEXT DEFAULT 'https://res.cloudinary.com/storagemanagementcontainer/image/upload/v1751747169/default-avatar_ynttwb.png',
        github_url TEXT,
        bio TEXT,
        win_rate DECIMAL(5,2) DEFAULT 0,
        total_winnings DECIMAL(18, 9) DEFAULT 0,
        total_bets INTEGER DEFAULT 0,
        total_wins INTEGER DEFAULT 0,
        rank TEXT DEFAULT 'Newcomer',
        rating DECIMAL(3,1) DEFAULT 0.0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Add indexes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_wallet_address ON users(wallet_address);
      CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
      CREATE INDEX IF NOT EXISTS idx_users_win_rate ON users(win_rate DESC);
      CREATE INDEX IF NOT EXISTS idx_users_total_winnings ON users(total_winnings DESC);
    `);
    
    // Record migration as applied
    await markMigrationAsApplied(migrationName);
    
    // Commit transaction
    await client.query('COMMIT');
    
    console.log('Migration applied successfully: create_users_table');
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
 * Migration: Create likes table
 */
export async function createLikesTable(): Promise<void> {
  const migrationName = 'create_likes_table';
  
  // Skip if already applied
  if (await hasMigrationBeenApplied(migrationName)) {
    console.log(`Migration ${migrationName} already applied, skipping`);
    return;
  }
  
  const client = await pool.connect();
  try {
    // Start transaction
    await client.query('BEGIN');
    
    console.log('Applying migration: create_likes_table');
    
    // Create likes table
    await client.query(`
      CREATE TABLE IF NOT EXISTS likes (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        livestream_id INTEGER REFERENCES livestreams(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, livestream_id)
      );
    `);
    
    // Add indexes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id);
      CREATE INDEX IF NOT EXISTS idx_likes_livestream_id ON likes(livestream_id);
      CREATE INDEX IF NOT EXISTS idx_likes_created_at ON likes(created_at DESC);
    `);
    
    // Record migration as applied
    await markMigrationAsApplied(migrationName);
    
    // Commit transaction
    await client.query('COMMIT');
    
    console.log('Migration applied successfully: create_likes_table');
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
 * Migration: Create comments table
 */
export async function createCommentsTable(): Promise<void> {
  const migrationName = 'create_comments_table';
  
  // Skip if already applied
  if (await hasMigrationBeenApplied(migrationName)) {
    console.log(`Migration ${migrationName} already applied, skipping`);
    return;
  }
  
  const client = await pool.connect();
  try {
    // Start transaction
    await client.query('BEGIN');
    
    console.log('Applying migration: create_comments_table');
    
    // Create comments table
    await client.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        livestream_id INTEGER REFERENCES livestreams(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        parent_comment_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,
        likes_count INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Add indexes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
      CREATE INDEX IF NOT EXISTS idx_comments_livestream_id ON comments(livestream_id);
      CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_comment_id);
      CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);
    `);
    
    // Record migration as applied
    await markMigrationAsApplied(migrationName);
    
    // Commit transaction
    await client.query('COMMIT');
    
    console.log('Migration applied successfully: create_comments_table');
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
 * Migration: Create bets table
 */
export async function createBetsTable(): Promise<void> {
  const migrationName = 'create_bets_table';
  
  // Skip if already applied
  if (await hasMigrationBeenApplied(migrationName)) {
    console.log(`Migration ${migrationName} already applied, skipping`);
    return;
  }
  
  const client = await pool.connect();
  try {
    // Start transaction
    await client.query('BEGIN');
    
    console.log('Applying migration: create_bets_table');
    
    // Create bets table
    await client.query(`
      CREATE TABLE IF NOT EXISTS bets (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        market_address TEXT NOT NULL,
        livestream_id INTEGER REFERENCES livestreams(id) ON DELETE SET NULL,
        amount DECIMAL(18, 9) NOT NULL,
        outcome BOOLEAN, -- true for yes, false for no
        status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'won', 'lost', 'cancelled')),
        payout DECIMAL(18, 9) DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        resolved_at TIMESTAMP WITH TIME ZONE
      );
    `);
    
    // Add indexes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_bets_user_id ON bets(user_id);
      CREATE INDEX IF NOT EXISTS idx_bets_market_address ON bets(market_address);
      CREATE INDEX IF NOT EXISTS idx_bets_livestream_id ON bets(livestream_id);
      CREATE INDEX IF NOT EXISTS idx_bets_status ON bets(status);
      CREATE INDEX IF NOT EXISTS idx_bets_created_at ON bets(created_at DESC);
    `);
    
    // Record migration as applied
    await markMigrationAsApplied(migrationName);
    
    // Commit transaction
    await client.query('COMMIT');
    
    console.log('Migration applied successfully: create_bets_table');
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
 * Migration: Create projects table
 */
export async function createProjectsTable(): Promise<void> {
  const migrationName = 'create_projects_table';
  
  // Skip if already applied
  if (await hasMigrationBeenApplied(migrationName)) {
    console.log(`Migration ${migrationName} already applied, skipping`);
    return;
  }
  
  const client = await pool.connect();
  try {
    // Start transaction
    await client.query('BEGIN');
    
    console.log('Applying migration: create_projects_table');
    
    // Create projects table
    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        description TEXT,
        category TEXT DEFAULT 'general',
        tags JSONB DEFAULT '[]',
        github_url TEXT,
        demo_url TEXT,
        status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
        volume DECIMAL(18, 9) DEFAULT 0,
        participants INTEGER DEFAULT 0,
        odds DECIMAL(5,2) DEFAULT 0,
        result TEXT CHECK (result IN ('won', 'lost', 'pending')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Add indexes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
      CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
      CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
      CREATE INDEX IF NOT EXISTS idx_projects_tags ON projects USING gin(tags);
      CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
    `);
    
    // Record migration as applied
    await markMigrationAsApplied(migrationName);
    
    // Commit transaction
    await client.query('COMMIT');
    
    console.log('Migration applied successfully: create_projects_table');
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
 * Migration: Add user_id column to livestreams table
 */
export async function addUserIdToLivestreams(): Promise<void> {
  const migrationName = 'add_user_id_to_livestreams';
  
  // Skip if already applied
  if (await hasMigrationBeenApplied(migrationName)) {
    console.log(`Migration ${migrationName} already applied, skipping`);
    return;
  }
  
  const client = await pool.connect();
  try {
    // Start transaction
    await client.query('BEGIN');
    
    console.log('Applying migration: add_user_id_to_livestreams');
    
    // Add user_id column to livestreams table
    await client.query(`
      ALTER TABLE livestreams 
      ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE SET NULL;
    `);
    
    // Add index on user_id
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_livestreams_user_id 
      ON livestreams(user_id);
    `);
    
    // Record migration as applied
    await markMigrationAsApplied(migrationName);
    
    // Commit transaction
    await client.query('COMMIT');
    
    console.log('Migration applied successfully: add_user_id_to_livestreams');
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
 * Migration: Set default usernames for users
 */
export async function setDefaultUsernames(): Promise<void> {
  const migrationName = 'set_default_usernames';
  
  // Skip if already applied
  if (await hasMigrationBeenApplied(migrationName)) {
    console.log(`Migration ${migrationName} already applied, skipping`);
    return;
  }
  
  const client = await pool.connect();
  try {
    // Start transaction
    await client.query('BEGIN');
    
    console.log('Applying migration: set_default_usernames');
    
    // Update users who don't have a username to use their ID as default
    await client.query(`
      UPDATE users 
      SET username = 'user_' || id::text 
      WHERE username IS NULL OR username = '';
    `);
    
    // Record migration as applied
    await markMigrationAsApplied(migrationName);
    
    // Commit transaction
    await client.query('COMMIT');
    
    console.log('Migration applied successfully: set_default_usernames');
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
 * Migration: Add github_url column to livestreams table
 */
export async function addGithubUrlToLivestreams(): Promise<void> {
  const migrationName = 'add_github_url_to_livestreams';
  if (await hasMigrationBeenApplied(migrationName)) {
    console.log(`Migration ${migrationName} already applied, skipping`);
    return;
  }
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(`
      ALTER TABLE livestreams
      ADD COLUMN IF NOT EXISTS github_url TEXT DEFAULT 'https://github.com';
    `);
    await markMigrationAsApplied(migrationName);
    await client.query('COMMIT');
    console.log('Migration applied successfully: add_github_url_to_livestreams');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Migration: Add avatar to livestreams table
 */
export async function addAvatarToLivestreams(): Promise<void> {
  const migrationName = 'add_avatar_to_livestreams';
  if (await hasMigrationBeenApplied(migrationName)) {
    console.log(`Migration ${migrationName} already applied, skipping`);
    return;
  }
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(`
      ALTER TABLE livestreams
      ADD COLUMN IF NOT EXISTS avatar TEXT DEFAULT 'https://res.cloudinary.com/storagemanagementcontainer/image/upload/v1751747169/default-avatar_ynttwb.png';
    `);
    await markMigrationAsApplied(migrationName);
    await client.query('COMMIT');
    console.log('Migration applied successfully: add_avatar_to_livestreams');
  } catch (error) {
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
    await createUsersTable();
    await createLikesTable();
    await createCommentsTable();
    await createBetsTable();
    await createProjectsTable();
    await addUserIdToLivestreams();
    await setDefaultUsernames();
    await addGithubUrlToLivestreams();
    await addAvatarToLivestreams();
    
    console.log('All migrations completed successfully');
  } catch (error) {
    console.error('Migration process failed:', error);
    throw error;
  }
} 