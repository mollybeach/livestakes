"use client";
import React from 'react';
import { Filter, Search } from 'lucide-react';
import { LIVE_STAKES_LOGO_URL } from '../lib/cloudinary';

interface MobileHeaderProps {
  title?: string;
  showFilters?: boolean;
  onFilterClick?: () => void;
  onSearchClick?: () => void;
}

const MobileHeader = ({ 
  title = "livestakes", 
  showFilters = true,
  onFilterClick,
  onSearchClick 
}: MobileHeaderProps) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-40 bg-pink-600 border-b-4 border-black px-4 py-3 md:hidden shadow-window-pixel">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-cream border-2 border-black rounded-none flex items-center justify-center overflow-hidden shadow-window-pixel">
            <img 
              src={LIVE_STAKES_LOGO_URL}
              alt="LiveStakes Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-yellow-50 font-bold text-sm font-pixel">{title}</span>
        </div>

        {/* Action buttons */}
        {showFilters && (
          <div className="flex items-center gap-3">
            <button
              onClick={onSearchClick}
              className="w-8 h-8 rounded-none bg-yellow-400 border-2 border-black flex items-center justify-center hover:bg-yellow-300 transition-colors shadow-window-pixel"
            >
              <Search size={16} className="text-black" />
            </button>
            <button
              onClick={onFilterClick}
              className="w-8 h-8 rounded-none bg-yellow-400 border-2 border-black flex items-center justify-center hover:bg-yellow-300 transition-colors shadow-window-pixel"
            >
              <Filter size={16} className="text-black" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileHeader; 