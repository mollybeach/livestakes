//path: components/Hero.jsx
import React from 'react';
import Head from 'next/head';

/**
 * 🪄 Pixel-styled Hero section for LiveStakes
 * Note: Requires these Tailwind utilities:
 * @layer utilities {
 *   .font-pixel { @apply font-["Press_Start_2P","system-ui",monospace]; }
 *   .shadow-window-pixel { box-shadow: 4px 4px 0 0 #000; }
 * }
 */
const Hero = () => (
  <>
    <Head>
      <title>LiveStakes - Real-time Prediction Markets</title>
      <meta
        name="description"
        content="Real-time prediction markets for hackathon projects"
      />
    </Head>

    <section className="relative px-4 py-16 bg-pink-200 font-pixel text-purple-900">
      <div className="max-w-5xl mx-auto text-center">
        {/* Hero Title */}
        <div className="border-4 border-black bg-yellow-300 shadow-window-pixel p-4 mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl leading-snug">
            ♡ WATCH. BET. WIN.
          </h1>
        </div>

        {/* Description */}
        <div className="border-4 border-black bg-purple-100 shadow-window-pixel max-w-3xl mx-auto mb-10">
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
        <p className="text-sm leading-relaxed text-purple-800">
            The world's first AI-powered livestream betting platform.<br />
            Watch your favorite ETHGlobal hackathon streams and stake on who wins—<br />
            all powered by smart contracts and real-time analysis.
          </p>
        <p className="text-xs sm:text-sm mb-8">
          Join thousands of users already stacking FLOW just by watching hacks
        </p>

        <button className="inline-block bg-pink-600 hover:bg-pink-700 text-yellow-50 border-2 border-black px-8 py-3 rounded-none uppercase tracking-wider transition-transform active:translate-y-0.5">
          Launch&nbsp;LiveStakes.fun
        </button>
      </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button className="bg-yellow-400 text-black border-2 border-black px-6 py-3 text-xs uppercase shadow-window-pixel hover:bg-yellow-300 transition-all">
            ▶ Start Watching & Betting
          </button>
          <button className="bg-purple-200 text-purple-800 border-2 border-black px-6 py-3 text-xs uppercase shadow-window-pixel hover:bg-purple-300 transition-all">
            💡 Learn More
          </button>
        </div>

        {/* Hero Video Placeholder */}
        <div className="border-4 border-black bg-pink-100 shadow-window-pixel p-4 max-w-4xl mx-auto">
          <div className="aspect-video bg-purple-200 flex items-center justify-center border-2 border-black">
            <div className="text-center">
              <div className="text-3xl mb-2">🎮</div>
              <p className="text-xs">Nav Coming Soon</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </>
);

export default Hero;
