"use client";
import React, { useState } from 'react';
import { Livestream } from '../lib/livestreamsApi';

interface DesktopFeedProps {
  livestreams: Livestream[];
}

/**
 * Desktop Grid Component with Reduced Height Videos
 */
export default function DesktopFeed({ livestreams }: DesktopFeedProps) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 lg:gap-6">
      {livestreams.map((stream) => (
        <div key={stream.id} className="w-full">
          <DesktopStreamCard {...stream} status='live' />
        </div>
      ))}
    </section>
  );
}

/**
 * Desktop-optimized StreamCard with reduced video height
 */
function DesktopStreamCard({ 
  id,
  thumbnail_url,
  title,
  description,
  status,
  view_count,
  category,
  start_time,
  end_time,
  creator_wallet_address,
  stream_url,
  market,
}: {
  id?: number;
  title: string;
  description?: string;
  creator_wallet_address: string;
  stream_url?: string;
  thumbnail_url?: string;
  status: 'scheduled' | 'live' | 'ended';
  start_time?: string;
  end_time?: string;
  view_count?: number;
  category?: string;
  market?: any;
}) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const handleMouseEnter = async () => {
    setIsHovered(true);
    if (videoRef.current && stream_url && isVideoReady && !videoError) {
      videoRef.current.currentTime = 0;
      videoRef.current.muted = isMuted;
      
      try {
        await videoRef.current.play();
      } catch (error) {
        if (!isMuted) {
          try {
            videoRef.current.muted = true;
            setIsMuted(true);
            await videoRef.current.play();
          } catch (fallbackError) {
            setVideoError(true);
          }
        } else {
          setVideoError(true);
        }
      }
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleVideoLoadedData = () => {
    setIsVideoReady(true);
    setVideoError(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.muted = isMuted;
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    if (videoRef.current) {
      videoRef.current.muted = newMutedState;
    }
  };

  const handleVideoError = () => {
    setVideoError(true);
  };

  return (
    <div className="relative">
      <div className="rounded-lg shadow-lg bg-white transition-transform overflow-hidden border-0 hover:-translate-y-1">
        {status === 'live' && (
          <div className="absolute top-2 left-2 z-10 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">
            LIVE
          </div>
        )}
      
        {/* Video/Thumbnail Container - Reduced height aspect ratio */}
        <div 
          className="relative w-full aspect-[16/9] overflow-hidden bg-gray-900"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Video Element */}
          {stream_url ? (
            <video
              ref={videoRef}
              src={stream_url}
              className="absolute inset-0 w-full h-full object-cover"
              muted={isMuted}
              loop
              playsInline
              onError={handleVideoError}
              onLoadedData={handleVideoLoadedData}
              preload="metadata"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="text-4xl mb-2">🎬</div>
                <div className="text-sm">No Video</div>
              </div>
            </div>
          )}

          {/* Error overlay */}
          {videoError && stream_url && (
            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-red-400 to-pink-400 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="text-4xl mb-2">⚠️</div>
                <div className="text-sm">Video Error</div>
              </div>
            </div>
          )}

          {/* Mute/Unmute button */}
          {stream_url && (
            <button
              onClick={toggleMute}
              className="absolute top-2 right-2 w-8 h-8 bg-black bg-opacity-60 hover:bg-opacity-80 rounded-full flex items-center justify-center text-white transition-all duration-200"
            >
              {isMuted ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              )}
            </button>
          )}

          {/* Loading indicator */}
          {stream_url && !videoError && !isVideoReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
              <div className="w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {/* Content below video */}
        <div className="p-4">
          {/* Creator info */}
          <div className="flex items-center gap-3 mb-3">
            <img 
              src="https://randomuser.me/api/portraits/men/32.jpg" 
              alt={title} 
              className="w-8 h-8 rounded-full border border-gray-300" 
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 truncate">
                {creator_wallet_address.slice(0, 6)}...{creator_wallet_address.slice(-4)}
              </p>
              {category && <p className="text-xs text-purple-600 font-medium capitalize">{category}</p>}
            </div>
          </div>

          {/* Title and Description */}
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2 leading-tight">{title}</h3>
            {description && (
              <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">{description}</p>
            )}
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-2 mb-3">
            {typeof view_count === 'number' && (
              <span className="text-xs bg-purple-100 text-purple-700 font-medium px-2 py-1 rounded-full">
                👁️ {view_count}
              </span>
            )}
            {start_time && (
              <span className="text-xs bg-gray-100 text-gray-700 font-medium px-2 py-1 rounded-full">
                {new Date(start_time).toLocaleDateString()}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium text-sm py-2.5 transition-all duration-200 flex items-center justify-center gap-2">
              <span>🎯</span>
              <span>Bet on Project</span>
            </button>
            {id && (
              <button
                className="flex-shrink-0 px-3 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors text-sm flex items-center justify-center"
                title="Associate Market"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 