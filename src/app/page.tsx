"use client";
// path: pages/index.tsx    /* or app/page.tsx if you're on the App Router */
import React, { useState } from "react";
import DashboardHeader from "./components/DashboardHeader";
import StreamCard from "./components/StreamCard";
import Marquee from "./components/Marquee";
import { Livestream, getActiveLivestreams, getAllLivestreams } from './lib/livestreamsApi';
import HomeModal, { HomeModalContent } from "./components/HomeModal";

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
  const [modalOpen, setModalOpen] = useState(true);
  const [liveLivestreams, setLiveLivestreams] = React.useState<Livestream[]>([]);
  const [exploreLivestreams, setExploreLivestreams] = React.useState<Livestream[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchLivestreams = async () => {
      try {
        setLoading(true);
        setError(null);
        const liveResponse = await getActiveLivestreams();
        if (liveResponse.success && liveResponse.data) {
          setLiveLivestreams(liveResponse.data.slice(0, 8));
        }
        const allResponse = await getAllLivestreams({ limit: 50 });
        if (allResponse.success && allResponse.data) {
          setExploreLivestreams(allResponse.data);
        }
      } catch (err) {
        setError('Failed to load livestreams');
      } finally {
        setLoading(false);
      }
    };
    fetchLivestreams();
  }, []);

  return (
    <div className="min-h-screen flex font-pixel bg-purple-200">
      <HomeModal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <HomeModalContent />
      </HomeModal>
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
              exploreLivestreams.map((stream) => (
                <StreamCard key={stream.id} {...stream} status='live' />
              ))
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
}
