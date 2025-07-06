import { Router } from 'express';
import pool from '../database/db';
import { Contract, JsonRpcProvider } from 'ethers';

const router = Router();

// Livestream leaderboard entry interface
interface LivestreamLeaderboardEntry {
  rank: number;
  livestreamId: number;
  title: string;
  creatorUsername: string;
  totalBets: number;
  totalVolume: string;
  category: string;
  status: string;
  viewCount: number;
  createdAt: number;
  thumbnailUrl: string;
}

// Market leaderboard entry interface
interface MarketLeaderboardEntry {
  rank: number;
  marketAddress: string;
  question: string;
  totalPool: string;
  totalBettors: number;
  category: string;
  state: number; // 0=Open, 1=Closed, 2=Resolved
  createdAt: number;
  livestreamTitles: string[];
}

// Get livestream leaderboard data based on betting activity
router.get('/livestreams', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    
    const client = await pool.connect();
    
    try {
      // Get livestreams with betting data
      const result = await client.query(`
        SELECT 
          l.id,
          l.title,
          l.category,
          l.status,
          l.view_count,
          l.thumbnail_url,
          l.created_at,
          l.creator_wallet_address,
          u.username as creator_username,
          COALESCE(COUNT(DISTINCT b.id), 0) as total_bets,
          COALESCE(SUM(CAST(b.amount AS DECIMAL)), 0) as total_volume
        FROM livestreams l
        LEFT JOIN users u ON l.creator_wallet_address = u.wallet_address
        LEFT JOIN bets b ON l.id = b.livestream_id
        GROUP BY l.id, l.title, l.category, l.status, l.view_count, l.thumbnail_url, l.created_at, l.creator_wallet_address, u.username
        ORDER BY total_volume DESC, total_bets DESC, l.view_count DESC
        LIMIT $1
      `, [limit]);
      
      const leaderboardData: LivestreamLeaderboardEntry[] = result.rows.map((row, index) => ({
        rank: index + 1,
        livestreamId: row.id,
        title: row.title,
        creatorUsername: row.creator_username || 'Anonymous',
        totalBets: parseInt(row.total_bets),
        totalVolume: parseFloat(row.total_volume).toFixed(2),
        category: row.category || 'general',
        status: row.status,
        viewCount: row.view_count,
        createdAt: new Date(row.created_at).getTime(),
        thumbnailUrl: row.thumbnail_url
      }));
      
      res.json({
        success: true,
        leaderboard: leaderboardData
      });
      
    } finally {
      client.release();
    }
    
  } catch (error) {
    console.error('Error fetching livestream leaderboard data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch livestream leaderboard data'
    });
  }
});

// Get market leaderboard data based on betting activity (keeping for backward compatibility)
router.get('/markets', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    
    // Get all markets from database
    const client = await pool.connect();
    
    try {
      // Get all market addresses with metadata
      const marketsResult = await client.query(`
        SELECT 
          contract_address,
          question,
          category,
          created_at,
          description
        FROM market_metadata 
        WHERE contract_address IS NOT NULL
        ORDER BY created_at DESC
        LIMIT $1
      `, [limit]);
      
      const marketAddresses = marketsResult.rows;
      
      if (marketAddresses.length === 0) {
        // Return mock data if no markets exist
        const mockData = generateMockMarketLeaderboardData(limit);
        return res.json({
          success: true,
          leaderboard: mockData
        });
      }
      
      // Aggregate market data from blockchain
      const leaderboardData = await aggregateMarketData(marketAddresses, limit);
      
      res.json({
        success: true,
        leaderboard: leaderboardData
      });
      
    } finally {
      client.release();
    }
    
  } catch (error) {
    console.error('Error fetching market leaderboard data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch market leaderboard data'
    });
  }
});

// Get provider for blockchain interactions
function getProvider() {
  const rpcUrl = process.env.FLOW_RPC_URL || 'https://testnet.evm.nodes.onflow.org';
  return new JsonRpcProvider(rpcUrl);
}

// Aggregate market data from blockchain
async function aggregateMarketData(marketAddresses: any[], limit: number): Promise<MarketLeaderboardEntry[]> {
  const provider = getProvider();
  const leaderboardEntries: MarketLeaderboardEntry[] = [];
  
  // For now, we'll use mock data since blockchain integration is complex
  // In a real implementation, you would iterate through markets and fetch real data
  console.log(`Found ${marketAddresses.length} markets, generating mock leaderboard data`);
  
  // Generate mock data for demonstration
  const mockData = generateMockMarketLeaderboardData(limit);
  return mockData;
}

// Generate mock market leaderboard data for development/testing
function generateMockMarketLeaderboardData(limit: number): MarketLeaderboardEntry[] {
  const mockData: MarketLeaderboardEntry[] = [];
  
  for (let i = 0; i < limit; i++) {
    const totalPool = (Math.random() * 1000 + 50).toFixed(2);
    const totalBettors = Math.floor(Math.random() * 50) + 5;
    const categories = ['hackathon', 'gaming', 'technology', 'education', 'entertainment'];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const states = [0, 1, 2]; // Open, Closed, Resolved
    const state = states[Math.floor(Math.random() * states.length)];
    
    mockData.push({
      rank: i + 1,
      marketAddress: `0x${Math.random().toString(16).substring(2, 42)}`,
      question: `Will this ${category} project win the hackathon?`,
      totalPool,
      totalBettors,
      category,
      state,
      createdAt: Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000),
      livestreamTitles: [`${category.charAt(0).toUpperCase() + category.slice(1)} Project ${i + 1}`]
    });
  }
  
  return mockData.sort((a, b) => parseFloat(b.totalPool) - parseFloat(a.totalPool));
}

export default router; 