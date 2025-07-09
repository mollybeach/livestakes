"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { FaHeart, FaCommentDots, FaBullseye, FaWallet } from 'react-icons/fa';
import { Livestream } from '../lib/livestreamsApi';
import VideoInfoOverlay from './VideoInfoOverlay';
import ShareModal from './ShareModal';

interface MobileFeedProps {
  livestreams: Livestream[];
}

/**
 * TikTok-style Feed Component for Mobile with Full Screen Videos and Snap Scrolling
 */
export default function MobileFeed({ livestreams }: MobileFeedProps) {
  const [openComments, setOpenComments] = useState<{ [id: number]: boolean }>({});
  const [likeCounts, setLikeCounts] = useState<{ [id: number]: number }>({});
  const [liked, setLiked] = useState<{ [id: number]: boolean }>({});
  const [commentInputs, setCommentInputs] = useState<{ [id: number]: string }>({});
  const [allComments, setAllComments] = useState<{ [id: number]: { name: string; text: string }[] }>({});
  const [isMuted, setIsMuted] = useState<{ [id: number]: boolean }>({});
  const [currentVideoId, setCurrentVideoId] = useState<number | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState<number | null>(null);
  const videoRefs = useRef<{ [id: number]: HTMLVideoElement | null }>({});
  const containerRefs = useRef<{ [id: number]: HTMLDivElement | null }>({});

  React.useEffect(() => {
    const initialLikes: { [id: number]: number } = {};
    const initialComments: { [id: number]: { name: string; text: string }[] } = {};
    const initialMuted: { [id: number]: boolean } = {};
    livestreams.forEach((stream) => {
      initialLikes[stream.id] = Math.floor(Math.random() * 500) + 10;
      initialComments[stream.id] = [
        { name: 'Alice', text: 'This is awesome!' },
        { name: 'Bob', text: 'Love this stream!' },
        { name: 'Charlie', text: 'So cool!' },
      ];
      initialMuted[stream.id] = false; // Start with sound enabled
    });
    setLikeCounts(initialLikes);
    setAllComments(initialComments);
    setIsMuted(initialMuted);
    
    // Set the first video as current initially
    if (livestreams.length > 0) {
      setCurrentVideoId(livestreams[0].id);
    }
  }, [livestreams]);

  // Intersection Observer to detect which video is currently visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const videoId = parseInt(entry.target.getAttribute('data-video-id') || '0');
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            setCurrentVideoId(videoId);
          }
        });
      },
      {
        threshold: 0.5, // Video needs to be at least 50% visible
        rootMargin: '0px'
      }
    );

    // Observe all video containers
    Object.values(containerRefs.current).forEach((container) => {
      if (container) {
        observer.observe(container);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [livestreams]);

  // Control video playback based on current video
  useEffect(() => {
    Object.entries(videoRefs.current).forEach(([id, video]) => {
      const videoId = parseInt(id);
      if (video) {
        if (videoId === currentVideoId) {
          // Play the current video
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              // If autoplay fails, try muted
              video.muted = true;
              setIsMuted((prev) => ({ ...prev, [videoId]: true }));
              video.play().catch(console.error);
            });
          }
        } else {
          // Pause all other videos
          video.pause();
        }
      }
    });
  }, [currentVideoId]);

  const handleToggleComments = (id: number) => {
    setOpenComments((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleLike = (id: number) => {
    setLikeCounts((prev) => ({ ...prev, [id]: (prev[id] || 0) + (liked[id] ? -1 : 1) }));
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCommentInput = (id: number, value: string) => {
    setCommentInputs((prev) => ({ ...prev, [id]: value }));
  };

  const handleSendComment = (id: number) => {
    const text = commentInputs[id]?.trim();
    if (!text) return;
    setAllComments((prev) => ({
      ...prev,
      [id]: [...(prev[id] || []), { name: 'You', text }],
    }));
    setCommentInputs((prev) => ({ ...prev, [id]: '' }));
  };

  const toggleMute = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newMutedState = !isMuted[id];
    setIsMuted((prev) => ({ ...prev, [id]: newMutedState }));
    
    const video = videoRefs.current[id];
    if (video) {
      video.muted = newMutedState;
    }
  };

  const handleVideoLoadedData = (id: number) => {
    const video = videoRefs.current[id];
    if (video) {
      video.muted = isMuted[id] || false;
      // Don't autoplay here - let the intersection observer control playback
    }
  };

  const handleVideoEnded = (id: number) => {
    // Find the current video index
    const currentIndex = livestreams.findIndex(stream => stream.id === id);
    
    // If there's a next video, scroll to it
    if (currentIndex !== -1 && currentIndex < livestreams.length - 1) {
      const nextVideoId = livestreams[currentIndex + 1].id;
      const nextContainer = containerRefs.current[nextVideoId];
      
      if (nextContainer) {
        nextContainer.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
    // If it's the last video, optionally loop back to first or do nothing
    // For now, we'll just stay on the last video
  };

  const handleShare = (id: number) => {
    setShareModalOpen(id);
  };

  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory scrollbar-hide">
      {livestreams.map((stream, index) => {
        const comments = allComments[stream.id] || [];
        const isCommentsOpen = openComments[stream.id];
        const isCurrentVideo = currentVideoId === stream.id;
        return (
          <div
            key={stream.id}
            ref={(el) => { containerRefs.current[stream.id] = el; }}
            data-video-id={stream.id}
            className="relative w-full h-screen snap-start snap-always bg-black overflow-hidden"
          >
            {/* Full Screen Video/Thumbnail - positioned to avoid bottom nav */}
            {stream.stream_url ? (
              <video
                ref={(el) => { videoRefs.current[stream.id] = el; }}
                src={stream.stream_url}
                className="absolute top-0 left-0 w-full object-contain bg-black"
                style={{ height: 'calc(100vh - 130px)' }}
                muted={isMuted[stream.id] || false}
                playsInline
                preload="metadata"
                onLoadedData={() => handleVideoLoadedData(stream.id)}
                onEnded={() => handleVideoEnded(stream.id)}
              />
            ) : (
              <div className="absolute top-0 left-0 w-full" style={{ height: 'calc(100vh - 130px)' }}>
                <Image
                  src={stream.thumbnail_url || "https://res.cloudinary.com/storagemanagementcontainer/image/upload/v1751729735/live-stakes-icon_cfc7t8.png"}
                  alt={stream.title}
                  fill
                  className="object-contain opacity-80 bg-black"
                  priority={index < 3} // Prioritize loading first 3 videos
                />
              </div>
            )}

            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-black bg-opacity-10 pointer-events-none" />

            {/* Top Status Bar Area (safe area) */}
            <div className="absolute top-0 left-0 right-0 h-12 z-50 pointer-events-none" />

            {/* Play indicator when video is not current */}
            {stream.stream_url && !isCurrentVideo && (
              <div className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none">
                <div className="w-16 h-16 bg-yellow-400 border-4 border-black rounded-none flex items-center justify-center shadow-window-pixel">
                  <svg className="w-8 h-8 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
            )}

            {/* Mute/Unmute Button - only show for current video */}
            {stream.stream_url && isCurrentVideo && (
              <button
                onClick={(e) => toggleMute(stream.id, e)}
                className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-sm border border-white/30 rounded-none flex items-center justify-center hover:bg-black/70 transition-all duration-200 z-40"
              >
                {isMuted[stream.id] ? (
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                )}
              </button>
            )}

            {/* Video Info Overlay with Fade Effect */}
            <VideoInfoOverlay
              title={stream.title}
              description={stream.description}
              creatorWallet={stream.creator_wallet_address}
              streamId={stream.id}
            />

            {/* Right Side Action Buttons */}
            <div className="absolute right-3 bottom-32 z-50 flex flex-col items-center gap-3 pointer-events-auto">
              {/* Like Button */}
              <button
                onClick={() => handleLike(stream.id)}
                className={`flex flex-col items-center transition-all duration-200 ${
                  liked[stream.id] ? 'scale-110' : 'hover:scale-105'
                }`}
              >
                <div className={`w-10 h-10 rounded-none flex items-center justify-center border border-black/60 ${
                  liked[stream.id] ? 'bg-fuchsia/80' : 'bg-white/20 hover:bg-white/30 backdrop-blur-sm'
                }`}>
                  <FaHeart className={`text-lg ${liked[stream.id] ? 'text-white' : 'text-white'}`} />
                </div>
                <span className="text-white text-xs font-pixel mt-1 bg-black/60 px-1 py-0.5 rounded-none" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.8)'}}>
                  {likeCounts[stream.id] || 0}
                </span>
              </button>

              {/* Comment Button */}
              <button
                onClick={() => handleToggleComments(stream.id)}
                className="flex flex-col items-center transition-all duration-200 hover:scale-105"
              >
                <div className="w-10 h-10 rounded-none bg-white/20 backdrop-blur-sm border border-black/60 flex items-center justify-center hover:bg-white/30">
                  <FaCommentDots className="text-white text-lg" />
                </div>
                <span className="text-white text-xs font-pixel mt-1 bg-black/60 px-1 py-0.5 rounded-none" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.8)'}}>
                  {comments.length}
                </span>
              </button>

              {/* Bet Button */}
              <button className="flex flex-col items-center transition-all duration-200 hover:scale-105">
                <div className="w-10 h-10 rounded-none bg-green-600/80 backdrop-blur-sm border border-black/60 flex items-center justify-center hover:bg-green-600/90">
                  <FaBullseye className="text-white text-lg" />
                </div>
                <span className="text-white text-xs font-pixel mt-1 bg-black/60 px-1 py-0.5 rounded-none" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.8)'}}>
                  Bet
                </span>
              </button>

              {/* Share Button */}
              <button 
                onClick={() => handleShare(stream.id)}
                className="flex flex-col items-center transition-all duration-200 hover:scale-105"
              >
                <div className="w-10 h-10 rounded-none bg-pink-600/80 backdrop-blur-sm border border-black/60 flex items-center justify-center hover:bg-pink-600/90">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                  </svg>
                </div>
                <span className="text-white text-xs font-pixel mt-1 bg-black/60 px-1 py-0.5 rounded-none" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.8)'}}>
                  Share
                </span>
              </button>
            </div>

            {/* Comments Modal */}
            {isCommentsOpen && (
              <div className="absolute inset-x-2 bottom-6 top-16 z-50 bg-cream border-4 border-black rounded-none p-4 flex flex-col shadow-window-pixel">
                {/* Header */}
                <div className="flex items-center justify-between mb-4 bg-purple-600 px-3 py-2 border-2 border-black rounded-none shadow-window-pixel -m-4 mb-4">
                  <h3 className="text-yellow-50 font-pixel text-sm font-bold">💬 Comments</h3>
                  <button
                    onClick={() => handleToggleComments(stream.id)}
                    className="w-8 h-8 rounded-none bg-yellow-400 border-2 border-black flex items-center justify-center hover:bg-yellow-300 transition-colors shadow-window-pixel"
                  >
                    <svg className="w-4 h-4 text-black font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Comments List */}
                <div className="flex-1 overflow-y-auto mb-4 space-y-3 bg-periwinkle p-3 border-2 border-black rounded-none">
                  {comments.map((comment, cidx) => (
                    <div key={cidx} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-none bg-fuchsia border-2 border-black flex items-center justify-center flex-shrink-0 shadow-window-pixel">
                        <span className="text-yellow-50 text-xs font-pixel font-bold">
                          {comment.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-purple-900 font-pixel text-xs font-bold">{comment.name}</span>
                          <span className="text-purple-600 text-xs font-pixel">2m</span>
                        </div>
                        <div className="bg-yellow-50 border border-black rounded-none p-2 shadow-window-pixel">
                          <p className="text-purple-900 text-sm font-pixel">{comment.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Comment Input */}
                <form
                  className="flex gap-2"
                  onSubmit={e => { e.preventDefault(); handleSendComment(stream.id); }}
                >
                  <input
                    type="text"
                    value={commentInputs[stream.id] || ''}
                    onChange={e => handleCommentInput(stream.id, e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 bg-yellow-50 border-2 border-black rounded-none px-3 py-2 text-purple-900 placeholder-purple-600 text-sm font-pixel focus:outline-none focus:bg-cream shadow-window-pixel"
                    maxLength={120}
                  />
                  <button
                    type="submit"
                    className="w-12 h-12 rounded-none bg-green-600 border-2 border-black flex items-center justify-center hover:bg-green-700 transition-colors shadow-window-pixel"
                  >
                    <svg className="w-4 h-4 text-yellow-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </form>
              </div>
            )}


          </div>
        );
      })}
      
      {/* Share Modal */}
      {shareModalOpen !== null && (
        <ShareModal
          isOpen={true}
          onClose={() => setShareModalOpen(null)}
          videoTitle={livestreams.find(s => s.id === shareModalOpen)?.title || 'Video'}
          streamId={shareModalOpen}
        />
      )}
    </div>
  );
} 