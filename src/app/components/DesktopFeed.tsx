"use client";
import React, { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { Livestream } from '../lib/livestreamsApi';

interface DesktopFeedProps {
  livestreams: Livestream[];
}

/**
 * Desktop Grid Component with Reduced Height Videos
 */
export default function DesktopFeed({ livestreams }: DesktopFeedProps) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-4">
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
  const { authenticated, login } = usePrivy();
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

  const handleBet = () => {
    if (!authenticated) {
      login();
      return;
    }
    // TODO: Implement betting functionality
    console.log('Betting on project:', id);
    alert('Betting feature coming soon!');
  };



  return (
    <div className="relative">
      <div className="rounded-lg shadow-lg bg-white transition-transform overflow-hidden border-0 hover:-translate-y-1">
        {/* Video/Thumbnail Container - Portrait aspect ratio for bigger videos */}
        <div 
          className="relative w-full aspect-[3/4] overflow-hidden bg-gray-900"
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
        <div className="p-3">
          {/* Title */}
          <div className="mb-2">
            <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2 leading-tight">{title}</h3>
            <p className="text-xs text-gray-500 truncate">
              {creator_wallet_address.slice(0, 6)}...{creator_wallet_address.slice(-4)}
            </p>
          </div>

          {/* Action Button */}
          <button 
            onClick={handleBet}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium text-sm py-2 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <span>🎯</span>
            <span>Bet</span>
          </button>
        </div>
      </div>
    </div>
  );
} 