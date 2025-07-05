import React from 'react';

const Hero = () => {
  return (
    <section className="relative px-6 py-20">
      <div className="max-w-7xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent">
            Watch. Bet. Win.
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            The world's first AI-powered livestream betting platform. Watch your favorite streams and make money with intelligent betting opportunities generated in real-time.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 rounded-lg text-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105">
            Start Watching & Betting
          </button>
          <button className="border-2 border-purple-500 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-purple-500/20 transition-all">
            Learn More
          </button>
        </div>

        {/* Hero Image/Video Placeholder */}
        <div className="relative mx-auto max-w-4xl">
          <div className="bg-gradient-to-r from-purple-800/50 to-pink-800/50 rounded-xl border border-purple-500/30 p-8 backdrop-blur-sm">
            <div className="aspect-video bg-gray-800/50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🎮</div>
                <p className="text-gray-400">Live Demo Coming Soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 