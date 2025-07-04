import { Router, Request, Response } from 'express';
import { Market, Bet } from '../types';

const router: Router = Router();

// Mock data for development
const mockMarkets: Market[] = [
  {
    id: '1',
    streamId: '1',
    question: 'Will Project Alpha win the DeFi prize?',
    description: 'Prediction market for Project Alpha winning the DeFi category',
    status: 'active',
    yesPrice: 0.65,
    noPrice: 0.35,
    totalVolume: 12400,
    totalBets: 45,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    streamId: '1',
    question: 'Will Project Alpha have >1000 users by demo end?',
    description: 'User adoption prediction for Project Alpha',
    status: 'active',
    yesPrice: 0.42,
    noPrice: 0.58,
    totalVolume: 8900,
    totalBets: 32,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const mockBets: Bet[] = [
  {
    id: '1',
    marketId: '1',
    userId: 'user-001',
    outcome: 'yes',
    amount: 100,
    price: 0.65,
    status: 'confirmed',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// GET /api/markets - Get all markets
router.get('/', async (req: Request, res: Response) => {
  try {
    const { streamId, status, limit = '10', offset = '0' } = req.query;
    
    let filteredMarkets = mockMarkets;
    
    if (streamId) {
      filteredMarkets = filteredMarkets.filter(market => market.streamId === streamId);
    }
    
    if (status) {
      filteredMarkets = filteredMarkets.filter(market => market.status === status);
    }
    
    const limitedMarkets = filteredMarkets.slice(
      parseInt(offset as string),
      parseInt(offset as string) + parseInt(limit as string)
    );
    
    res.json({
      success: true,
      data: limitedMarkets,
      pagination: {
        total: filteredMarkets.length,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch markets' }
    });
  }
});

// GET /api/markets/:id - Get market by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const market = mockMarkets.find(m => m.id === id);
    
    if (!market) {
      return res.status(404).json({
        success: false,
        error: { message: 'Market not found' }
      });
    }
    
    return res.json({
      success: true,
      data: market
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch market' }
    });
  }
});

// POST /api/markets - Create new market
router.post('/', async (req: Request, res: Response) => {
  try {
    const { streamId, question, description } = req.body;
    
    if (!streamId || !question || !description) {
      return res.status(400).json({
        success: false,
        error: { message: 'Missing required fields' }
      });
    }
    
    const newMarket: Market = {
      id: Date.now().toString(),
      streamId,
      question,
      description,
      status: 'active',
      yesPrice: 0.5,
      noPrice: 0.5,
      totalVolume: 0,
      totalBets: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    mockMarkets.push(newMarket);
    
    return res.status(201).json({
      success: true,
      data: newMarket
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: { message: 'Failed to create market' }
    });
  }
});

// POST /api/markets/:id/bet - Place a bet
router.post('/:id/bet', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId, outcome, amount } = req.body;
    
    if (!userId || !outcome || !amount) {
      return res.status(400).json({
        success: false,
        error: { message: 'Missing required fields' }
      });
    }
    
    const market = mockMarkets.find(m => m.id === id);
    if (!market) {
      return res.status(404).json({
        success: false,
        error: { message: 'Market not found' }
      });
    }
    
    if (market.status !== 'active') {
      return res.status(400).json({
        success: false,
        error: { message: 'Market is not active' }
      });
    }
    
    const price = outcome === 'yes' ? market.yesPrice : market.noPrice;
    
    const newBet: Bet = {
      id: Date.now().toString(),
      marketId: id,
      userId,
      outcome: outcome as 'yes' | 'no',
      amount: parseFloat(amount),
      price,
      status: 'confirmed',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    mockBets.push(newBet);
    
    // Update market stats
    market.totalVolume += parseFloat(amount);
    market.totalBets += 1;
    market.updatedAt = new Date();
    
    return res.status(201).json({
      success: true,
      data: newBet
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: { message: 'Failed to place bet' }
    });
  }
});

// GET /api/markets/:id/bets - Get bets for a market
router.get('/:id/bets', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { limit = '10', offset = '0' } = req.query;
    
    const marketBets = mockBets.filter(bet => bet.marketId === id);
    
    const limitedBets = marketBets.slice(
      parseInt(offset as string),
      parseInt(offset as string) + parseInt(limit as string)
    );
    
    res.json({
      success: true,
      data: limitedBets,
      pagination: {
        total: marketBets.length,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch bets' }
    });
  }
});

// PUT /api/markets/:id - Update market (e.g., settle)
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, outcome } = req.body;
    
    const marketIndex = mockMarkets.findIndex(m => m.id === id);
    
    if (marketIndex === -1) {
      return res.status(404).json({
        success: false,
        error: { message: 'Market not found' }
      });
    }
    
    const updates: Partial<Market> = {
      updatedAt: new Date()
    };
    
    if (status) updates.status = status;
    if (outcome) updates.outcome = outcome;
    if (status === 'settled') updates.settlementTime = new Date();
    
    mockMarkets[marketIndex] = {
      ...mockMarkets[marketIndex],
      ...updates
    };
    
    return res.json({
      success: true,
      data: mockMarkets[marketIndex]
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: { message: 'Failed to update market' }
    });
  }
});

export { router as marketRoutes }; 