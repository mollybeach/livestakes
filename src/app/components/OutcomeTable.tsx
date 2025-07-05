import React from "react";
import { stream } from "../data/livestreams";

interface OutcomeTableProps {
  streams: stream[];
}

const OutcomeTable: React.FC<OutcomeTableProps> = ({ streams }) => (
  <div className="border-4 border-black bg-butter shadow-window-pixel my-8 max-w-xl w-full mx-auto">
    <div className="flex items-center justify-between bg-plum text-cream px-3 py-1 border-b-4 border-black">
      <span className="font-pixel text-xs">OUTCOMES</span>
      <button className="bg-gold text-black px-1 border border-black leading-none font-pixel">
        ✕
      </button>
    </div>

    <table className="w-full bg-coral font-pixel text-xs">
      <thead>
        <tr className="border-b-2 border-black">
          <th className="py-1 text-left pl-3">Project</th>
          <th className="py-1">% Chance</th>
          <th className="py-1 pr-3 text-right">Buy</th>
        </tr>
      </thead>
      <tbody>
        {streams.map((s) => (
          <tr key={s.id} className="border-b border-black">
            <td className="py-1 pl-3">{s.title}</td>
            <td className="py-1 text-center">
              {s.odds.replace("×", "") /* quick placeholder */}
            </td>
            <td className="py-1 pr-3 text-right">
              <button className="bg-gold text-black border-2 border-black px-2">
                Bet
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default OutcomeTable; 