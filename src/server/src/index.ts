// @ts-ignore
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

import { 
  initializeDatabase
} from './database/transactions';
import pool from './database/db';
import { runMigrations } from './database/migrations';

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

// API routes
app.get('/api/health', (req: any, res: any) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'server is running',
  });
});


// Start server
const PORT = process.env.PORT || 3334;
server.listen(PORT, () => {
  
  console.log(`Server is running on port ${PORT}`);
}); 