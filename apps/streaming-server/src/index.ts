import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
import { streamRoutes } from './routes/streams';
import { marketRoutes } from './routes/markets';
import { statsRoutes } from './routes/stats';

dotenv.config();

const app: express.Application = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3001;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(compression());
app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'livestakes-streaming-server'
  });
});

// API Routes
app.use('/api/streams', streamRoutes);
app.use('/api/markets', marketRoutes);
app.use('/api/stats', statsRoutes);

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join-stream', (streamId: string) => {
    socket.join(`stream-${streamId}`);
    console.log(`Client ${socket.id} joined stream ${streamId}`);
  });

  socket.on('leave-stream', (streamId: string) => {
    socket.leave(`stream-${streamId}`);
    console.log(`Client ${socket.id} left stream ${streamId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Streaming server running on port ${PORT}`);
  console.log(`📡 WebSocket server ready for connections`);
});

export { app, io }; 