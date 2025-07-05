import React from "react";

const features = [
  {
    icon: "💡",
    title: "Predict Anything",
    description: "Create and bet on real-time markets for any hackathon project or event."
  },
  {
    icon: "⚡",
    title: "Instant Results",
    description: "Markets resolve live, with instant payouts and leaderboard updates."
  },
  {
    icon: "🎨",
    title: "Pixel-Perfect UI",
    description: "Enjoy a playful, late-90s pixel-art interface with retro vibes."
  },
  {
    icon: "🪙",
    title: "Create Your Coin",
    description: "Spin up your own prediction coin and invite friends to play."
  },
];

const Features = () => (
  <section className="max-w-4xl mx-auto mb-12">
    <div className="bg-pink-500/90 border-4 border-black rounded-none shadow-window-pixel mb-6 font-pixel">
      <div className="flex items-center justify-between px-3 py-1 bg-pink-600 text-yellow-50">
        <span className="text-lg font-bold">Features</span>
        <span className="text-yellow-200">★</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-yellow-50 p-6">
        {features.map((f) => (
          <div key={f.title} className="border-2 border-black bg-pink-100 rounded-none p-4 shadow-window-pixel flex flex-col items-center">
            <span className="text-3xl mb-2">{f.icon}</span>
            <h3 className="text-lg font-bold text-pink-700 mb-1">{f.title}</h3>
            <p className="text-sm text-black">{f.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Features; 