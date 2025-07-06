'use client';
import React, { useState } from "react";
import PredictionGraph from "../components/PredictionGraph";
import MarketHeader from "../components/MarketHeader";
import OutcomeTable from "../components/OutcomeTable";
import TradePanel from "../components/TradePanel";
import { mockLivestreams } from "../data/livestreams";
import { mockMarkets } from "../data/markets";
import BettingModal from "../components/BettingModal";

/* palette helper for legend dots */
const COLORS = ["#f59e0b", "#8b5cf6", "#ec4899"];

const ChartPage = () => {
  const [selectedMarketId, setSelectedMarketId] = useState<number>(mockMarkets[0]?.id || 0);
  const [betModalOpen, setBetModalOpen] = useState(false);
  const [selectedLivestream, setSelectedLivestream] = useState<typeof mockLivestreams[0] | null>(null);

  const selectedMarket = mockMarkets.find(m => m.id === selectedMarketId) || mockMarkets[0];

  // Filter livestreams by selected market's contract_address
  const filteredLivestreams = mockLivestreams.filter(
    (stream) => stream.market_address === selectedMarket.contract_address
  );

  // Fake series data for demo; in real app, fetch price history for selected market
  const series = [
    { t: "10:00", "1": 70, "2": 25, "3": 5 },
    { t: "10:05", "1": 68, "2": 26, "3": 6 },
    { t: "10:10", "1": 65, "2": 28, "3": 7 },
    { t: "10:15", "1": 62, "2": 30, "3": 8 },
    { t: "10:20", "1": 59, "2": 33, "3": 8 },
  ];

  const contestants = filteredLivestreams.slice(0, 3).map((s, idx) => ({
    id: s.id?.toString() || `stream-${idx}`,
    label: s.title,
    color: COLORS[idx],
  }));

  // Handler to open BettingModal for a given livestream
  const handleBetClick = (livestreamId: number) => {
    const stream = mockLivestreams.find(s => s.id === livestreamId);
    setSelectedLivestream(stream || null);
    setBetModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-mauve text-plum p-4">
      {/* Market Dropdown */}
      <div className="mb-4 flex items-center gap-2 max-w-6xl mx-auto">
        <label htmlFor="market-select" className="text-xs font-bold text-purple-800">Select Market:</label>
        <select
          id="market-select"
          value={selectedMarketId}
          onChange={e => setSelectedMarketId(Number(e.target.value))}
          className="border-2 border-black bg-yellow-50 px-2 py-1 rounded-none text-xs"
        >
          {mockMarkets
            .filter(market =>
              mockLivestreams.some(stream => stream.market_address === market.contract_address)
            )
            .map(market => (
              <option key={market.id} value={market.id}>{market.title}</option>
            ))}
        </select>
      </div>
      {/* --- header like Polymarket's event card --- */}
      <MarketHeader
        title={selectedMarket.title}
        volume={`$${selectedMarket.totalVolume?.toLocaleString() || "0"} Vol.`}
        date={selectedMarket.start_time || ""}
        contestants={contestants}
      />
      {/* --- graph & side panel layout --- */}
      <section className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto">
        <div className="flex-1">
          <PredictionGraph
            series={series}
            streams={filteredLivestreams.slice(0, 3)}
            marketAddress={selectedMarket.contract_address}
          />
          <OutcomeTable
            streams={filteredLivestreams}
            onBetClick={handleBetClick}
          />
        </div>
        <TradePanel />
      </section>
      {/* Betting Modal */}
      {selectedLivestream && (
        <BettingModal
          isOpen={betModalOpen}
          onClose={() => setBetModalOpen(false)}
          livestreamId={selectedLivestream.id || 0}
          livestreamTitle={selectedLivestream.title}
          livestreamDescription={selectedLivestream.description}
          markets={mockMarkets}
          market={mockMarkets.find(m => m.id === selectedMarketId)}
        />
      )}
    </main>
  );
};

export default ChartPage;
