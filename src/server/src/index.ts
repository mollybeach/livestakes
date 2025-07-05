// @ts-ignore
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

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
initializeDatabase()
  .then(async () => {
    console.log('Database initialized successfully');
    try {
      // Run migrations
      console.log('Running database migrations...');
      await runMigrations();
      console.log('Migrations completed successfully');
    } catch (error) {
      console.error('Migration process failed:', error);
      // We log the error but don't exit the process, allowing the app to continue
    }
  })
  .catch(err => console.error('Failed to initialize database:', err));

// Middleware
app.use(cors());
app.use(express.json());

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

// Start server
const PORT = process.env.PORT || 3334;
server.listen(PORT, () => {
  
  console.log(`Server is running on port ${PORT}`);
}); 