"use client";
import React, { useEffect, useState } from "react";
import DashboardHeader from "../components/DashboardHeader";
import StreamCard from "../components/StreamCard";
import Marquee from "../components/Marquee";
import { 
  Livestream, 
  getActiveLivestreams, 
  getAllLivestreams,
 // getEndedLivestreams 
} from '../lib/livestreamsApi';

const LivestreamsPage = () => {

  const [liveLivestreams, setLiveLivestreams] = useState<Livestream[]>([]);
  const [exploreLivestreams, setExploreLivestreams] = useState<Livestream[]>([]);
 // const [searchResults, setSearchResults] = useState<Livestream[]>([]);
 // const [searchQuery, setSearchQuery] = useState('');
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
        console.log('Live streams API response:', liveResponse);
        if (liveResponse.success && liveResponse.data) {
          console.log('Live streams data:', liveResponse.data);
          setLiveLivestreams(liveResponse.data.slice(0, 8)); // Show max 8 live streams
        }

        // Fetch all streams for explore (mix of active, ended, and scheduled)
        const allResponse = await getAllLivestreams({ limit: 50 });
        console.log('All streams API response:', allResponse);
        if (allResponse.success && allResponse.data) {
          console.log('All streams data:', allResponse.data);
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
  return (
      <div className="min-h-screen flex font-pixel bg-purple-200">
        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Top marquee bar */}
            <Marquee />
            {/* Header */}
            <DashboardHeader 
              title="LiveStakes - All Streams"
              liveStreams={liveLivestreams.length}
              totalStreams={exploreLivestreams.length}
            />
            {/* Loading state */}
            {loading && (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🔄</div>
                <p className="text-purple-800">Loading livestreams...</p>
              </div>
            )}

            {/* Error state */}
            {error && (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">⚠️</div>
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {/* Debug info */}
            {!loading && !error && (
              <div className="mb-4 p-4 bg-purple-100 rounded">
                <p className="text-sm text-purple-800">
                  Debug: Found {liveLivestreams.length} live streams, {exploreLivestreams.length} total streams
                </p>
              </div>
            )}

            {/* Grid of streams - Show ALL streams */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {exploreLivestreams.length > 0 ? (
                exploreLivestreams.map((stream) => {
                  console.log('Rendering stream:', stream);
                  return <StreamCard key={stream.id} {...stream} status='live' />;
                })
              ) : (
                !loading && !error && (
                  <div className="col-span-full text-center py-8">
                    <div className="text-4xl mb-4">📺</div>
                    <p className="text-purple-800">No livestreams found</p>
                  </div>
                )
              )}
            </section>
          </div>
        </main>
      </div>
  );
};

export default LivestreamsPage; 