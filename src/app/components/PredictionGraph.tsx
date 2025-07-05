"use client";
//path: components/PredictionGraph.tsx
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { stream, sampleStreams } from "../data/livestreams";

/**
 * PredictionGraph – pixel-window line chart
 *
 * Expects an array of time-series snapshots.  Each snapshot contains:
 *   {
 *     t: string  // ISO date or label
 *     [streamId]: number  // probability (0-100) for each project id
 *   }
 *
 * Tailwind helpers required globally:
 *   .font-pixel            { font-family: "Press Start 2P", system-ui, monospace; }
 *   .shadow-window-pixel   { box-shadow: 4px 4px 0 0 #000; }
 */

/* ------------------------------------------------------------------ */
/*  Palette – pastel but readable                                     */
/* ------------------------------------------------------------------ */
const COLORS = [
  "#f59e0b", // yellow
  "#ec4899", // pink
  "#8b5cf6", // purple
  "#10b981", // green
  "#f43f5e", // red
];

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */
interface PredictionGraphProps {
  series: Array<{ t: string } & Record<string, number | string>>;
  streams: stream[]; // used for labels
}

const PredictionGraph: React.FC<PredictionGraphProps> = ({ series, streams }) => {
  /* build legend mapping id → title */
  const legend = streams.reduce<Record<string, string>>((acc, s) => {
    acc[s.id] = s.title;
    return acc;
  }, {});

  return (
    <section className="max-w-3xl mx-auto my-8">
      {/* pixel-window shell */}
      <div className="border-4 border-black bg-yellow-300 shadow-window-pixel">
        {/* title bar */}
        <div className="flex items-center justify-between bg-purple-600 text-yellow-50 px-3 py-1 border-b-4 border-black">
          <span className="font-pixel text-xs">ODDS CHART</span>
          <button className="bg-yellow-400 text-black px-1 border border-black leading-none font-pixel">
            ✕
          </button>
        </div>

        {/* chart area */}
        <div className="bg-pink-100 p-4">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={series}>
              <CartesianGrid
                stroke="#8b5cf6"
                strokeDasharray="1 6"
                strokeWidth={1}
              />
              <XAxis
                dataKey="t"
                tick={{ fontSize: 8, fontFamily: "Press Start 2P" }}
                stroke="#4c1d95"
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 8, fontFamily: "Press Start 2P" }}
                stroke="#4c1d95"
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                contentStyle={{
                  background: "#fce7f3",
                  border: "2px solid #000",
                  fontFamily: "Press Start 2P",
                  fontSize: "8px",
                }}
                formatter={(v: number) => `${v.toFixed(1)}%`}
              />
              <Legend
                wrapperStyle={{
                  fontSize: "8px",
                  fontFamily: "Press Start 2P",
                }}
                iconType="square"
              />
              {streams.slice(0, COLORS.length).map((s, idx) => (
                <Line
                  key={s.id}
                  type="monotone"
                  dataKey={s.id}
                  name={legend[s.id]}
                  stroke={COLORS[idx]}
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
};

export default PredictionGraph;
