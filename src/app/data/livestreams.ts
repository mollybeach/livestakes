export interface Livestream {
  id?: number;
  title: string;
  description?: string;
  creator_wallet_address: string;
  stream_url?: string;
  thumbnail_url?: string;
  status: 'scheduled' | 'active' | 'ended';
  start_time?: string;
  end_time?: string;
  view_count?: number;
  category?: string;
  created_at?: string;
  updated_at?: string;
}

export const mockLivestreams: Livestream[] = [
  {
    id: 1,
    title: "Epic Fortnite Battle Royale - Road to Victory!",
    description: "Join me as I attempt to get my first Victory Royale of the season! High-stakes gameplay with live betting opportunities.",
    creator_wallet_address: "0x1234567890123456789012345678901234567890",
    stream_url: "https://twitch.tv/epic_gamer",
    thumbnail_url: "https://via.placeholder.com/400x225/6366f1/ffffff?text=LIVE+Fortnite",
    status: "active" as const,
    start_time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    view_count: 1250,
    category: "gaming",
    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Crypto Trading Masterclass LIVE",
    description: "Learning advanced trading strategies while the market is hot! Real-time analysis and predictions.",
    creator_wallet_address: "0x2345678901234567890123456789012345678901",
    stream_url: "https://youtube.com/live/crypto_master",
    thumbnail_url: "https://via.placeholder.com/400x225/8b5cf6/ffffff?text=LIVE+Trading",
    status: "active" as const,
    start_time: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    view_count: 892,
    category: "finance",
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    title: "Cooking Challenge: 30-Minute Gourmet Meal",
    description: "Can I create a restaurant-quality dish in just 30 minutes? You decide the outcome!",
    creator_wallet_address: "0x3456789012345678901234567890123456789012",
    stream_url: "https://twitch.tv/chef_challenge",
    thumbnail_url: "https://via.placeholder.com/400x225/ec4899/ffffff?text=LIVE+Cooking",
    status: "active" as const,
    start_time: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    view_count: 567,
    category: "lifestyle",
    created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 4,
    title: "Late Night Jazz Session",
    description: "Smooth jazz improvisations to end your day. Relaxing vibes with surprise musical moments.",
    creator_wallet_address: "0x4567890123456789012345678901234567890123",
    thumbnail_url: "https://via.placeholder.com/400x225/6366f1/ffffff?text=Jazz+Session",
    status: "ended" as const,
    start_time: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    end_time: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // ended 3 hours ago
    view_count: 1890,
    category: "music",
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 5,
    title: "Tomorrow's Big Tournament Prep",
    description: "Getting ready for the championship match. Strategy discussion and practice rounds.",
    creator_wallet_address: "0x5678901234567890123456789012345678901234",
    thumbnail_url: "https://via.placeholder.com/400x225/8b5cf6/ffffff?text=Tournament+Prep",
    status: "scheduled" as const,
    start_time: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(), // 12 hours from now
    view_count: 0,
    category: "gaming",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 6,
    title: "Art Stream: Digital Illustration Speed Paint",
    description: "Creating a fantasy character from scratch. Watch the magic happen in real-time!",
    creator_wallet_address: "0x6789012345678901234567890123456789012345",
    thumbnail_url: "https://via.placeholder.com/400x225/ec4899/ffffff?text=Art+Stream",
    status: "ended" as const,
    start_time: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    end_time: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    view_count: 743,
    category: "art",
    created_at: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  }
];

export const getLivestreams = async (): Promise<Livestream[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockLivestreams;
};

export const getLivestreamById = async (id: number): Promise<Livestream | null> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockLivestreams.find(livestream => livestream.id === id) || null;
};

export const getLivestreamsByCategory = async (category: string): Promise<Livestream[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockLivestreams.filter(livestream => livestream.category === category);
};

export const getActiveLivestreams = async (): Promise<Livestream[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockLivestreams.filter(livestream => livestream.status === 'active');
};
