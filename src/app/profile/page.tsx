"use client";
import React from "react";
import Profile from "../components/Profile";
import Header from "../components/Header";
import SideNav from "../components/SideNav";

const ProfilePage = () => {
  // Mock user data - in a real app, this would come from an API or context
  const userData = {
    address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    username: "PixelTrader",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    stats: {
      rank: 42,
      totalBets: 156,
      winRate: 68.5,
      totalWinnings: 2450.75,
      activeProjects: 8,
      followers: 234,
      following: 89,
      reputation: 4.8,
    },
    projects: [
      {
        id: 1,
        name: "Solana DeFi Protocol",
        status: "active",
        totalVolume: 125000,
        participants: 89,
        endDate: "2024-02-15",
        prediction: "Will reach $200 by EOY",
        odds: "2.5x",
      },
      {
        id: 2,
        name: "AI Trading Bot",
        status: "ended",
        totalVolume: 89000,
        participants: 156,
        endDate: "2024-01-20",
        prediction: "Will outperform BTC by 50%",
        odds: "3.2x",
        result: "Won",
      },
      {
        id: 3,
        name: "NFT Marketplace Launch",
        status: "scheduled",
        totalVolume: 67000,
        participants: 45,
        endDate: "2024-03-01",
        prediction: "Will sell out in 24h",
        odds: "1.8x",
      },
    ],
    recentBets: [
      { id: 1, project: "Solana DeFi", amount: 500, outcome: "Pending", date: "2024-01-15" },
      { id: 2, project: "AI Trading Bot", amount: 250, outcome: "Won", date: "2024-01-10" },
      { id: 3, project: "NFT Marketplace", amount: 750, outcome: "Lost", date: "2024-01-05" },
    ],
    achievements: [
      { id: 1, title: "Top 50", description: "Ranked Player", icon: "Trophy", unlocked: true },
      { id: 2, title: "10 Wins", description: "Streak Master", icon: "TrendingUp", unlocked: true },
      { id: 3, title: "100+ Bets", description: "Veteran Bettor", icon: "Users", unlocked: true },
      { id: 4, title: "$10k+", description: "High Roller", icon: "Coins", unlocked: true },
    ],
  };

  return (
    <div className="min-h-screen flex font-pixel bg-purple-200">
      {/* Side Navigation */}
      <SideNav />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header />
        
        {/* Profile Content */}
        <main className="flex-1 overflow-y-auto">
          <Profile 
            address={userData.address}
            username={userData.username}
            avatar={userData.avatar}
          />
        </main>
      </div>
    </div>
  );
};

export default ProfilePage; 