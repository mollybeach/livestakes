"use client";
import React, { useState } from "react";
import Markets from "../components/Markets";
import { mockMarkets, MarketDataType } from "../data/markets";

// Helper function to cast markets to the correct type
const castMarkets = (markets: MarketDataType[]): MarketDataType[] => markets;

const MarketsPage = () => {
  const [markets, setMarkets] = useState<MarketDataType[]>(castMarkets(mockMarkets));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen flex bg-purple-200">
        <div className="flex-1 overflow-y-auto flex items-center justify-center">
          <div className="text-2xl text-purple-800">Loading markets...</div>
        </div>
      </div>
    );
  }

  if (error) {
    // Optionally show error, but still show markets
    // return (
    //   <div className="min-h-screen flex bg-purple-200">
    //     <div className="flex-1 overflow-y-auto flex items-center justify-center">
    //       <div className="text-2xl text-red-600">Error: {error}</div>
    //     </div>
    //   </div>
    // );
  }

  return (
    <div className="min-h-screen flex bg-purple-200">
      {/* Markets Content */}
      <div className="flex-1 overflow-y-auto">
        <Markets markets={markets} />
      </div>
    </div>
  );
};

export default MarketsPage; 