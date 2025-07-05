import React from 'react';
import FeatureCard from './FeatureCard';

const Features = () => {
  return (
    <section id="features" className="px-6 py-20 bg-black/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Why Choose livestakes.fun?</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience the future of interactive entertainment with our cutting-edge AI technology
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon="🤖"
            title="AI-Generated Bets"
            description="Our advanced AI analyzes livestreams in real-time to create smart betting opportunities based on current events and situations."
          />
          <FeatureCard
            icon="📺"
            title="Live Stream Integration"
            description="Watch your favorite streamers while our platform creates dynamic betting markets based on their gameplay and content."
          />
          <FeatureCard
            icon="💰"
            title="Real-Time Earnings"
            description="Make money while watching streams. Our AI identifies winning opportunities and helps you profit from your predictions."
          />
          <FeatureCard
            icon="⚡"
            title="Instant Payouts"
            description="Get paid instantly when your bets win. No waiting periods, no complicated withdrawal processes."
          />
          <FeatureCard
            icon="🔒"
            title="Secure & Fair"
            description="Built with transparency and security in mind. All bets are verifiable and payouts are guaranteed."
          />
          <FeatureCard
            icon="🌍"
            title="Global Community"
            description="Join thousands of users worldwide who are already earning money by watching their favorite content."
          />
        </div>
      </div>
    </section>
  );
};

export default Features; 