"use client";
import React, { useState } from 'react';
import { FaWallet } from 'react-icons/fa';

interface VideoInfoOverlayProps {
  title: string;
  description?: string;
  creatorWallet: string;
  streamId: number;
}

export default function VideoInfoOverlay({ 
  title, 
  description, 
  creatorWallet, 
  streamId 
}: VideoInfoOverlayProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Truncate text for compact display
  const truncatedTitle = title.length > 50 ? title.slice(0, 50) + '...' : title;
  const truncatedDesc = description && description.length > 80 ? 
    description.slice(0, 80) + '...' : description;
  
  const shouldShowReadMore = description && description.length > 80;

  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
      {/* Gradient fade overlay - subtle */}
      <div className="h-48 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      
      {/* Content container - positioned above bottom navigation */}
      <div className="absolute bottom-32 md:bottom-8 left-0 right-0 px-4 pr-20 pointer-events-auto">
        <div className="space-y-2">
          {/* Creator info - minimal and transparent */}
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-fuchsia/80 border border-black rounded-none flex items-center justify-center">
              <FaWallet className="text-white text-xs" />
            </div>
            <span className="text-yellow-50 text-xs font-pixel bg-black/50 px-2 py-1 rounded-none">
              @{creatorWallet.slice(0, 6)}...
            </span>
          </div>
          
          {/* Title - transparent background with strong text shadow */}
          <h2 className="text-yellow-50 font-bold text-base leading-tight font-pixel" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.9), 0 0 8px rgba(0,0,0,0.8)'}}>
            {isExpanded ? title : truncatedTitle}
          </h2>
          
          {/* Description - more transparent */}
          {description && (
            <div className="space-y-1">
              <p className="text-white text-sm leading-relaxed" style={{textShadow: '1px 1px 3px rgba(0,0,0,0.9), 0 0 6px rgba(0,0,0,0.7)'}}>
                {isExpanded ? description : truncatedDesc}
              </p>
              
              {shouldShowReadMore && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-yellow-400 text-xs font-pixel hover:text-yellow-300 transition-colors bg-black/60 px-2 py-1 rounded-none border border-yellow-400/50"
                >
                  {isExpanded ? 'Less' : 'More'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 