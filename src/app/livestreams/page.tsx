import React from "react";
import DashboardHeader from "../components/DashboardHeader";
import { getLivestreams } from "../data/livestreams";
import StreamCard from "../components/StreamCard";
import Marquee from "../components/Marquee";

const LivestreamsPage = async () => {
  const livestreams = await getLivestreams();
  const liveStreams = livestreams.filter(stream => stream.isLive).length;

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
              liveStreams={liveStreams}
              totalStreams={livestreams.length}
            />
            {/* Grid of streams */}
            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {livestreams.map((stream) => (
                <StreamCard key={stream.id} {...stream} />
              ))}
            </section>
          </div>
        </main>
      </div>
  );
};

export default LivestreamsPage; 