export interface Market {
  id: string;
  title: string;
  team: string;
  odds: string;
  thumbnail: string;
  isLive?: boolean;
  totalBets?: number;
  totalVolume?: string;
  category?: string;
  description?: string;
}

export const sampleMarkets: Market[] = [
  {
    id: "1",
    title: "Fire Island DEX",
    team: "AFOX",
    odds: "1.8×",
    thumbnail: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=400&q=80",
    isLive: true,
    totalBets: 1247,
    totalVolume: "$45.2K",
    category: "DeFi",
    description: "Will Fire Island DEX reach 1000 users by end of week?"
  },
  {
    id: "2",
    title: "Swim",
    team: "DomvXXXYK",
    odds: "3.2×",
    thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&q=80",
    isLive: true,
    totalBets: 892,
    totalVolume: "$23.1K",
    category: "Gaming",
    description: "Will Swim token hit $10K market cap?"
  },
  {
    id: "3",
    title: "Green Room AI",
    team: "EZKKsSf4",
    odds: "5.6×",
    thumbnail: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80",
    isLive: true,
    totalBets: 2156,
    totalVolume: "$67.8K",
    category: "AI",
    description: "Will Green Room AI launch successfully?"
  },
  {
    id: "4",
    title: "Moon Token",
    team: "MoonTeam",
    odds: "2.1×",
    thumbnail: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=400&q=80",
    isLive: false,
    totalBets: 0,
    totalVolume: "$0",
    category: "Crypto",
    description: "Will Moon Token reach the moon?"
  },
  {
    id: "5",
    title: "Pixel Art NFT",
    team: "PixelArtist",
    odds: "4.3×",
    thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&q=80",
    isLive: true,
    totalBets: 3421,
    totalVolume: "$89.5K",
    category: "NFT",
    description: "Will the pixel art collection sell out?"
  },
  {
    id: "6",
    title: "DeFi Protocol",
    team: "DeFiDevs",
    odds: "1.5×",
    thumbnail: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    isLive: true,
    totalBets: 1893,
    totalVolume: "$34.2K",
    category: "DeFi",
    description: "Will the DeFi protocol reach $1M TVL?"
  }
];

export const getMarkets = async (): Promise<Market[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return sampleMarkets;
};

export const getLiveMarkets = async (): Promise<Market[]> => {
  const markets = await getMarkets();
  return markets.filter(market => market.isLive);
};

export const getMarketById = async (id: string): Promise<Market | null> => {
  const markets = await getMarkets();
  return markets.find(market => market.id === id) || null;
};

export const getMarketsByCategory = async (category: string): Promise<Market[]> => {
  const markets = await getMarkets();
  return markets.filter(market => market.category === category);
}; 