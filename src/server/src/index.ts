// @ts-ignore
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { Pool } from 'pg';
import dotenv from 'dotenv';

import { 
  initializeDatabase,
  createLivestream,
  getAllLivestreams,
  getLivestreamById,
  updateLivestream,
  deleteLivestream,
  getLivestreamsByCreator,
  updateViewCount,
  Livestream,
  associateMarketWithLivestream
} from './database/transactions';
import pool from './database/db';
import { runMigrations } from './database/migrations';
import videoUploadRoutes from './routes/videoUpload';
import marketRoutes from './routes/markets';
import marketsMetadataRoutes from './routes/marketsMetadata';
import leaderboardRoutes from './routes/leaderboard';
import { ensureDatabaseExists } from './database/dbInitialization';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['DNT', 'User-Agent', 'X-Requested-With', 'If-Modified-Since', 'Cache-Control', 'Content-Type', 'Range', 'Authorization']
  },
  path: '/api/socket/io/',
  transports: ['websocket'],
  pingInterval: 25000, // 25 seconds
  pingTimeout: 20000, // 20 seconds
  connectTimeout: 20000, // 20 seconds
  cookie: {
    name: 'livestakes_io',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  }
});

// Initialize the database
async function setupDatabase() {
  try {
    await ensureDatabaseExists();
    await runMigrations();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
}

// Initialize database on startup
setupDatabase();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api', videoUploadRoutes);
app.use('/api/markets', marketRoutes);
app.use('/api/markets/metadata', marketsMetadataRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// API routes
app.get('/api/health', (req: any, res: any) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'server is running',
  });
});

// Livestreams API endpoints

// GET /api/livestreams - Get all livestreams with optional filters
app.get('/api/livestreams', async (req: any, res: any) => {
  try {
    const { status, creator_wallet_address, limit, offset } = req.query;
    
    const filters: any = {};
    if (status) filters.status = status;
    if (creator_wallet_address) filters.creator_wallet_address = creator_wallet_address;
    if (limit) filters.limit = parseInt(limit);
    if (offset) filters.offset = parseInt(offset);
    
    const livestreams = await getAllLivestreams(filters);
    res.status(200).json({
      success: true,
      data: livestreams,
      count: livestreams.length
    });
  } catch (error) {
    console.error('Error fetching livestreams:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch livestreams'
    });
  }
});

// GET /api/livestreams/:id - Get a specific livestream by ID
app.get('/api/livestreams/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const livestreamId = parseInt(id);
    
    if (isNaN(livestreamId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid livestream ID'
      });
    }
    
    const livestream = await getLivestreamById(livestreamId);
    
    if (!livestream) {
      return res.status(404).json({
        success: false,
        error: 'Livestream not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: livestream
    });
  } catch (error) {
    console.error('Error fetching livestream:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch livestream'
    });
  }
});

// POST /api/livestreams - Create a new livestream
app.post('/api/livestreams', async (req: any, res: any) => {
  try {
    const {
      title,
      description,
      creator_wallet_address,
      stream_url,
      thumbnail_url,
      status,
      start_time,
      end_time,
      category
    } = req.body;
    
    // Validate required fields
    if (!title || !creator_wallet_address) {
      return res.status(400).json({
        success: false,
        error: 'Title and creator wallet address are required'
      });
    }
    
    // Validate status
    const validStatuses = ['scheduled', 'active', 'ended'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be one of: scheduled, active, ended'
      });
    }
    
    const livestreamData: Omit<Livestream, 'id' | 'created_at' | 'updated_at'> = {
      title,
      description,
      creator_wallet_address,
      stream_url,
      thumbnail_url,
      status: status || 'scheduled',
      start_time: start_time ? new Date(start_time) : undefined,
      end_time: end_time ? new Date(end_time) : undefined,
      view_count: 0,
      category
    };
    
    const newLivestream = await createLivestream(livestreamData);
    
    res.status(201).json({
      success: true,
      data: newLivestream,
      message: 'Livestream created successfully'
    });
  } catch (error) {
    console.error('Error creating livestream:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create livestream'
    });
  }
});

// PUT /api/livestreams/:id - Update a livestream
app.put('/api/livestreams/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const livestreamId = parseInt(id);
    
    if (isNaN(livestreamId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid livestream ID'
      });
    }
    
    const updates = req.body;
    
    // Validate status if provided
    if (updates.status) {
      const validStatuses = ['scheduled', 'active', 'ended'];
      if (!validStatuses.includes(updates.status)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid status. Must be one of: scheduled, active, ended'
        });
      }
    }
    
    // Convert date strings to Date objects
    if (updates.start_time) updates.start_time = new Date(updates.start_time);
    if (updates.end_time) updates.end_time = new Date(updates.end_time);
    
    const updatedLivestream = await updateLivestream(livestreamId, updates);
    
    if (!updatedLivestream) {
      return res.status(404).json({
        success: false,
        error: 'Livestream not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: updatedLivestream,
      message: 'Livestream updated successfully'
    });
  } catch (error) {
    console.error('Error updating livestream:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update livestream'
    });
  }
});

// DELETE /api/livestreams/:id - Delete a livestream
app.delete('/api/livestreams/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const livestreamId = parseInt(id);
    
    if (isNaN(livestreamId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid livestream ID'
      });
    }
    
    const deleted = await deleteLivestream(livestreamId);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Livestream not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Livestream deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting livestream:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete livestream'
    });
  }
});

// GET /api/livestreams/creator/:wallet_address - Get livestreams by creator
app.get('/api/livestreams/creator/:wallet_address', async (req: any, res: any) => {
  try {
    const { wallet_address } = req.params;
    
    const livestreams = await getLivestreamsByCreator(wallet_address);
    
    res.status(200).json({
      success: true,
      data: livestreams,
      count: livestreams.length
    });
  } catch (error) {
    console.error('Error fetching livestreams by creator:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch livestreams by creator'
    });
  }
});

// POST /api/livestreams/:id/view - Increment view count for a livestream
app.post('/api/livestreams/:id/view', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const livestreamId = parseInt(id);
    
    if (isNaN(livestreamId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid livestream ID'
      });
    }
    
    const updatedLivestream = await updateViewCount(livestreamId);
    
    if (!updatedLivestream) {
      return res.status(404).json({
        success: false,
        error: 'Livestream not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: updatedLivestream,
      message: 'View count updated successfully'
    });
  } catch (error) {
    console.error('Error updating view count:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update view count'
    });
  }
});

// POST /api/livestreams/:id/associate-market - Associate a market with a livestream
app.post('/api/livestreams/:id/associate-market', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { market_address } = req.body;
    
    const livestreamId = parseInt(id);
    
    if (isNaN(livestreamId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid livestream ID'
      });
    }
    
    if (!market_address || typeof market_address !== 'string' || !market_address.startsWith('0x')) {
      return res.status(400).json({
        success: false,
        error: 'Valid market address is required'
      });
    }
    
    const updatedLivestream = await associateMarketWithLivestream(market_address, livestreamId);
    
    if (!updatedLivestream) {
      return res.status(404).json({
        success: false,
        error: 'Livestream not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: updatedLivestream,
      message: 'Market associated successfully'
    });
  } catch (error) {
    console.error('Error associating market with livestream:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to associate market with livestream'
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// User Management Routes
app.get('/api/users/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const client = await pool.connect();
    
    const result = await client.query(
      'SELECT * FROM users WHERE wallet_address = $1',
      [walletAddress]
    );
    
    client.release();
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ success: true, user: result.rows[0] });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const { wallet_address, email, username, avatar_url, github_url, bio } = req.body;
    const client = await pool.connect();
    
    // Check if user already exists
    const existingUser = await client.query(
      'SELECT * FROM users WHERE wallet_address = $1',
      [wallet_address]
    );
    
    let finalUsername = username;
    
    // If user doesn't exist and no username provided, generate default username
    if (existingUser.rows.length === 0 && !username) {
      // Get the next user ID to use as default username
      const nextIdResult = await client.query(
        'SELECT COALESCE(MAX(id), 0) + 1 as next_id FROM users'
      );
      const nextId = nextIdResult.rows[0].next_id;
      finalUsername = `user_${nextId}`;
    }
    
    const result = await client.query(
      `INSERT INTO users (wallet_address, email, username, avatar_url, github_url, bio) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       ON CONFLICT (wallet_address) 
       DO UPDATE SET 
         email = EXCLUDED.email,
         username = COALESCE(EXCLUDED.username, users.username),
         avatar_url = EXCLUDED.avatar_url,
         github_url = EXCLUDED.github_url,
         bio = EXCLUDED.bio,
         updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [wallet_address, email, finalUsername, avatar_url, github_url, bio]
    );
    
    client.release();
    
    res.json({ success: true, user: result.rows[0] });
  } catch (error) {
    console.error('Error creating/updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/users/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const { email, username, avatar_url, github_url, bio } = req.body;
    const client = await pool.connect();
    
    const result = await client.query(
      `UPDATE users 
       SET email = $1, username = $2, avatar_url = $3, github_url = $4, bio = $5, updated_at = CURRENT_TIMESTAMP
       WHERE wallet_address = $6
       RETURNING *`,
      [email, username, avatar_url, github_url, bio, walletAddress]
    );
    
    client.release();
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ success: true, user: result.rows[0] });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Likes Routes
app.post('/api/likes', async (req, res) => {
  try {
    const { user_id, livestream_id } = req.body;
    const client = await pool.connect();
    
    const result = await client.query(
      `INSERT INTO likes (user_id, livestream_id) 
       VALUES ($1, $2) 
       ON CONFLICT (user_id, livestream_id) 
       DO NOTHING
       RETURNING *`,
      [user_id, livestream_id]
    );
    
    client.release();
    
    if (result.rows.length === 0) {
      return res.json({ success: true, message: 'Already liked' });
    }
    
    res.json({ success: true, like: result.rows[0] });
  } catch (error) {
    console.error('Error creating like:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/likes/:userId/:livestreamId', async (req, res) => {
  try {
    const { userId, livestreamId } = req.params;
    const client = await pool.connect();
    
    const result = await client.query(
      'DELETE FROM likes WHERE user_id = $1 AND livestream_id = $2 RETURNING *',
      [userId, livestreamId]
    );
    
    client.release();
    
    res.json({ success: true, message: 'Like removed' });
  } catch (error) {
    console.error('Error removing like:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/livestreams/:livestreamId/likes', async (req, res) => {
  try {
    const { livestreamId } = req.params;
    const client = await pool.connect();
    
    const result = await client.query(
      `SELECT l.*, u.username, u.avatar_url 
       FROM likes l 
       JOIN users u ON l.user_id = u.id 
       WHERE l.livestream_id = $1 
       ORDER BY l.created_at DESC`,
      [livestreamId]
    );
    
    client.release();
    
    res.json({ success: true, likes: result.rows });
  } catch (error) {
    console.error('Error fetching likes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Comments Routes
app.post('/api/comments', async (req, res) => {
  try {
    const { user_id, livestream_id, content, parent_comment_id } = req.body;
    const client = await pool.connect();
    
    const result = await client.query(
      `INSERT INTO comments (user_id, livestream_id, content, parent_comment_id) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [user_id, livestream_id, content, parent_comment_id]
    );
    
    client.release();
    
    res.json({ success: true, comment: result.rows[0] });
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/livestreams/:livestreamId/comments', async (req, res) => {
  try {
    const { livestreamId } = req.params;
    const client = await pool.connect();
    
    const result = await client.query(
      `SELECT c.*, u.username, u.avatar_url 
       FROM comments c 
       JOIN users u ON c.user_id = u.id 
       WHERE c.livestream_id = $1 
       ORDER BY c.created_at DESC`,
      [livestreamId]
    );
    
    client.release();
    
    res.json({ success: true, comments: result.rows });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Bets Routes
app.post('/api/bets', async (req, res) => {
  try {
    const { user_id, market_address, livestream_id, amount, outcome } = req.body;
    const client = await pool.connect();
    
    const result = await client.query(
      `INSERT INTO bets (user_id, market_address, livestream_id, amount, outcome) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [user_id, market_address, livestream_id, amount, outcome]
    );
    
    client.release();
    
    res.json({ success: true, bet: result.rows[0] });
  } catch (error) {
    console.error('Error creating bet:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/users/:userId/bets', async (req, res) => {
  try {
    const { userId } = req.params;
    const client = await pool.connect();
    
    const result = await client.query(
      `SELECT b.*, m.title as market_title, l.title as livestream_title 
       FROM bets b 
       LEFT JOIN markets m ON b.market_address = m.contract_address 
       LEFT JOIN livestreams l ON b.livestream_id = l.id 
       WHERE b.user_id = $1 
       ORDER BY b.created_at DESC`,
      [userId]
    );
    
    client.release();
    
    res.json({ success: true, bets: result.rows });
  } catch (error) {
    console.error('Error fetching user bets:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Projects Routes
app.post('/api/projects', async (req, res) => {
  try {
    const { user_id, title, description, category, tags, github_url, demo_url } = req.body;
    const client = await pool.connect();
    
    const result = await client.query(
      `INSERT INTO projects (user_id, title, description, category, tags, github_url, demo_url) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [user_id, title, description, category, JSON.stringify(tags), github_url, demo_url]
    );
    
    client.release();
    
    res.json({ success: true, project: result.rows[0] });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/users/:userId/projects', async (req, res) => {
  try {
    const { userId } = req.params;
    const client = await pool.connect();
    
    const result = await client.query(
      'SELECT * FROM projects WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    
    client.release();
    
    res.json({ success: true, projects: result.rows });
  } catch (error) {
    console.error('Error fetching user projects:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User Stats Routes
app.get('/api/users/:userId/stats', async (req, res) => {
  try {
    const { userId } = req.params;
    const client = await pool.connect();
    
    // Get user stats
    const userResult = await client.query(
      'SELECT win_rate, total_winnings, total_bets, total_wins, rank, rating FROM users WHERE id = $1',
      [userId]
    );
    
    // Get recent bets
    const betsResult = await client.query(
      'SELECT * FROM bets WHERE user_id = $1 ORDER BY created_at DESC LIMIT 10',
      [userId]
    );
    
    // Get user projects
    const projectsResult = await client.query(
      'SELECT * FROM projects WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    
    // Get user livestreams
    const livestreamsResult = await client.query(
      'SELECT * FROM livestreams WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    
    client.release();
    
    const stats = {
      ...userResult.rows[0],
      recentBets: betsResult.rows,
      projects: projectsResult.rows,
      livestreams: livestreamsResult.rows
    };
    
    res.json({ success: true, stats });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
const PORT = process.env.PORT || 3334;
server.listen(PORT, () => {
  
  console.log(`Server is running on port ${PORT}`);
}); 