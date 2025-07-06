import pool from './db';
import { ensureDatabaseExists } from './dbInitialization';
import { runMigrations } from './migrations';
import type { MarketDataType, LivestreamDataType } from '../types';

// Market information from blockchain + metadata
export interface MarketData {
  contract_address: string;
  question?: string;
  title?: string;
  description?: string;
  category?: string;
  tags?: string[];
  state?: number; // 0=Open, 1=Closed, 2=Resolved
  total_pool?: string;
  yes_bets?: string;
  no_bets?: string;
  yes_odds?: number;
  no_odds?: number;
  creator_wallet_address?: string;
  created_at?: Date;
}

// Livestream interface with simplified market data (1:1 relationship)
export interface Livestream {
  id?: number;
  title: string;
  description?: string;
  creator_wallet_address: string;
  stream_url?: string;
  thumbnail_url?: string;
  status: 'scheduled' | 'active' | 'ended';
  start_time?: Date;
  end_time?: Date;
  view_count?: number;
  category?: string;
  tags?: string[];
  transcript?: string;
  market_address?: string; // Single contract address for 1:1 relationship
  market?: MarketData; // Single market data
  created_at?: Date;
  updated_at?: Date;
}

/**
 * Create the deposits table if it doesn't exist
 */
export async function initializeDatabase() {
  try {
    await ensureDatabaseExists();
    const client = await pool.connect();
    try {
      // Create the livestreams table
      await client.query(`
        CREATE TABLE IF NOT EXISTS livestreams (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT,
          creator_wallet_address TEXT NOT NULL,
          stream_url TEXT,
          thumbnail_url TEXT,
          status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'active', 'ended')),
          start_time TIMESTAMP WITH TIME ZONE,
          end_time TIMESTAMP WITH TIME ZONE,
          view_count INTEGER DEFAULT 0,
          category TEXT,
          tags JSONB DEFAULT '[]',
          transcript TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Create index on creator_wallet_address for faster queries
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_livestreams_creator 
        ON livestreams(creator_wallet_address);
      `);

      // Create index on status for faster filtering
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_livestreams_status 
        ON livestreams(status);
      `);

      // Create index on start_time for sorting
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_livestreams_start_time 
        ON livestreams(start_time DESC);
      `);

      // Create index on tags for faster queries
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_livestreams_tags 
        ON livestreams USING gin(tags);
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

/**
 * Create a new livestream
 */
export async function createLivestream(livestream: Omit<Livestream, 'id' | 'created_at' | 'updated_at'>): Promise<Livestream> {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      INSERT INTO livestreams (
        title, description, creator_wallet_address, stream_url, 
        thumbnail_url, status, start_time, end_time, view_count, category, tags, transcript
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `, [
      livestream.title,
      livestream.description,
      livestream.creator_wallet_address,
      livestream.stream_url,
      livestream.thumbnail_url,
      livestream.status,
      livestream.start_time,
      livestream.end_time,
      livestream.view_count || 0,
      livestream.category,
      livestream.tags ? JSON.stringify(livestream.tags) : null,
      livestream.transcript
    ]);
    
    return result.rows[0];
  } catch (error) {
    console.error('Failed to create livestream:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Get all livestreams with optional filtering, including market data
 */
export async function getAllLivestreams(filters?: {
  status?: string;
  creator_wallet_address?: string;
  limit?: number;
  offset?: number;
}): Promise<Livestream[]> {
  const client = await pool.connect();
  try {
    // First, get livestreams
    let query = `
      SELECT 
        l.*,
        l.market_address
      FROM livestreams l 
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramIndex = 1;

    if (filters?.status) {
      query += ` AND l.status = $${paramIndex}`;
      params.push(filters.status);
      paramIndex++;
    }

    if (filters?.creator_wallet_address) {
      query += ` AND l.creator_wallet_address = $${paramIndex}`;
      params.push(filters.creator_wallet_address);
      paramIndex++;
    }

    query += ' ORDER BY l.start_time DESC, l.created_at DESC';

    if (filters?.limit) {
      query += ` LIMIT $${paramIndex}`;
      params.push(filters.limit);
      paramIndex++;
    }

    if (filters?.offset) {
      query += ` OFFSET $${paramIndex}`;
      params.push(filters.offset);
    }

    console.log('🔍 Fetching livestreams with query:', query);
    const livestreamsResult = await client.query(query, params);
    const livestreams: Livestream[] = livestreamsResult.rows;

    // For each livestream, fetch associated market metadata
    for (const livestream of livestreams) {
      const marketAddress = livestream.market_address || '';
      
      if (marketAddress.length > 0) {
        try {
          // Get market metadata for the single market address
          const marketQuery = `
            SELECT 
              contract_address,
              creator_wallet_address,
              description,
              category,
              tags,
              created_at
            FROM market_metadata 
            WHERE contract_address = $1
          `;
          
          console.log(`📊 Fetching market metadata for livestream ${livestream.id}:`, marketAddress);
          const marketsResult = await client.query(marketQuery, [marketAddress]);
          
          // Convert market metadata to MarketData format
          livestream.market = marketsResult.rows[0] as MarketData;
          
          console.log(`✅ Found market for livestream ${livestream.id}`);
        } catch (marketError) {
          console.error(`❌ Error fetching market for livestream ${livestream.id}:`, marketError);
          livestream.market = undefined;
        }
      } else {
        livestream.market = undefined;
      }
    }

    console.log(`📈 Returning ${livestreams.length} livestreams with market data`);
    return livestreams;
  } catch (error) {
    console.error('Failed to get livestreams:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Get a livestream by ID
 */
export async function getLivestreamById(id: number): Promise<Livestream | null> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT * FROM livestreams WHERE id = $1',
      [id]
    );
    
    return result.rows[0] || null;
  } catch (error) {
    console.error('Failed to get livestream:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Update a livestream
 */
export async function updateLivestream(id: number, updates: Partial<Livestream>): Promise<Livestream | null> {
  const client = await pool.connect();
  try {
    const setClause: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    // Add updated_at automatically
    updates.updated_at = new Date();

    for (const [key, value] of Object.entries(updates)) {
      if (key !== 'id' && key !== 'created_at' && value !== undefined) {
        setClause.push(`${key} = $${paramIndex}`);
        params.push(value);
        paramIndex++;
      }
    }

    if (setClause.length === 0) {
      throw new Error('No valid fields to update');
    }

    params.push(id);
    const query = `
      UPDATE livestreams 
      SET ${setClause.join(', ')} 
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await client.query(query, params);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Failed to update livestream:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Delete a livestream
 */
export async function deleteLivestream(id: number): Promise<boolean> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'DELETE FROM livestreams WHERE id = $1',
      [id]
    );
    
    return (result.rowCount || 0) > 0;
  } catch (error) {
    console.error('Failed to delete livestream:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Get livestreams by creator wallet address
 */
export async function getLivestreamsByCreator(creatorWalletAddress: string): Promise<Livestream[]> {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT * FROM livestreams WHERE creator_wallet_address = $1 ORDER BY created_at DESC',
      [creatorWalletAddress]
    );
    
    return result.rows;
  } catch (error) {
    console.error('Failed to get livestreams by creator:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Update view count for a livestream
 */
export async function updateViewCount(id: number, increment: number = 1): Promise<Livestream | null> {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      UPDATE livestreams 
      SET view_count = view_count + $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `, [increment, id]);
    
    return result.rows[0] || null;
  } catch (error) {
    console.error('Failed to update view count:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Associate a market with a livestream (1:1 relationship)
 */
export async function associateMarketWithLivestream(
  marketAddress: string, 
  livestreamId: number
): Promise<Livestream | null> {
  const client = await pool.connect();
  try {
    console.log(`🔗 Associating market ${marketAddress} with livestream ${livestreamId}`);
    
    const result = await client.query(
      `UPDATE livestreams 
       SET market_address = $1, updated_at = NOW() 
       WHERE id = $2 
       RETURNING *`,
      [marketAddress, livestreamId]
    );
    
    if (result.rows.length === 0) {
      console.error(`❌ Livestream ${livestreamId} not found`);
      return null;
    }
    
    console.log(`✅ Successfully associated market ${marketAddress} with livestream ${livestreamId}`);
    return result.rows[0];
  } catch (error) {
    console.error('Failed to associate market with livestream:', error);
    throw error;
  } finally {
    client.release();
  }
}
