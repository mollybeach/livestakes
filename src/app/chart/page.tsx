import React from "react";
import PredictionGraph from "../components/PredictionGraph";
import { sampleStreams } from "../data/livestreams";

// Example time-series data (simulate odds for 3 streams)
const series = [
  { t: "10:00", "1": 40, "2": 60, "3": 80 },
  { t: "10:05", "1": 45, "2": 55, "3": 75 },
  { t: "10:10", "1": 50, "2": 50, "3": 70 },
  { t: "10:15", "1": 55, "2": 45, "3": 65 },
  { t: "10:20", "1": 60, "2": 40, "3": 60 },
] as Array<{ t: string } & Record<string, number | string>>;

const ChartPage = () => (
  <div className="min-h-screen bg-pink-200 font-pixel text-purple-900 py-8">
            <h1 className="mt-6 mb-2 text-xs border-4 border-black bg-purple-100 shadow-window-pixel px-4 py-1">
          LIVE ODDS HISTORY
        </h1>
    <h1 className="text-2xl text-center font-bold mb-6">📈 Odds Chart</h1>
    <PredictionGraph series={series} streams={sampleStreams.slice(0, 3)} />
  </div>
);

export default ChartPage;
