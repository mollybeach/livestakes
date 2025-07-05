"use client";
import React, { useState } from "react";
import {
  Wallet,
  Trophy,
  TrendingUp,
  Star,
  Award,
  Target,
  Users,
  Coins,
  Activity,
  Copy
} from "lucide-react";

interface ProfileProps {
  address?: string;
  username?: string;
  avatar?: string;
}

const Profile: React.FC<ProfileProps> = ({ 
  address = "0x1234...5678",
  username = "PixelTrader",
  avatar = "https://randomuser.me/api/portraits/men/32.jpg"
}) => {
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-purple-200 font-pixel p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-pink-600 border-4 border-black p-6 mb-6">
          <div className="flex items-center gap-6">
            <img 
              src={avatar} 
              alt={username} 
              className="w-20 h-20 rounded-full border-4 border-black"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-yellow-50 mb-2">{username}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-yellow-400 text-black px-3 py-1 border-2 border-black">
                  <Wallet size={16} />
                  <span className="font-pixel text-sm">{address}</span>
                  <button 
                    onClick={copyAddress}
                    className="ml-2 hover:bg-yellow-300 transition-colors p-1"
                  >
                    <Copy size={14} />
                  </button>
                </div>
                {copied && (
                  <span className="text-green-400 text-sm font-pixel">Copied!</span>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                <Trophy size={20} className="text-yellow-400" />
                <span className="text-yellow-50 font-pixel">Rank #42</span>
              </div>
              <div className="flex items-center gap-2">
                <Star size={20} className="text-yellow-400" />
                <span className="text-yellow-50 font-pixel">4.8/5.0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-pink-600 border-4 border-black p-4 text-center">
            <div className="text-yellow-400 text-2xl font-bold">156</div>
            <div className="text-yellow-50 text-sm font-pixel">Total Bets</div>
          </div>
          <div className="bg-pink-600 border-4 border-black p-4 text-center">
            <div className="text-yellow-400 text-2xl font-bold">68.5%</div>
            <div className="text-yellow-50 text-sm font-pixel">Win Rate</div>
          </div>
          <div className="bg-pink-600 border-4 border-black p-4 text-center">
            <div className="text-yellow-400 text-2xl font-bold">$2,450.75</div>
            <div className="text-yellow-50 text-sm font-pixel">Total Winnings</div>
          </div>
          <div className="bg-pink-600 border-4 border-black p-4 text-center">
            <div className="text-yellow-400 text-2xl font-bold">8</div>
            <div className="text-yellow-50 text-sm font-pixel">Active Projects</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Projects Section */}
          <div className="bg-pink-600 border-4 border-black p-6">
            <h2 className="text-2xl font-bold text-yellow-50 mb-4 flex items-center gap-2">
              <Target size={24} />
              My Projects
            </h2>
            <div className="space-y-4">
              <div className="bg-purple-50 border-2 border-black p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-purple-900">Solana DeFi Protocol</h3>
                  <span className="px-2 py-1 text-xs font-pixel border-2 border-black bg-green-200 text-green-900">
                    active
                  </span>
                </div>
                <p className="text-sm text-purple-700 mb-2">Will reach $200 by EOY</p>
                <div className="flex justify-between items-center text-xs">
                  <span className="bg-blue-200 text-blue-900 px-2 py-1 border border-black">
                    Volume: $125,000
                  </span>
                  <span className="bg-purple-200 text-purple-900 px-2 py-1 border border-black">
                    89 participants
                  </span>
                  <span className="bg-green-200 text-green-900 px-2 py-1 border border-black">
                    2.5x
                  </span>
                </div>
              </div>
              <div className="bg-purple-50 border-2 border-black p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-purple-900">AI Trading Bot</h3>
                  <span className="px-2 py-1 text-xs font-pixel border-2 border-black bg-gray-200 text-gray-900">
                    ended
                  </span>
                </div>
                <p className="text-sm text-purple-700 mb-2">Will outperform BTC by 50%</p>
                <div className="flex justify-between items-center text-xs">
                  <span className="bg-blue-200 text-blue-900 px-2 py-1 border border-black">
                    Volume: $89,000
                  </span>
                  <span className="bg-purple-200 text-purple-900 px-2 py-1 border border-black">
                    156 participants
                  </span>
                  <span className="bg-green-200 text-green-900 px-2 py-1 border border-black">
                    3.2x
                  </span>
                </div>
                <div className="mt-2">
                  <span className="px-2 py-1 text-xs font-pixel border border-black bg-green-200 text-green-900">
                    Won
                  </span>
                </div>
              </div>
              <div className="bg-purple-50 border-2 border-black p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-purple-900">NFT Marketplace Launch</h3>
                  <span className="px-2 py-1 text-xs font-pixel border-2 border-black bg-yellow-200 text-yellow-900">
                    scheduled
                  </span>
                </div>
                <p className="text-sm text-purple-700 mb-2">Will sell out in 24h</p>
                <div className="flex justify-between items-center text-xs">
                  <span className="bg-blue-200 text-blue-900 px-2 py-1 border border-black">
                    Volume: $67,000
                  </span>
                  <span className="bg-purple-200 text-purple-900 px-2 py-1 border border-black">
                    45 participants
                  </span>
                  <span className="bg-green-200 text-green-900 px-2 py-1 border border-black">
                    1.8x
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-pink-600 border-4 border-black p-6">
            <h2 className="text-2xl font-bold text-yellow-50 mb-4 flex items-center gap-2">
              <Activity size={24} />
              Recent Bets
            </h2>
            <div className="space-y-3">
              <div className="bg-purple-50 border-2 border-black p-3 flex justify-between items-center">
                <div>
                  <div className="font-bold text-purple-900">Solana DeFi</div>
                  <div className="text-xs text-purple-700">2024-01-15</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-purple-900">$500</div>
                  <span className="text-xs px-2 py-1 border border-black bg-yellow-200 text-yellow-900">
                    Pending
                  </span>
                </div>
              </div>
              <div className="bg-purple-50 border-2 border-black p-3 flex justify-between items-center">
                <div>
                  <div className="font-bold text-purple-900">AI Trading Bot</div>
                  <div className="text-xs text-purple-700">2024-01-10</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-purple-900">$250</div>
                  <span className="text-xs px-2 py-1 border border-black bg-green-200 text-green-900">
                    Won
                  </span>
                </div>
              </div>
              <div className="bg-purple-50 border-2 border-black p-3 flex justify-between items-center">
                <div>
                  <div className="font-bold text-purple-900">NFT Marketplace</div>
                  <div className="text-xs text-purple-700">2024-01-05</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-purple-900">$750</div>
                  <span className="text-xs px-2 py-1 border border-black bg-red-200 text-red-900">
                    Lost
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="bg-pink-600 border-4 border-black p-6">
          <h2 className="text-2xl font-bold text-yellow-50 mb-4 flex items-center gap-2">
            <Award size={24} />
            Achievements
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-yellow-400 border-2 border-black p-4 text-center">
              <Trophy size={32} className="mx-auto mb-2 text-black" />
              <div className="font-bold text-black font-pixel">Top 50</div>
              <div className="text-xs text-black">Ranked Player</div>
            </div>
            <div className="bg-yellow-400 border-2 border-black p-4 text-center">
              <TrendingUp size={32} className="mx-auto mb-2 text-black" />
              <div className="font-bold text-black font-pixel">10 Wins</div>
              <div className="text-xs text-black">Streak Master</div>
            </div>
            <div className="bg-yellow-400 border-2 border-black p-4 text-center">
              <Users size={32} className="mx-auto mb-2 text-black" />
              <div className="font-bold text-black font-pixel">100+ Bets</div>
              <div className="text-xs text-black">Veteran Bettor</div>
            </div>
            <div className="bg-yellow-400 border-2 border-black p-4 text-center">
              <Coins size={32} className="mx-auto mb-2 text-black" />
              <div className="font-bold text-black font-pixel">$10k+</div>
              <div className="text-xs text-black">High Roller</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 