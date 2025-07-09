"use client";
import React, { useEffect, useState } from "react";
import { getAllLivestreams, Livestream } from '../lib/livestreamsApi';
import MobileHeader from '../components/MobileHeader';
import MobileFeed from '../components/MobileFeed';
import DesktopFeed from '../components/DesktopFeed';

const FeedPage = () => {
  const [livestreams, setLivestreams] = useState<Livestream[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  React.useLayoutEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchLivestreams = async () => {
      try {
        setLoading(true);
        setError(null);
        const allResponse = await getAllLivestreams({ limit: 50 });
        if (allResponse.success && allResponse.data) {
          setLivestreams(allResponse.data);
        }
      } catch (err) {
        setError('Failed to load livestreams');
      } finally {
        setLoading(false);
      }
    };
    fetchLivestreams();
  }, []);

  const handleFilterClick = () => {
    // TODO: Implement filter functionality
    console.log('Filter clicked');
  };

  const handleSearchClick = () => {
    // TODO: Implement search functionality
    console.log('Search clicked');
  };

  return (
    <div className="min-h-screen bg-pink-200 font-pixel">
      {/* Mobile Header - only on mobile */}
      {isMobile && (
        <MobileHeader 
          title="explore"
          showFilters={true}
          onFilterClick={handleFilterClick}
          onSearchClick={handleSearchClick}
        />
      )}

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {/* Responsive Video Display */}
        {!loading && !error && livestreams.length > 0 ? (
          isMobile ? (
            <>
              {/* Mobile Header Space */}
              <div className="h-14 bg-transparent" />
              <MobileFeed livestreams={livestreams} />
            </>
          ) : (
            <div className="p-3 sm:p-4 lg:p-6">
              <h1 className="text-2xl font-bold text-purple-800 mb-6">Explore Livestreams</h1>
              <DesktopFeed livestreams={livestreams} />
            </div>
          )
        ) : (
          <div className={`${isMobile ? 'pt-14' : 'p-3 sm:p-4 lg:p-6'}`}>
            {/* Loading state */}
            {loading && (
              <div className="text-center py-8">
                <div className="text-2xl sm:text-4xl mb-4">🔄</div>
                <p className="text-purple-800 text-sm sm:text-base">Loading livestreams...</p>
              </div>
            )}
            
            {/* Error state */}
            {error && (
              <div className="text-center py-8">
                <div className="text-2xl sm:text-4xl mb-4">⚠️</div>
                <p className="text-red-600 text-sm sm:text-base">{error}</p>
              </div>
            )}
            
            {/* No livestreams state */}
            {!loading && !error && livestreams.length === 0 && (
              <div className="text-center py-8">
                <div className="text-2xl sm:text-4xl mb-4">📺</div>
                <p className="text-purple-800 text-sm sm:text-base">No livestreams found</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default FeedPage; 