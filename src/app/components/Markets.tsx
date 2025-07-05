"use client";
import React from "react";
import {
  TrendingUp,
  Users,
  Calendar,
  Target,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import Button from "./ui/button";

interface Market {
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

interface MarketsProps {
  markets?: Market[];
}

const Markets: React.FC<MarketsProps> = ({ markets = [] }) => {
  const mockMarkets: Market[] = [
    {
      id: 1,
      title: "Solana DeFi Protocol",
      description: "Will the new Solana DeFi protocol reach $200 by end of year? This innovative protocol promises to revolutionize DeFi with its unique approach to liquidity provision.",
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

  const displayMarkets = markets.length > 0 ? markets : mockMarkets;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Clock size={16} className="text-green-600" />;
      case 'ended':
        return <CheckCircle size={16} className="text-blue-600" />;
      case 'scheduled':
        return <AlertCircle size={16} className="text-yellow-600" />;
      default:
        return <Clock size={16} className="text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-sage text-forest';
      case 'ended':
        return 'bg-sky text-navy';
      case 'scheduled':
        return 'bg-butter text-yellow-900';
      default:
        return 'bg-slate text-charcoal';
    }
  };

  const getResultColor = (result?: string) => {
    switch (result) {
      case 'Won':
        return 'bg-sage text-forest';
      case 'Lost':
        return 'bg-rust text-burgundy';
      default:
        return 'bg-butter text-yellow-900';
    }
  };

  return (
    <div className="min-h-screen bg-mauve font-pixel p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-plum border-4 border-black p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Target size={32} className="text-gold" />
              <div>
                <h1 className="text-3xl font-bold text-cream">Prediction Markets</h1>
                <p className="text-butter font-pixel">Bet on the future, win big rewards</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-gold text-2xl font-bold">{displayMarkets.length}</div>
              <div className="text-cream text-sm font-pixel">Active Markets</div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-coral border-4 border-black p-4 text-center">
            <div className="text-pink-600 text-2xl font-bold">
              ${displayMarkets.reduce((sum, market) => sum + (market.totalVolume || 0), 0).toLocaleString()}
            </div>
            <div className="text-cream text-sm font-pixel">Total Volume</div>
          </div>
          <div className="bg-coral border-4 border-black p-4 text-center">
            <div className="text-pink-600 text-2xl font-bold">
              {displayMarkets.filter(m => m.status === 'active').length}
            </div>
            <div className="text-cream text-sm font-pixel">Active Markets</div>
          </div>
          <div className="bg-coral border-4 border-black p-4 text-center">
            <div className="text-pink-600 text-2xl font-bold">
              {displayMarkets.reduce((sum, market) => sum + (market.participants || 0), 0)}
            </div>
            <div className="text-cream text-sm font-pixel">Total Participants</div>
          </div>
          <div className="bg-coral border-4 border-black p-4 text-center">
            <div className="text-pink-600 text-2xl font-bold">
              {displayMarkets.filter(m => m.result === 'Won').length}
            </div>
            <div className="text-cream text-sm font-pixel">Completed Bets</div>
          </div>
        </div>

        {/* Markets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayMarkets.map((market) => (
            <div key={market.id} className="bg-periwinkle border-4 border-black p-6 hover:-translate-y-1 transition-transform">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-cream flex-1 mr-2">{market.title}</h3>
                <div className="flex items-center gap-2">
                  {getStatusIcon(market.status)}
                  <span className={`px-2 py-1 text-xs font-pixel border-2 border-black ${getStatusColor(market.status)}`}>
                    {market.status}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-butter text-sm mb-4 line-clamp-3">{market.description}</p>

              {/* Prediction */}
              {market.prediction && (
                <div className="bg-cream border-2 border-black p-3 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target size={16} className="text-purple-600" />
                    <span className="font-bold text-plum text-sm">Prediction:</span>
                  </div>
                  <p className="text-purple-700 text-sm font-pixel">{market.prediction}</p>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-cream border-2 border-black p-2 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <DollarSign size={14} className="text-purple-600" />
                    <span className="text-plum font-bold text-sm">Volume</span>
                  </div>
                  <div className="text-purple-700 text-xs font-pixel">
                    ${market.totalVolume?.toLocaleString() || '0'}
                  </div>
                </div>
                <div className="bg-cream border-2 border-black p-2 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Users size={14} className="text-purple-600" />
                    <span className="text-plum font-bold text-sm">Participants</span>
                  </div>
                  <div className="text-purple-700 text-xs font-pixel">
                    {market.participants || 0}
                  </div>
                </div>
              </div>

              {/* Odds and Category */}
              <div className="flex justify-between items-center mb-4">
                <span className="bg-sage text-forest px-2 py-1 text-xs font-pixel border border-black">
                  {market.odds || 'N/A'}
                </span>
                <span className="bg-sky text-navy px-2 py-1 text-xs font-pixel border border-black">
                  {market.category}
                </span>
              </div>

              {/* Result */}
              {market.result && (
                <div className="mb-4">
                  <span className={`px-2 py-1 text-xs font-pixel border border-black ${getResultColor(market.result)}`}>
                    {market.result}
                  </span>
                </div>
              )}

              {/* Action Button */}
              <Button className="w-full bg-gold hover:bg-butter text-black border-2 border-black font-pixel uppercase tracking-wider">
                {market.status === 'active' ? 'Place Bet' : market.status === 'scheduled' ? 'Get Notified' : 'View Details'}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Markets; 