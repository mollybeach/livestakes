import React from "react";
import Leaderboard from "../components/Leaderboard";
import { sampleStreams } from "../data/livestreams";

const LeaderboardPage = () => {
  return <Leaderboard streams={sampleStreams} />;
};

export default LeaderboardPage; 