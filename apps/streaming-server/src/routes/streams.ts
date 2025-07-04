import { Router, Request, Response } from 'express';
import { Stream } from '../types';

const router: Router = Router();

// Mock data for development
const mockStreams: Stream[] = [
  {
    id: '1',
    title: 'Project Alpha Demo',
    description: 'DeFi protocol for cross-chain liquidity',
    projectId: 'alpha-001',
    status: 'live',
    startTime: new Date(),
    viewerCount: 156,
    webrtcUrl: 'webrtc://stream1.example.com',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    title: 'Project Beta Presentation',
    description: 'NFT marketplace with AI curation',
    projectId: 'beta-002',
    status: 'scheduled',
    startTime: new Date(Date.now() + 3600000), // 1 hour from now
    viewerCount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// GET /api/streams - Get all streams
router.get('/', async (req: Request, res: Response) => {
  try {
    const { status, limit = '10', offset = '0' } = req.query;
    
    let filteredStreams = mockStreams;
    
    if (status) {
      filteredStreams = filteredStreams.filter(stream => stream.status === status);
    }
    
    const limitedStreams = filteredStreams.slice(
      parseInt(offset as string),
      parseInt(offset as string) + parseInt(limit as string)
    );
    
    res.json({
      success: true,
      data: limitedStreams,
      pagination: {
        total: filteredStreams.length,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch streams' }
    });
  }
});

// GET /api/streams/:id - Get stream by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const stream = mockStreams.find(s => s.id === id);
    
    if (!stream) {
      return res.status(404).json({
        success: false,
        error: { message: 'Stream not found' }
      });
    }
    
    return res.json({
      success: true,
      data: stream
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch stream' }
    });
  }
});

// POST /api/streams - Create new stream
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, description, projectId, startTime } = req.body;
    
    if (!title || !description || !projectId) {
      return res.status(400).json({
        success: false,
        error: { message: 'Missing required fields' }
      });
    }
    
    const newStream: Stream = {
      id: Date.now().toString(),
      title,
      description,
      projectId,
      status: 'scheduled',
      startTime: new Date(startTime || Date.now()),
      viewerCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    mockStreams.push(newStream);
    
    return res.status(201).json({
      success: true,
      data: newStream
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: { message: 'Failed to create stream' }
    });
  }
});

// PUT /api/streams/:id - Update stream
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const streamIndex = mockStreams.findIndex(s => s.id === id);
    
    if (streamIndex === -1) {
      return res.status(404).json({
        success: false,
        error: { message: 'Stream not found' }
      });
    }
    
    mockStreams[streamIndex] = {
      ...mockStreams[streamIndex],
      ...updates,
      updatedAt: new Date()
    };
    
    return res.json({
      success: true,
      data: mockStreams[streamIndex]
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: { message: 'Failed to update stream' }
    });
  }
});

// DELETE /api/streams/:id - Delete stream
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const streamIndex = mockStreams.findIndex(s => s.id === id);
    
    if (streamIndex === -1) {
      return res.status(404).json({
        success: false,
        error: { message: 'Stream not found' }
      });
    }
    
    mockStreams.splice(streamIndex, 1);
    
    return res.json({
      success: true,
      message: 'Stream deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: { message: 'Failed to delete stream' }
    });
  }
});

export { router as streamRoutes }; 