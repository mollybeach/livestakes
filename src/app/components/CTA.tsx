//path: components/CTA.jsx
import React from "react";

/**
 * Pixel-window call-to-action block
 * ⛑  Requires the global Tailwind utilities shown below:
 *     @layer utilities {
 *       .font-pixel { @apply font-["Press_Start_2P","system-ui",monospace]; }
 *       .shadow-window-pixel { box-shadow: 4px 4px 0 0 #000; }
 *     }
 */
const CTA = () => (
  <section className="flex justify-center py-16 bg-pink-200">
    <div className="bg-yellow-300 border-4 border-black shadow-window-pixel max-w-xl w-full mx-4">
      {/* title bar */}
      <div className="flex items-center justify-between bg-purple-600 text-yellow-50 px-3 py-1 border-b-4 border-black">
        <span className="font-pixel text-sm">♡  Action!</span>
        <button className="bg-yellow-400 text-black px-1 border border-black leading-none font-pixel">
          ✕
        </button>
      </div>

      {/* content */}
      <div className="p-6 text-center font-pixel text-purple-900">
        <h2 className="text-lg sm:text-xl md:text-2xl mb-4">
          Ready&nbsp;to&nbsp;Start&nbsp;Earning?
        </h2>

        <p className="text-xs sm:text-sm mb-8">
          Join thousands of users already stacking FLOW just by watching hacks
        </p>

        <button className="inline-block bg-pink-600 hover:bg-pink-700 text-yellow-50 border-2 border-black px-8 py-3 rounded-none uppercase tracking-wider transition-transform active:translate-y-0.5">
          Launch&nbsp;LiveStakes.fun
        </button>
      </div>
    </div>
  </section>
);

export default CTA;
