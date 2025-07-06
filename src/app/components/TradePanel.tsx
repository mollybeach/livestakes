import React from "react";

const TradePanel: React.FC = () => (
  <aside className="border-4 border-black bg-butter shadow-window-pixel w-64 max-h-[22rem] h-fit overflow-auto">
    <div className="flex items-center justify-between bg-plum text-cream px-2 py-1 border-b-4 border-black">
      <span className="font-pixel text-xs">TRADE</span>
      <button className="bg-gold text-black px-1 border border-black leading-none font-pixel">
        ✕
      </button>
    </div>

    <div className="bg-coral p-3 font-pixel text-xs">
      <p className="mb-2">Amount</p>
      <input
        type="number"
        className="w-full border-2 border-black bg-eggshell p-1 mb-3"
        placeholder="$"
      />
      <button className="bg-gold w-full border-2 border-black py-1">
        Trade
      </button>
    </div>
  </aside>
);

export default TradePanel; 