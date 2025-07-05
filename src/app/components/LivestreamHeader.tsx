import React from 'react';
import Link from 'next/link';

interface LivestreamHeaderProps {
  title?: string;
  showBackButton?: boolean;
  showStats?: boolean;
  totalStreams?: number;
  liveStreams?: number;
}

const LivestreamHeader: React.FC<LivestreamHeaderProps> = ({
  title = "Livestreams",
  showBackButton = false,
  showStats = true,
  totalStreams = 0,
  liveStreams = 0,
}) => {
  return (
    <div className="bg-[#181A20] rounded-xl p-6 mb-6 shadow-lg border border-gray-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showBackButton && (
            <Link href="/" className="text-gray-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
          )}
          <div>
            <h1 className="text-2xl font-bold text-white">{title}</h1>
            <p className="text-gray-400 text-sm">Watch and bet on live streams</p>
          </div>
        </div>
        
        {showStats && (
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{totalStreams}</div>
              <div className="text-xs text-gray-400">Total Streams</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{liveStreams}</div>
              <div className="text-xs text-gray-400">Live Now</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm font-semibold">LIVE</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Action Buttons */}
      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-800">
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
          Start Streaming
        </button>
        <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
          Browse Categories
        </button>
        <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
          View Schedule
        </button>
      </div>
    </div>
  );
};

export default LivestreamHeader; 