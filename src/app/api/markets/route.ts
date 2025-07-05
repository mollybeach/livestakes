import { NextRequest, NextResponse } from 'next/server';

interface MarketData {
  id: number;
  title: string;
  description: string;
  creator_wallet_address: string;
  status: 'active' | 'ended' | 'scheduled';
  start_time?: string;
  end_time?: string;
  view_count?: number;
  category: string;
  totalVolume?: number;
  participants?: number;
  odds?: string;
  prediction?: string;
  result?: 'Won' | 'Lost' | 'Pending';
}

export async function GET(request: NextRequest) {
  try {
    // Fetch data from your backend API
    const response = await fetch('http://localhost:3334/api/livestreams', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform livestream data to market data format
    const markets: MarketData[] = data.data?.map((livestream: any) => ({
      id: livestream.id,
      title: livestream.title,
      description: livestream.description || `Prediction market for: ${livestream.title}`,
      creator_wallet_address: livestream.creator_wallet_address,
      status: livestream.status,
      start_time: livestream.start_time,
      end_time: livestream.end_time,
      view_count: livestream.view_count || 0,
      category: livestream.category || 'general',
      totalVolume: Math.floor(Math.random() * 100000) + 10000, // Mock volume for now
      participants: Math.floor(Math.random() * 200) + 20, // Mock participants for now
      odds: `${(Math.random() * 3 + 1).toFixed(1)}x`, // Mock odds for now
      prediction: `Will ${livestream.title.toLowerCase().includes('win') ? 'succeed' : 'reach target'}`,
      result: livestream.status === 'ended' ? (Math.random() > 0.5 ? 'Won' : 'Lost') : undefined,
    })) || [];

    return NextResponse.json({
      success: true,
      data: markets,
      count: markets.length
    });

  } catch (error) {
    console.error('Error fetching markets:', error);
    
    // Fallback to mock data if API is not available
    const mockMarkets: MarketData[] = [
      {
        id: 1,
        title: "Livestakes DeFi Protocol",
        description: "Will the new Livestakes DeFi protocol reach $200 by end of year? This innovative protocol promises to revolutionize DeFi with its unique approach to liquidity provision.",
        creator_wallet_address: "0x1234567890123456789012345678901234567890",
        status: "active",
        start_time: "2024-01-15T10:00:00Z",
        end_time: "2024-12-31T23:59:59Z",
        view_count: 1250,
        category: "DeFi",
        totalVolume: 125000,
        participants: 89,
        odds: "2.5x",
        prediction: "Will reach $200 by EOY",
      },
      {
        id: 2,
        title: "AI Trading Bot Performance",
        description: "Can this AI trading bot outperform Bitcoin by 50% in the next 6 months? Advanced machine learning algorithms vs traditional market analysis.",
        creator_wallet_address: "0x2345678901234567890123456789012345678901",
        status: "ended",
        start_time: "2024-01-01T00:00:00Z",
        end_time: "2024-06-30T23:59:59Z",
        view_count: 892,
        category: "AI/Trading",
        totalVolume: 89000,
        participants: 156,
        odds: "3.2x",
        prediction: "Will outperform BTC by 50%",
        result: "Won",
      },
    ];

    return NextResponse.json({
      success: true,
      data: mockMarkets,
      count: mockMarkets.length
    });
  }
} 