import React from "react";
import { stream } from "../data/livestreams";

/* --------------------------------------------------------------
   Pixel-style leaderboard
   -------------------------------------------------------------- */
/* Helpers */
const toNumber = (value = "") =>
  value.includes("K")
    ? parseFloat(value.replace(/[^\d.]/g, "")) * 1_000
    : parseFloat(value.replace(/[^\d.]/g, ""));

interface LeaderboardProps {
  streams: stream[]; // pass the full list; component will sort
}

const Leaderboard: React.FC<LeaderboardProps> = ({ streams }) => {
  /* rank by totalVolume (desc) */
  const ranked = [...streams]
    .filter((s) => s.totalVolume)
    .sort((a, b) => toNumber(b.totalVolume!) - toNumber(a.totalVolume!))
    .slice(0, 8); // top 8 rows

  return (
    <section className="max-w-lg mx-auto my-8">
      {/* window shell */}
      <div className="border-4 border-black bg-yellow-300 shadow-window-pixel">
        {/* title-bar */}
        <div className="flex items-center justify-between bg-purple-600 text-yellow-50 px-3 py-1 border-b-4 border-black">
          <span className="font-pixel text-xs">LEADERBOARD</span>
          <button className="bg-yellow-400 text-black px-1 border border-black leading-none font-pixel">
            ✕
          </button>
        </div>

        {/* table */}
        <div className="bg-pink-100 p-4 overflow-x-auto">
          <table className="w-full font-pixel text-xs text-left">
            <thead>
              <tr className="text-purple-800 border-b-2 border-black">
                <th className="py-1">#</th>
                <th className="py-1">Project</th>
                <th className="py-1">Team</th>
                <th className="py-1 text-right">Volume</th>
              </tr>
            </thead>
            <tbody>
              {ranked.map((s, idx) => (
                <tr
                  key={s.id}
                  className={`border-b border-black ${
                    idx % 2 ? "bg-purple-200/40" : ""
                  }`}
                >
                  <td className="py-1 px-1">{idx + 1}</td>
                  <td className="py-1 px-1 flex items-center gap-1">
                    <img
                      src={s.avatar}
                      alt={s.title}
                      className="w-4 h-4 border-2 border-black"
                    />
                    {s.title}
                  </td>
                  <td className="py-1 px-1">{s.team}</td>
                  <td className="py-1 px-1 text-right">{s.totalVolume}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default Leaderboard; 