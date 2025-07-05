export interface stream {
  id: string;
  title: string;
  team: string;
  odds: string;
  thumbnail: string;
  avatar: string;
  mcap: string;
  ath: string;
  viewers?: number;
  isLive?: boolean;
  totalBets?: number;
  totalVolume?: string;
  category?: string;
  description?: string;
  username: string;
}

export const sampleStreams: stream[] = [
  {
    id: "1",
    title: "Fire Island DEX",
    team: "AFOX",
    odds: "1.8×",
    thumbnail: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=400&q=80",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    mcap: "$4.1K",
    ath: "$4.5K",
    viewers: 1247,
    isLive: true,
    totalBets: 1247,
    totalVolume: "$45.2K",
    category: "DeFi",
    description: "Will Fire Island DEX reach 1000 users by end of week?",
    username: "DomvXXYK"
  },
  {
    id: "2",
    title: "Swim",
    team: "DomvXXXYK",
    odds: "3.2×",
    thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&q=80",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    mcap: "$33.9K",
    ath: "$40.9K",
    viewers: 892,
    isLive: true,
    totalBets: 892,
    totalVolume: "$23.1K",
    category: "Gaming",
    description: "Will Swim token hit $10K stream cap?",
    username: "GkaQ92oy"
  },
  {
    id: "3",
    title: "Green Room AI",
    team: "EZKKsSf4",
    odds: "5.6×",
    thumbnail: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    mcap: "$22.4K",
    ath: "$250.8K",
    viewers: 2156,
    isLive: true,
    totalBets: 2156,
    totalVolume: "$67.8K",
    category: "AI",
    description: "Will Green Room AI launch successfully?",
    username: "4hUjfREs"
  },
  {
    id: "4",
    title: "Moon Token",
    team: "MoonTeam",
    odds: "2.1×",
    thumbnail: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=400&q=80",
    avatar: "https://randomuser.me/api/portraits/men/12.jpg",
    mcap: "$10.3K",
    ath: "$202.6K",
    viewers: 0,
    isLive: false,
    totalBets: 0,
    totalVolume: "$0",
    category: "Crypto",
    description: "Will Moon Token reach the moon?",
    username: "EZkKsSf4"
  },
  {
    id: "5",
    title: "Pixel Art NFT",
    team: "PixelArtist",
    odds: "4.3×",
    thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&q=80",
    avatar: "https://randomuser.me/api/portraits/men/99.jpg",
    mcap: "$5.0K",
    ath: "$6.2K",
    viewers: 3421,
    isLive: true,
    totalBets: 3421,
    totalVolume: "$89.5K",
    category: "NFT",
    description: "Will the pixel art collection sell out?",
    username: "AUjFNfoi"
  },
  {
    id: "6",
    title: "DeFi Protocol",
    team: "DeFiDevs",
    odds: "1.5×",
    thumbnail: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    mcap: "$65.7K",
    ath: "$855.2K",
    viewers: 1893,
    isLive: true,
    totalBets: 1893,
    totalVolume: "$34.2K",
    category: "DeFi",
    description: "Will the DeFi protocol reach $1M TVL?",
    username: "CzYrVYCK5"
  },
  {
    id: "7",
    title: "bunny",
    team: "4pnRiQsm",
    odds: "1.8×",
    thumbnail: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=400&q=80",
    avatar: "https://randomuser.me/api/portraits/men/23.jpg",
    mcap: "$65.7K",
    ath: "$855.2K",
    viewers: 1893,
    isLive: true,
    totalBets: 1893,
    totalVolume: "$34.2K",
    category: "DeFi",
    description: "Will the DeFi protocol reach $1M TVL?",
    username: "4pnRiQsm"
  },
  {
    id: "8",
    title: "kitty",
    team: "osmosis",
    odds: "2.8×",
    thumbnail: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=400&q=80",
    avatar: "https://randomuser.me/api/portraits/men/15.jpg",
    mcap: "$65.7K",
    ath: "$855.2K",
    viewers: 1893,
    isLive: true,
    totalBets: 1893,
    totalVolume: "$34.2K",
    category: "DeFi",
    description: "Will the DeFi protocol reach $1M TVL?",
    username: "1M"
  }
];

export const getStreams = async (): Promise<stream[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return sampleStreams;
};

export const getLivestreams = async (): Promise<stream[]> => {
  const streams = await getStreams();
  return streams.filter(stream => stream.isLive);
};

export const getStreamById = async (id: string): Promise<stream | null> => {
  const streams = await getStreams();
  return streams.find(stream => stream.id === id) || null;
};

export const getStreamsByCategory = async (category: string): Promise<stream[]> => {
  const streams = await getStreams();
  return streams.filter(stream => stream.category === category);
}; 