// path: server/src/types.ts
export interface MarketDataType {
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
  sponsor?: string;
  website?: string;
  prizes?: any[];
  // Blockchain integration - contract_address is the primary identifier
  contract_address: string;
  question?: string;
  state?: number;
  yes_bets?: string;
  no_bets?: string;
  total_pool?: string;
  total_bettors?: number;
  livestream_ids?: number[];
  transcript?: string;
  created_at?: string;
  updated_at?: string;
}

export interface LivestreamDataType {
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
  avatar: string;
  github_url?: string;
  // References the market's contract_address
  market_address?: string;
}

export interface UserDataType {
  id: number;
  wallet_address: string;
  email?: string;
  username?: string;
  avatar_url?: string;
  github_url?: string;
  bio?: string;
  win_rate?: number;
  total_winnings?: number;
  total_bets?: number;
  total_wins?: number;
  rank?: string;
  rating?: number;
  created_at?: string;
  updated_at?: string;
} 