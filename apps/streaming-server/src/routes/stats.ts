import { Router, Request, Response } from 'express';
import { Stats } from '../types';

const router: Router = Router();

// Mock data for development
const mockStats: Stats = {
  totalStreams: 25,
  activeStreams: 12,
  totalVolume: 45200,
  activeBettors: 1200,
  totalMarkets: 156,
  activeMarkets: 89
};

// GET /api/stats - Get platform statistics
router.get('/', async (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      data: mockStats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch stats' }
    });
  }
});

// GET /api/stats/streams - Get stream statistics
router.get('/streams', async (req: Request, res: Response) => {
  try {
    const streamStats = {
      total: mockStats.totalStreams,
      active: mockStats.activeStreams,
      ended: mockStats.totalStreams - mockStats.activeStreams,
      averageViewers: 234,
      totalViewTime: 45678 // minutes
    };
    
    res.json({
      success: true,
      data: streamStats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch stream stats' }
    });
  }
});

// GET /api/stats/markets - Get market statistics
router.get('/markets', async (req: Request, res: Response) => {
  try {
    const marketStats = {
      total: mockStats.totalMarkets,
      active: mockStats.activeMarkets,
      settled: mockStats.totalMarkets - mockStats.activeMarkets,
      totalVolume: mockStats.totalVolume,
      averageVolume: Math.round(mockStats.totalVolume / mockStats.totalMarkets),
      totalBets: 3456
    };
    
    res.json({
      success: true,
      data: marketStats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch market stats' }
    });
  }
});

// GET /api/stats/users - Get user statistics
router.get('/users', async (req: Request, res: Response) => {
  try {
    const userStats = {
      totalUsers: 3456,
      activeBettors: mockStats.activeBettors,
      newUsersToday: 45,
      averageBetsPerUser: 3.2,
      topBettors: [
        { userId: 'user-001', totalBets: 156, totalVolume: 8900 },
        { userId: 'user-002', totalBets: 134, totalVolume: 7200 },
        { userId: 'user-003', totalBets: 98, totalVolume: 5400 }
      ]
    };
    
    res.json({
      success: true,
      data: userStats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch user stats' }
    });
  }
});

// GET /api/stats/revenue - Get revenue statistics
router.get('/revenue', async (req: Request, res: Response) => {
  try {
    const revenueStats = {
      totalRevenue: 2340,
      revenueToday: 156,
      revenueThisWeek: 890,
      revenueThisMonth: 3450,
      averageRevenuePerMarket: 15.2,
      platformFee: 0.025, // 2.5%
      totalFeesCollected: 2340 * 0.025
    };
    
    res.json({
      success: true,
      data: revenueStats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch revenue stats' }
    });
  }
});

// GET /api/stats/trending - Get trending markets
router.get('/trending', async (req: Request, res: Response) => {
  try {
    const trendingMarkets = [
      {
        id: '1',
        question: 'Will Project Alpha win the DeFi prize?',
        volume: 12400,
        betCount: 45,
        priceChange: 0.15
      },
      {
        id: '2',
        question: 'Will Project Beta have >1000 users by demo end?',
        volume: 8900,
        betCount: 32,
        priceChange: -0.08
      },
      {
        id: '3',
        question: 'Will Project Gamma launch on mainnet this week?',
        volume: 6700,
        betCount: 28,
        priceChange: 0.22
      }
    ];
    
    res.json({
      success: true,
      data: trendingMarkets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch trending markets' }
    });
  }
});

// GET /api/stats/performance - Get platform performance metrics
router.get('/performance', async (req: Request, res: Response) => {
  try {
    const performanceStats = {
      uptime: 99.8,
      averageResponseTime: 145, // ms
      activeConnections: 234,
      totalRequests: 45678,
      errorRate: 0.02, // 2%
      cpuUsage: 23.4,
      memoryUsage: 67.8
    };
    
    res.json({
      success: true,
      data: performanceStats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch performance stats' }
    });
  }
});

export { router as statsRoutes }; 