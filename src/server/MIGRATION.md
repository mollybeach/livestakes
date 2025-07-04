# Database Migrations

This document explains how to run database migrations for the livestakes Incinerator application.

## About Migrations

Migrations are used to make changes to the database schema in a controlled, versioned manner. Each migration is tracked in a `migrations` table to ensure it's only applied once.

## Running Migrations

Migrations can be run in two ways:

### 1. Automatically on Server Startup

The server automatically runs migrations when it starts up. This happens as part of the `initializeDatabase()` function.

### 2. Manually via Command Line

To run migrations manually:

```bash
# Navigate to the server directory
cd src/server

# Run the migration script
npm run migrate
```

This is useful when:
- You need to apply migrations without restarting the server
- You're debugging migration issues
- You want to update the database schema before deploying a new version

## Current Migrations

### 1. Add Swapped Value Column

**Migration Name**: `add_swapped_value_column`

This migration adds a `swapped_value` column to the `deposits` table to track the value of tokens that were swapped through Jupiter in the incineration process. This value helps give proper credit to users for the SOL value of their swapped tokens.

```sql
ALTER TABLE deposits 
ADD COLUMN IF NOT EXISTS swapped_value DECIMAL(18, 9) DEFAULT 0;
```

## Adding New Migrations

To add a new migration:

1. Update the `src/server/src/database/migrations.ts` file
2. Add a new migration function following the pattern of existing migrations
3. Add the new function to the `runMigrations()` function

Example:

```typescript
/**
 * Migration: New migration description
 */
export async function newMigrationFunction(): Promise<void> {
  const migrationName = 'unique_migration_name';
  
  // Skip if already applied
  if (await hasMigrationBeenApplied(migrationName)) {
    console.log(`Migration ${migrationName} already applied, skipping`);
    return;
  }
  
  const client = await pool.connect();
  try {
    // Start transaction
    await client.query('BEGIN');
    
    console.log(`Applying migration: ${migrationName}`);
    
    // Your migration SQL here
    await client.query(`
      ALTER TABLE some_table 
      ADD COLUMN new_column TYPE;
    `);
    
    // Record migration as applied
    await markMigrationAsApplied(migrationName);
    
    // Commit transaction
    await client.query('COMMIT');
    
    console.log(`Migration applied successfully: ${migrationName}`);
  } catch (error) {
    // Rollback on error
    await client.query('ROLLBACK');
    console.error('Migration failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Then add to runMigrations function:
export async function runMigrations(): Promise<void> {
  try {
    // ...
    await addSwappedValueColumn();
    await newMigrationFunction(); // Add your new migration here
    // ...
  } catch (error) {
    // ...
  }
} 