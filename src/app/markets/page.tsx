"use client";
import React from "react";
import Markets from "../components/Markets";
import { mockMarkets } from "../data/markets";

const MarketsPage = () => {
  return (
    <div className="min-h-screen flex font-pixel bg-purple-200">
      {/* Markets Content */}
      <div className="flex-1 overflow-y-auto">
        <Markets markets={mockMarkets} />
      </div>
    </div>
  );
};

export default MarketsPage; 