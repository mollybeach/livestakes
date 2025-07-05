import React from "react";
import Leaderboard from "../components/Leaderboard";
import { mockLivestreams } from "../data/livestreams";

const LeaderboardPage = () => {
  return <Leaderboard streams={mockLivestreams} />;
};

export default LeaderboardPage; 