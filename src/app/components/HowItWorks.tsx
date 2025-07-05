import React from 'react';

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="px-6 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">How It Works</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Start earning in three simple steps
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">1</div>
            <h3 className="text-2xl font-bold mb-4">Choose a Stream</h3>
            <p className="text-gray-300">Browse available livestreams or connect your favorite streaming platforms.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">2</div>
            <h3 className="text-2xl font-bold mb-4">AI Creates Bets</h3>
            <p className="text-gray-300">Our AI analyzes the stream and generates betting opportunities in real-time.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">3</div>
            <h3 className="text-2xl font-bold mb-4">Watch & Earn</h3>
            <p className="text-gray-300">Place your bets, watch the action unfold, and collect your winnings instantly.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks; 