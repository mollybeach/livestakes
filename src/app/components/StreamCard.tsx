import React, { useRef, useState, useEffect } from "react";
import Card from "./ui/card";
import Button from "./ui/button";
import CardContent from "./CardContent";
import LiveBadge from "./LiveBadge";
import BettingModal from "./BettingModal";
import BettingIndicator from "./BettingIndicator";
import MarketAssociationModal from "./MarketAssociationModal";
import { MarketData } from "../lib/livestreamsApi";

interface StreamCardProps {
  id?: number;
  title: string;
  description?: string;
  creator_wallet_address: string;
  stream_url?: string;
  thumbnail_url?: string;
  status: 'scheduled' | 'active' | 'ended';
  start_time?: string;
  end_time?: string;
  view_count?: number;
  category?: string;
  tags?: string[];
  transcript?: string;
  market_address?: string;
  market?: MarketData;
  created_at?: string;
  updated_at?: string;
}

const StreamCard: React.FC<StreamCardProps> = ({
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
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isMuted, setIsMuted] = useState(false); // Start with sound on by default
  const [showBettingModal, setShowBettingModal] = useState(false);
  const [showMarketAssociation, setShowMarketAssociation] = useState(false);

  // Pause video when modal opens
  useEffect(() => {
    if ((showBettingModal || showMarketAssociation) && videoRef.current) {
      videoRef.current.pause();
      setIsHovered(false);
    }
  }, [showBettingModal, showMarketAssociation]);

  const handleMouseEnter = async () => {
    // Don't trigger hover effects if any modal is open
    if (showBettingModal || showMarketAssociation) return;
    
    setIsHovered(true);
    if (videoRef.current && stream_url && isVideoReady && !videoError) {
      videoRef.current.currentTime = 0;
      videoRef.current.muted = isMuted;
      
      try {
        // Try to play with current mute setting
        await videoRef.current.play();
      } catch (error) {
        // If autoplay fails (likely due to browser policy), try muted
        if (!isMuted) {
          try {
            videoRef.current.muted = true;
            setIsMuted(true); // Update state to reflect fallback to muted
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
    // Don't trigger hover effects if any modal is open
    if (showBettingModal || showMarketAssociation) return;
    
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleVideoLoadedData = () => {
    setIsVideoReady(true);
    setVideoError(false); // Reset error state when video loads successfully
    // Set to first frame when video loads
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.muted = isMuted; // Respect user's mute preference
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
      <Card className={`rounded-lg shadow-lg bg-white transition-transform overflow-hidden border-0 ${
        (showBettingModal || showMarketAssociation) ? '' : 'hover:-translate-y-1'
      }`}>
        {status === 'active' && <LiveBadge />}
      
      {/* Video/Thumbnail Container - Portrait aspect ratio */}
      <div 
        className={`relative w-full aspect-[9/16] overflow-hidden bg-gray-900 ${
          (showBettingModal || showMarketAssociation) ? 'pointer-events-none' : ''
        }`}
        onMouseEnter={(showBettingModal || showMarketAssociation) ? undefined : handleMouseEnter}
        onMouseLeave={(showBettingModal || showMarketAssociation) ? undefined : handleMouseLeave}
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
          /* Fallback to placeholder if no video */
          <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="text-4xl mb-2">🎬</div>
              <div className="text-sm">No Video</div>
            </div>
          </div>
        )}

        {/* Error overlay (shows on top of video if there's an error) */}
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
            className="absolute top-3 right-3 w-8 h-8 bg-black bg-opacity-60 hover:bg-opacity-80 rounded-full flex items-center justify-center text-white transition-all duration-200"
          >
            {isMuted ? (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                />
              </svg>
            ) : (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                />
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

        {/* Modal overlay - dims video when any modal is open */}
        {(showBettingModal || showMarketAssociation) && (
          <div className="absolute inset-0 bg-black bg-opacity-30 z-10"></div>
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
          {id && <BettingIndicator livestreamId={id} market={market} />}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            onClick={() => setShowBettingModal(true)}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium text-sm py-2.5 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <span>🎯</span>
            <span>Bet on Project</span>
          </Button>
          {id && (
            <button
              onClick={() => setShowMarketAssociation(true)}
              className="px-3 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors text-sm"
              title="Associate Market"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </button>
          )}
        </div>
      </div>

      </Card>

      {/* Betting Modal */}
      {id && (
        <BettingModal
          isOpen={showBettingModal}
          onClose={() => setShowBettingModal(false)}
          livestreamId={id}
          livestreamTitle={title}
          livestreamDescription={description}
          market={market}
        />
      )}

      {/* Market Association Modal */}
      {id && (
        <MarketAssociationModal
          isOpen={showMarketAssociation}
          onClose={() => setShowMarketAssociation(false)}
          livestreamId={id}
          livestreamTitle={title}
          onMarketAssociated={(marketAddress) => {
            console.log('Market associated:', marketAddress);
            // Could trigger a refresh of betting indicator here
          }}
        />
      )}
    </div>
  );
};

export default StreamCard; 