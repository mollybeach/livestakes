import React from "react";
import PredictionGraph from "../components/PredictionGraph";
import MarketHeader from "../components/MarketHeader";
import OutcomeTable from "../components/OutcomeTable";
import TradePanel from "../components/TradePanel";
import { sampleStreams } from "../data/livestreams";

/* fake series data – plug in real snapshots */
const series = [
  { t: "10:00", "1": 70, "2": 25, "3": 5 },
  { t: "10:05", "1": 68, "2": 26, "3": 6 },
  { t: "10:10", "1": 65, "2": 28, "3": 7 },
  { t: "10:15", "1": 62, "2": 30, "3": 8 },
  { t: "10:20", "1": 59, "2": 33, "3": 8 },
];

/* palette helper for legend dots */
const COLORS = ["#f59e0b", "#8b5cf6", "#ec4899"];

const ChartPage = () => {
  /* legend assembly */
  const contestants = sampleStreams.slice(0, 3).map((s, idx) => ({
    id: s.id,
    label: s.title,
    color: COLORS[idx],
  }));

  return (
    <main className="min-h-screen bg-mauve text-plum font-pixel p-4">
      {/* --- header like Polymarket's event card --- */}
      <MarketHeader
        title="EthGlobal Championship"
        volume="$15,906 Vol."
        date="Jul 7, 2025"
        contestants={contestants}
      />

      {/* --- graph & side panel layout --- */}
      <section className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto">
        <div className="flex-1">
          <PredictionGraph
            series={series}
            streams={sampleStreams.slice(0, 3)}
          />
          <OutcomeTable streams={sampleStreams.slice(0, 6)} />
        </div>
        <TradePanel />
      </section>
    </main>
  );
};

export default ChartPage;
