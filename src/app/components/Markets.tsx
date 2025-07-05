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
  const displayMarkets = markets;

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