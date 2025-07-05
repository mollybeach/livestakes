export interface ProfileData {
  address: string;
  username: string;
  avatar: string;
  githubUrl: string;
  rank: string;
  rating: string;
  stats: {
    totalBets: number;
    winRate: string;
    totalWinnings: string;
    activeProjects: number;
  };
  liveStreams: LiveStream[];
  recentBets: RecentBet[];
  projects: Project[];
  achievements: Achievement[];
}

export interface LiveStream {
  id: number;
  title: string;
  status: 'active' | 'ended' | 'scheduled';
  viewers: number;
  duration: string;
  category: string;
  thumbnail: string;
}

export interface RecentBet {
  id: number;
  title: string;
  date: string;
  amount: string;
  status: 'pending' | 'won' | 'lost';
}

export interface Project {
  id: number;
  title: string;
  description: string;
  status: 'active' | 'ended' | 'scheduled';
  volume: string;
  participants: number;
  odds: string;
  result?: 'won' | 'lost';
}

export interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export const mockProfileData: ProfileData = {
  address: "0x1234...5678",
  username: "PixelTrader",
  avatar: "https://res.cloudinary.com/storagemanagementcontainer/image/upload/v1751747169/default-avatar_ynttwb.png",
  githubUrl: "https://github.com/pixeltrader",
  rank: "Rank #42",
  rating: "4.8/5.0",
  stats: {
    totalBets: 156,
    winRate: "68.5%",
    totalWinnings: "$2,450.75",
    activeProjects: 8,
  },
  liveStreams: [
    {
      id: 1,
      title: "Crypto Trading Masterclass LIVE",
      status: "active",
      viewers: 1250,
      duration: "2h 15m",
      category: "Trading",
      thumbnail: "https://via.placeholder.com/300x200/6366f1/ffffff?text=LIVE+Trading",
    },
    {
      id: 2,
      title: "DeFi Protocol Analysis",
      status: "ended",
      viewers: 892,
      duration: "1h 30m",
      category: "DeFi",
      thumbnail: "https://via.placeholder.com/300x200/8b5cf6/ffffff?text=DeFi+Analysis",
    },
    {
      id: 3,
      title: "NFT Market Predictions",
      status: "scheduled",
      viewers: 0,
      duration: "0m",
      category: "NFT",
      thumbnail: "https://via.placeholder.com/300x200/ec4899/ffffff?text=NFT+Predictions",
    },
  ],
  recentBets: [
    {
      id: 1,
      title: "Solana DeFi",
      date: "2024-01-15",
      amount: "$500",
      status: "pending",
    },
    {
      id: 2,
      title: "AI Trading Bot",
      date: "2024-01-10",
      amount: "$250",
      status: "won",
    },
    {
      id: 3,
      title: "NFT Marketplace",
      date: "2024-01-05",
      amount: "$750",
      status: "lost",
    },
  ],
  projects: [
    {
      id: 1,
      title: "Solana DeFi Protocol",
      description: "Will reach $200 by EOY",
      status: "active",
      volume: "$125,000",
      participants: 89,
      odds: "2.5x",
    },
    {
      id: 2,
      title: "AI Trading Bot",
      description: "Will outperform BTC by 50%",
      status: "ended",
      volume: "$89,000",
      participants: 156,
      odds: "3.2x",
      result: "won",
    },
    {
      id: 3,
      title: "NFT Marketplace Launch",
      description: "Will sell out in 24h",
      status: "scheduled",
      volume: "$67,000",
      participants: 45,
      odds: "1.8x",
    },
  ],
  achievements: [
    {
      id: 1,
      title: "Top 50",
      description: "Ranked Player",
      icon: "Trophy",
    },
    {
      id: 2,
      title: "10 Wins",
      description: "Streak Master",
      icon: "TrendingUp",
    },
    {
      id: 3,
      title: "100+ Bets",
      description: "Veteran Bettor",
      icon: "Users",
    },
    {
      id: 4,
      title: "$10k+",
      description: "High Roller",
      icon: "Coins",
    },
  ],
};
