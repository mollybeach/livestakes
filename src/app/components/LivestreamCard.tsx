'use client';

import Image from 'next/image';
import { Livestream, formatLivestreamTime, getStatusColor, incrementViewCount } from '../lib/livestreamsApi';



interface LivestreamCardProps {
  livestream: Livestream;
  onView?: (livestream: Livestream) => void;
}



export default function LivestreamCard({ livestream, onView }: LivestreamCardProps) {
  const handleCardClick = async () => {
    // Increment view count when clicked
    if (livestream.id) {
      try {
        await incrementViewCount(livestream.id);
        if (onView) {
          onView({ ...livestream, view_count: (livestream.view_count || 0) + 1 });
        }
      } catch (error) {
        console.error('Failed to increment view count:', error);
      }
    }
  };

  const statusColor = getStatusColor(livestream.status);
  const isLive = livestream.status === 'active';

  return (
    <div 
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:transform hover:scale-105 cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gray-700">
        {livestream.thumbnail_url ? (
          <Image
            src={livestream.thumbnail_url}
            alt={livestream.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">🎮</div>
              <p className="text-gray-400 text-sm">No thumbnail</p>
            </div>
          </div>
        )}
        
        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${statusColor}`}>
            {isLive && <span className="mr-1">🔴</span>}
            {livestream.status.toUpperCase()}
          </span>
        </div>

        {/* View count */}
        {livestream.view_count !== undefined && livestream.view_count > 0 && (
          <div className="absolute top-3 right-3">
            <span className="bg-black/70 px-2 py-1 rounded-full text-xs text-white">
              👁️ {livestream.view_count}
            </span>
          </div>
        )}

        {/* Live indicator */}
        {isLive && (
          <div className="absolute bottom-3 left-3">
            <div className="bg-red-600 px-2 py-1 rounded text-xs font-semibold text-white animate-pulse">
              LIVE
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
          {livestream.title}
        </h3>
        
        {livestream.description && (
          <p className="text-gray-400 text-sm mb-3 line-clamp-2">
            {livestream.description}
          </p>
        )}

        {/* Creator info */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-2">
              <span className="text-xs text-white">👤</span>
            </div>
            <span className="truncate max-w-[120px]">
              {livestream.creator_wallet_address.slice(0, 6)}...{livestream.creator_wallet_address.slice(-4)}
            </span>
          </div>
          
          {livestream.category && (
            <span className="bg-purple-900/50 px-2 py-1 rounded text-xs">
              {livestream.category}
            </span>
          )}
        </div>

        {/* Timing info */}
        <div className="mt-3 text-xs text-gray-500">
          {livestream.status === 'scheduled' && livestream.start_time && (
            <div>Starts: {formatLivestreamTime(livestream.start_time)}</div>
          )}
          {livestream.status === 'ended' && livestream.end_time && (
            <div>Ended: {formatLivestreamTime(livestream.end_time)}</div>
          )}
          {livestream.status === 'active' && livestream.start_time && (
            <div>Started: {formatLivestreamTime(livestream.start_time)}</div>
          )}
        </div>
      </div>
    </div>
  );
} 
