export interface MarketData {
  id: number;
  title: string;
  description: string;
  creator_wallet_address: string;
  status: 'active' | 'ended' | 'scheduled';
  start_time: string;
  end_time?: string;
  view_count: number;
  category: string;
  totalVolume: number;
  participants: number;
  odds: string;
  prediction: string;
  result?: 'Won' | 'Lost';
}

export const mockMarkets: MarketData[] = [
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
  {
    id: 3,
    title: "NFT Marketplace Launch",
    description: "Will the new NFT marketplace sell out its initial collection within 24 hours of launch? High-profile artists and exclusive drops.",
    creator_wallet_address: "0x3456789012345678901234567890123456789012",
    status: "scheduled",
    start_time: "2024-03-01T12:00:00Z",
    view_count: 0,
    category: "NFT",
    totalVolume: 67000,
    participants: 45,
    odds: "1.8x",
    prediction: "Will sell out in 24h",
  },
  {
    id: 4,
    title: "Gaming Tournament Winner",
    description: "Who will win the upcoming Fortnite tournament? Top players competing for a $100k prize pool with live streaming.",
    creator_wallet_address: "0x4567890123456789012345678901234567890123",
    status: "active",
    start_time: "2024-01-20T18:00:00Z",
    end_time: "2024-02-20T18:00:00Z",
    view_count: 1890,
    category: "Gaming",
    totalVolume: 234000,
    participants: 234,
    odds: "4.1x",
    prediction: "Team Alpha wins",
  },
  {
    id: 5,
    title: "Crypto Exchange Token",
    description: "Will the new exchange token reach $10 within 30 days of launch? Backed by major venture capital firms.",
    creator_wallet_address: "0x5678901234567890123456789012345678901234",
    status: "active",
    start_time: "2024-01-10T00:00:00Z",
    end_time: "2024-02-10T23:59:59Z",
    view_count: 743,
    category: "Crypto",
    totalVolume: 156000,
    participants: 98,
    odds: "2.8x",
    prediction: "Reaches $10 in 30 days",
  },
  {
    id: 6,
    title: "Sports Championship",
    description: "Which team will win the championship? Analysis of current form, head-to-head records, and expert predictions.",
    creator_wallet_address: "0x6789012345678901234567890123456789012345",
    status: "ended",
    start_time: "2024-01-01T00:00:00Z",
    end_time: "2024-01-15T23:59:59Z",
    view_count: 567,
    category: "Sports",
    totalVolume: 89000,
    participants: 123,
    odds: "2.1x",
    prediction: "Team Beta wins",
    result: "Lost",
  },
]; 