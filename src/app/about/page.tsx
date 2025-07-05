import React from "react";

const AboutPage = () => (
  <div className="min-h-screen bg-pink-200 text-purple-900 pt-8">
    <h1 className="text-2xl text-center font-bold mb-6">ℹ️ About</h1>
    <section className="max-w-2xl mx-auto bg-yellow-50 border-4 border-black shadow-window-pixel p-6 text-center">
      <p className="mb-4 text-lg font-bold">LiveStakes.fun</p>
      <p className="mb-4">Real-time prediction markets for hackathon projects, built with a playful late-90s pixel-UI aesthetic.</p>
      <p className="mb-4">Created by <span className="text-pink-600 font-bold">Molly Beach</span>, <span className="text-pink-600 font-bold">Ziz Khu</span>, and <span className="text-pink-600 font-bold">João Santos</span>.</p>
      <p className="text-xs text-purple-700">Powered by Next.js, Tailwind CSS, and a love for retro web design.</p>
    </section>
  </div>
);

export default AboutPage;
