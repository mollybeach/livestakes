"use client";

import React, { useState, useEffect } from "react";
import { fetchLivestreamLeaderboardData, LivestreamLeaderboardEntry } from "../lib/contractsApi";
import { mockMarkets } from "../data/markets";
import { mockLivestreams } from "../data/livestreams";

/* --------------------------------------------------------------
   Pixel-style leaderboard with real livestream betting data
   -------------------------------------------------------------- */

interface LeaderboardProps {
  limit?: number;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ limit = 8 }) => {
  const [leaderboardData, setLeaderboardData] = useState<LivestreamLeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMarketId, setSelectedMarketId] = useState<number>(mockMarkets[0]?.id || 0);
  const selectedMarket = mockMarkets.find(m => m.id === selectedMarketId);

  useEffect(() => {
    const loadLeaderboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchLivestreamLeaderboardData(limit);
        const selectedContractAddress = selectedMarket?.contract_address;
        setLeaderboardData(
          selectedContractAddress
            ? data.filter(entry => entry.market_address === selectedContractAddress)
            : []
        );
      } catch (err) {
        console.error('Error loading leaderboard data:', err);
        setError('Failed to load leaderboard data');
      } finally {
        setIsLoading(false);
      }
    };
    loadLeaderboardData();
  }, [limit, selectedMarketId, selectedMarket]);

  const formatAmount = (amount: string) => {
    const num = parseFloat(amount);
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toFixed(1);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600';
      case 'ended':
        return 'text-red-600';
      case 'scheduled':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return '🟢 Live';
      case 'ended':
        return '🔴 Ended';
      case 'scheduled':
        return '🟡 Scheduled';
      default:
        return '⚪ Unknown';
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      hackathon: '🏆',
      gaming: '🎮',
      technology: '💻',
      education: '📚',
      entertainment: '🎬',
      sports: '⚽',
      music: '🎵',
      lifestyle: '🌟',
      news: '📰',
      art: '🎨',
      cooking: '👨‍🍳',
      fitness: '💪',
      travel: '✈️',
      business: '💼',
      comedy: '😂',
      science: '🔬',
      other: '📦',
      general: '📦'
    };
    return icons[category] || '📦';
  };

  return (
    <section className="max-w-lg mx-auto my-8">
      {/* Market Dropdown */}
      <div className="mb-4 flex items-center gap-2">
        <label htmlFor="market-select" className="text-xs font-bold text-purple-800">Select Market:</label>
        <select
          id="market-select"
          value={selectedMarketId}
          onChange={e => setSelectedMarketId(Number(e.target.value))}
          className="border-2 border-black bg-yellow-50 px-2 py-1 rounded-none text-xs"
        >
          {mockMarkets
            .filter(market =>
              mockLivestreams.some(stream => stream.market_address === market.contract_address)
            )
            .map(market => (
              <option key={market.id} value={market.id}>{market.title}</option>
            ))}
        </select>
      </div>
      {/* window shell */}
      <div className="border-4 border-black bg-yellow-300 shadow-window-pixel">
        {/* title-bar */}
        <div className="flex items-center justify-between bg-purple-600 text-yellow-50 px-3 py-1 border-b-4 border-black">
          <span className="text-xs">🏆 LIVESTREAM LEADERBOARD</span>
          <button className="bg-yellow-400 text-black px-1 border border-black leading-none">
            ✕
          </button>
        </div>

        {/* table */}
        <div className="bg-pink-100 p-4 overflow-x-auto">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-sm text-purple-800">Loading livestreams...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-sm text-red-600">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-2 bg-purple-600 text-white px-3 py-1 border-2 border-black text-xs hover:bg-purple-700"
              >
                Retry
              </button>
            </div>
          ) : (
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="text-purple-800 border-b-2 border-black">
                  <th className="py-1">#</th>
                  <th className="py-1">Livestream</th>
                  <th className="py-1 text-right">Volume</th>
                  <th className="py-1 text-right">Bets</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData.map((entry) => (
                  <tr
                    key={entry.livestreamId}
                    className={`border-b border-black ${
                      entry.rank <= 3 ? "bg-yellow-200/60" : entry.rank % 2 ? "bg-purple-200/40" : ""
                    }`}
                  >
                    <td className="py-1 px-1">
                      {entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : entry.rank === 3 ? "🥉" : `#${entry.rank}`}
                    </td>
                    <td className="py-1 px-1">
                      <div className="flex items-center gap-1">
                        <span className="text-lg">{getCategoryIcon(entry.category)}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold truncate" title={entry.title}>
                            {entry.title.length > 25 ? entry.title.slice(0, 25) + '...' : entry.title}
                          </div>
                          <div className="text-xs text-purple-600">
                            by {entry.creatorUsername}
                          </div>
                          <div className={`text-xs ${getStatusColor(entry.status)}`}>
                            {getStatusLabel(entry.status)} • {entry.viewCount} views
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-1 px-1 text-right font-bold">
                      {formatAmount(entry.totalVolume)} FLOW
                    </td>
                    <td className="py-1 px-1 text-right">
                      {entry.totalBets}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          
          {!isLoading && !error && leaderboardData.length === 0 && (
            <div className="text-center py-8">
              <p className="text-sm text-purple-800">No livestreams found</p>
              <p className="text-xs text-purple-600 mt-1">Start streaming to see them on the leaderboard!</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Leaderboard; 