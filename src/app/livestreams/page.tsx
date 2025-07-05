import React from "react";
import LivestreamCard from "../components/LivestreamCard";
import PageLayout from "../components/PageLayout";
import LivestreamHeader from "../components/LivestreamHeader";
import { getLivestreams } from "../data/livestreams";

const LivestreamsPage = async () => {
  const livestreams = await getLivestreams();
  const liveStreams = livestreams.filter(stream => stream.isLive).length;

  return (
    <PageLayout title="" showNavigation={true}>
      <div className="px-6 py-8">
        <LivestreamHeader 
          title="Livestreams"
          totalStreams={livestreams.length}
          liveStreams={liveStreams}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {livestreams.map((stream) => (
            <LivestreamCard key={stream.id} {...stream} />
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default LivestreamsPage; 