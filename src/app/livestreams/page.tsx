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
  return (
      <div className="min-h-screen flex font-pixel bg-purple-200">
        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Top marquee bar */}
            <Marquee />
            {/* Header */}
            <DashboardHeader 
              title="LiveStakes"
              liveStreams={liveLivestreams.length}
              totalStreams={liveLivestreams.length + exploreLivestreams.length}
            />
            {/* Grid of streams */}
            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {liveLivestreams.map((stream) => (
                <StreamCard key={stream.id} {...stream} />
              ))}
            </section>
          </div>
        </main>
      </div>
  );
};

export default LivestreamsPage; 