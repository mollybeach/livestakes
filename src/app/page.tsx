// path: pages/index.tsx    /* or app/page.tsx if you're on the App Router */
import Hero from "./components/Hero";
'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import ConnectWallet from './components/ConnectWallet';
import SearchBar from './components/SearchBar';
import LivestreamSection from './components/LivestreamSection';
import { 
  Livestream, 
  getActiveLivestreams, 
  getAllLivestreams,
  getEndedLivestreams 
} from './lib/livestreamsApi';

/**
 * Home page – pixel-window aesthetic
 *
 * Depends on global Tailwind helpers:
 * @layer utilities {
 *   .font-pixel            { font-family: "Press Start 2P", system-ui, monospace; }
 *   .shadow-window-pixel   { box-shadow: 4px 4px 0 0 #000; }
 * }
 */
export default function Home() {
  const [liveLivestreams, setLiveLivestreams] = useState<Livestream[]>([]);
  const [exploreLivestreams, setExploreLivestreams] = useState<Livestream[]>([]);
  const [searchResults, setSearchResults] = useState<Livestream[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch livestreams on component mount
  useEffect(() => {
    const fetchLivestreams = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch live streams
        const liveResponse = await getActiveLivestreams();
        if (liveResponse.success && liveResponse.data) {
          setLiveLivestreams(liveResponse.data.slice(0, 8)); // Show max 8 live streams
        }

        // Fetch all streams for explore (mix of active, ended, and scheduled)
        const allResponse = await getAllLivestreams({ limit: 12 });
        if (allResponse.success && allResponse.data) {
          setExploreLivestreams(allResponse.data);
        }
      } catch (err) {
        console.error('Error fetching livestreams:', err);
        setError('Failed to load livestreams');
      } finally {
        setLoading(false);
      }
    };

    fetchLivestreams();
  }, []);

  // Handle search
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      // Simple search implementation - you can enhance this
      const response = await getAllLivestreams();
      if (response.success && response.data) {
        const filtered = response.data.filter(
          stream => 
            stream.title.toLowerCase().includes(query.toLowerCase()) ||
            stream.description?.toLowerCase().includes(query.toLowerCase()) ||
            stream.category?.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(filtered);
      }
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  // Handle livestream view (update local state with new view count)
  const handleLivestreamView = (updatedLivestream: Livestream) => {
    setLiveLivestreams(prev => 
      prev.map(stream => 
        stream.id === updatedLivestream.id ? updatedLivestream : stream
      )
    );
    setExploreLivestreams(prev => 
      prev.map(stream => 
        stream.id === updatedLivestream.id ? updatedLivestream : stream
      )
    );
    setSearchResults(prev => 
      prev.map(stream => 
        stream.id === updatedLivestream.id ? updatedLivestream : stream
      )
    );
  };

  return (
    <>
      <Head>
        <title>livestakes.fun | AI-Powered Livestream Betting Platform</title>
        <meta
          name="description"
          content="Watch hackathon livestreams and bet on them with AI-generated opportunities."
        />
        <meta
          name="keywords"
          content="livestream betting, AI predictions, realtime markets, hackathon"
        />
        <meta
          property="og:title"
          content="livestakes.fun | AI-Powered Livestream Betting"
        />
        <meta
          property="og:description"
          content="Watch livestreams and place on-chain predictions in real time."
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="livestakes.fun | Smart Betting on Live Streams"
        />
        <meta
          name="twitter:description"
          content="AI-powered betting on livestreams. Watch, predict, earn."
        />
      </Head>

      {/* ---------------------------------------------------------------- */}
      {/*  Retro pastel shell                                              */}
      {/* ---------------------------------------------------------------- */}
      <div className="min-h-screen bg-pink-200 text-purple-900 font-pixel">
        <Hero />
      
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-black text-white">
        {/* Header */}
        <header className="relative z-10 px-6 py-4 border-b border-purple-500/20">
          <nav className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">L</span>
              </div>
              <span className="text-xl font-bold">livestakes.fun</span>
            </div>
            <ConnectWallet />
          </nav>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Search Section */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent">
                Watch. Bet. Win.
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
                AI-powered livestream betting platform. Discover trending streams and past videos.
              </p>
            </div>
            
            <SearchBar 
              onSearch={handleSearch}
              placeholder="Search livestreams, creators, or categories..."
            />
          </div>

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">⚠️</div>
              <p className="text-red-400 text-lg">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">⏳</div>
              <p className="text-gray-400 text-lg">Loading livestreams...</p>
            </div>
          )}

          {/* Search Results */}
          {searchQuery && !loading && (
            <LivestreamSection
              title={`Search Results for "${searchQuery}"`}
              livestreams={searchResults}
              onLivestreamView={handleLivestreamView}
              emptyMessage="No livestreams found for your search"
            />
          )}

          {/* Content Sections - Only show when not searching */}
          {!searchQuery && !loading && !error && (
            <>
              {/* Now Trending Live */}
              <LivestreamSection
                title="🔴 Now Trending Live"
                livestreams={liveLivestreams}
                onLivestreamView={handleLivestreamView}
                emptyMessage="No live streams at the moment"
                showViewAll={liveLivestreams.length >= 8}
                onViewAll={() => console.log('View all live streams')}
              />

              {/* Explore All */}
              <LivestreamSection
                title="🎬 Explore All"
                livestreams={exploreLivestreams}
                onLivestreamView={handleLivestreamView}
                emptyMessage="No livestreams available"
                showViewAll={exploreLivestreams.length >= 12}
                onViewAll={() => console.log('View all streams')}
              />
            </>
          )}
        </main>
      </div>
      </div>
    </>
  );
}