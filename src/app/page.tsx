"use client";
// path: pages/index.tsx    /* or app/page.tsx if you're on the App Router */
import React, { useState, useLayoutEffect } from "react";
import DashboardHeader from "./components/DashboardHeader";
import MobileHeader from "./components/MobileHeader";
import { Livestream, getActiveLivestreams, getAllLivestreams } from './lib/livestreamsApi';
import HomeModal, { HomeModalContent } from "./components/HomeModal";
import MobileFeed from "./components/MobileFeed";
import DesktopFeed from "./components/DesktopFeed";
import LoadingScreen from "./components/LoadingScreen";

/**
 * Home page – responsive video display
 */
export default function Home() {
  const [modalOpen, setModalOpen] = useState(false); // Start as false, will be set based on localStorage
  const [liveLivestreams, setLiveLivestreams] = React.useState<Livestream[]>([]);
  const [exploreLivestreams, setExploreLivestreams] = React.useState<Livestream[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isMobile, setIsMobile] = React.useState(false);
  const [showLoading, setShowLoading] = React.useState(true);

  // Detect mobile screen size
  React.useLayoutEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Check if user has already accepted disclaimer
  React.useEffect(() => {
    const hasAcceptedDisclaimer = localStorage.getItem('livestakes-disclaimer-accepted');
    if (!hasAcceptedDisclaimer) {
      setModalOpen(true);
    }
  }, []);

  React.useEffect(() => {
    const fetchLivestreams = async () => {
      try {
        setLoading(true);
        setShowLoading(true);
        setError(null);
        
        // Start minimum loading time (ensure users see the nice loading screen)
        const minLoadingTime = new Promise(resolve => setTimeout(resolve, 2000));
        
        const liveResponse = await getActiveLivestreams();
        if (liveResponse.success && liveResponse.data) {
          setLiveLivestreams(liveResponse.data.slice(0, 8));
        }
        const allResponse = await getAllLivestreams({ limit: 50 });
        if (allResponse.success && allResponse.data) {
          setExploreLivestreams(allResponse.data);
        }
        
        // Wait for both data and minimum time
        await minLoadingTime;
        
      } catch (err) {
        setError('Failed to load livestreams');
        // Still wait minimum time even on error
        await new Promise(resolve => setTimeout(resolve, 1500));
      } finally {
        setLoading(false);
        // Add small delay before hiding loading screen for smooth transition
        setTimeout(() => setShowLoading(false), 300);
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

  const handleAcceptDisclaimer = () => {
    localStorage.setItem('livestakes-disclaimer-accepted', 'true');
    setModalOpen(false);
  };

  // Function to clear disclaimer acceptance (for development/testing)
  const clearDisclaimerAcceptance = () => {
    localStorage.removeItem('livestakes-disclaimer-accepted');
    setModalOpen(true);
  };

  // Add to window for easy testing in console
  React.useEffect(() => {
    (window as any).clearDisclaimerAcceptance = clearDisclaimerAcceptance;
  }, []);

  return (
    <div className="min-h-screen flex font-pixel bg-purple-200">
      {/* Loading Screen */}
      <LoadingScreen isLoading={showLoading} />
      
      <HomeModal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <HomeModalContent onClose={handleAcceptDisclaimer} />
      </HomeModal>
      
      {/* Mobile Header - only on mobile */}
      {isMobile && (
        <MobileHeader 
          title="livestakes"
          showFilters={true}
          onFilterClick={handleFilterClick}
          onSearchClick={handleSearchClick}
        />
      )}
      
      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {/* Responsive Video Display */}
        {!loading && !error && exploreLivestreams.length > 0 ? (
          isMobile ? (
            <>
              {/* Mobile Header Space */}
              <div className="h-14 bg-transparent" />
              <MobileFeed livestreams={exploreLivestreams} />
            </>
          ) : (
            <div className="p-3 sm:p-4 lg:p-6">

              
              {/* Header - desktop only */}
              <DashboardHeader 
                title="LiveStakes"
                liveStreams={liveLivestreams.length}
                totalStreams={exploreLivestreams.length}
              />
              
              {/* Debug info - desktop only */}
              {process.env.NODE_ENV === 'development' && (
                <div className="hidden sm:block mb-4 p-4 bg-purple-100 rounded">
                  <p className="text-sm text-purple-800">
                    Debug: Found {liveLivestreams.length} live streams, {exploreLivestreams.length} total streams
                  </p>
                </div>
              )}
              
              <DesktopFeed livestreams={exploreLivestreams} />
            </div>
          )
        ) : (
          !showLoading && (
            <div className={`${isMobile ? 'pt-14' : 'p-3 sm:p-4 lg:p-6'}`}>
              {/* Error state */}
              {error && (
                <div className="text-center py-8">
                  <div className="text-2xl sm:text-4xl mb-4">⚠️</div>
                  <p className="text-red-600 text-sm sm:text-base">{error}</p>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="mt-4 bg-pink-600 text-white px-4 py-2 border-2 border-black rounded-none font-pixel text-sm hover:bg-pink-700 transition-colors shadow-window-pixel"
                  >
                    Retry
                  </button>
                </div>
              )}
              
              {/* No livestreams state */}
              {!loading && !error && exploreLivestreams.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-2xl sm:text-4xl mb-4">📺</div>
                  <p className="text-purple-800 text-sm sm:text-base">No livestreams found</p>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="mt-4 bg-pink-600 text-white px-4 py-2 border-2 border-black rounded-none font-pixel text-sm hover:bg-pink-700 transition-colors shadow-window-pixel"
                  >
                    Refresh
                  </button>
                </div>
              )}
            </div>
          )
        )}
      </main>
    </div>
  );
}
