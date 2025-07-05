import React from "react";

interface MarketHeaderProps {
  title: string;
  volume: string;
  date: string;
  contestants: Array<{ id: string; label: string; color: string }>;
}

const MarketHeader: React.FC<MarketHeaderProps> = ({
  title,
  volume,
  date,
  contestants,
}) => (
  <header className="border-4 border-black bg-butter shadow-window-pixel mb-6">
    {/* title-bar */}
    <div className="flex items-center justify-between bg-plum text-cream px-3 py-1 border-b-4 border-black">
      <span className="text-xs">PREDICTION MARKET</span>
      <button className="bg-gold text-black px-1 border border-black leading-none">
        ✕
      </button>
    </div>

    {/* headline + stats */}
    <div className="flex flex-wrap items-center gap-4 bg-coral px-4 py-3">
      <h1 className="text-lg font-bold mr-auto">{title}</h1>
      <div className="">
        <div>Vol&nbsp;{volume}</div>
        <div>End&nbsp;{date}</div>
      </div>
    </div>

    {/* legend */}
    <ul className="flex flex-wrap gap-4 bg-coral px-4 pb-3">
      {contestants.map((c) => (
        <li key={c.id} className="flex items-center gap-1 text-xs">
          <span
            className="inline-block w-2 h-2"
            style={{ background: c.color }}
          />
          {c.label}
        </li>
      ))}
    </ul>
  </header>
);

export default MarketHeader; 