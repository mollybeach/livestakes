"use client";
//path: components/PredictionGraph.tsx
import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import type { LivestreamDataType } from '../../types/types';

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
  streams: LivestreamDataType[]; // used for labels
  marketAddress: string;
}

const PredictionGraph: React.FC<PredictionGraphProps> = ({ series, streams, marketAddress }) => {
  /* build legend mapping id → title */
  const legend = streams.reduce<Record<string, string>>((acc, s) => {
    if (s.id) {
      acc[s.id.toString()] = s.title;
    }
    return acc;
  }, {});

  const filteredSeries = series.filter(item => {
    const streamId = Object.keys(item)[1] as string;
    return item[streamId] !== undefined && typeof item[streamId] === 'number' && item[streamId] !== 0;
  });

  const filteredStreams = streams.filter(s => s.market_address === marketAddress);

  return (
    <section className="max-w-3xl mx-auto my-8">
      {/* pixel-window shell */}
      <div className="border-4 border-black bg-yellow-300 shadow-window-pixel">
        {/* title bar */}
        <div className="flex items-center justify-between bg-purple-600 text-yellow-50 px-3 py-1 border-b-4 border-black">
          <span className="text-xs">ODDS CHART</span>
          <button className="bg-yellow-400 text-black px-1 border border-black leading-none">
            ✕
          </button>
        </div>

        {/* chart area */}
        <div className="bg-pink-100 p-4">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={filteredSeries}>
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
              {filteredStreams.slice(0, COLORS.length).map((s, idx) => (
                <Line
                  key={s.id}
                  type="monotone"
                  dataKey={s.id?.toString() || `stream-${idx}`}
                  name={legend[s.id?.toString() || `stream-${idx}`] || s.title}
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
