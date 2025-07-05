import React from 'react';
import Link from 'next/link';

interface LivestakesHeaderProps {
  title?: string;
  showBackButton?: boolean;
  showStats?: boolean;
  totalMarkets?: number;
  liveMarkets?: number;
}

const LivestakesHeader: React.FC<LivestakesHeaderProps> = ({
  title = "LiveStakes",
  showBackButton = false,
  showStats = true,
  totalMarkets = 0,
  liveMarkets = 0,
}) => {
  return (
    <div className="bg-pink-500/90 border-4 border-black rounded-none shadow-window-pixel mb-6">
      <div className="flex items-center justify-between px-3 py-1 bg-pink-600 text-yellow-50 font-pixel">
        <div className="flex items-center gap-4">
          {showBackButton && (
            <Link href="/" className="text-yellow-50 hover:text-yellow-200 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
          )}
          <span className="text-lg font-bold">{title}</span>
        </div>
        
        {showStats && (
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-sm font-bold text-yellow-50">{totalMarkets}</div>
              <div className="text-xs text-yellow-200">Markets</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-green-400">{liveMarkets}</div>
              <div className="text-xs text-yellow-200">Live</div>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse border border-black"></div>
              <span className="text-green-400 text-xs font-bold">LIVE</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Action Buttons */}
      <div className="bg-yellow-50 p-4 text-black font-pixel text-sm">
        <div className="flex items-center gap-3">
          <button className="bg-pink-600 hover:bg-pink-700 text-yellow-50 px-3 py-1 border border-black rounded-none font-pixel uppercase text-xs">
            Create Market
          </button>
          <button className="bg-yellow-400 hover:bg-yellow-300 text-black px-3 py-1 border border-black rounded-none font-pixel uppercase text-xs">
            Browse Categories
          </button>
          <button className="bg-yellow-400 hover:bg-yellow-300 text-black px-3 py-1 border border-black rounded-none font-pixel uppercase text-xs">
            View History
          </button>
        </div>
      </div>
    </div>
  );
};

export default LivestakesHeader; 