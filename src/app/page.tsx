import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

// Feature Card Component
interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:transform hover:scale-105">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-3 text-purple-300">{title}</h3>
      <p className="text-gray-300 leading-relaxed">{description}</p>
    </div>
  );
};

// Social Icon component
interface SocialIconProps {
  href: string;
  icon: string | React.ReactNode;
  label: string;
}

const SocialIcon = ({ href, icon, label }: SocialIconProps) => {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="flex items-center text-gray-400 hover:text-purple-400 transition-colors"
      aria-label={label}
    >
      {typeof icon === 'string' ? (
        <span className="text-xl mr-2">{icon}</span>
      ) : (
        <span className="mr-2">{icon}</span>
      )}
      <span>{label}</span>
    </a>
  );
};

export default function Home() {
  return (
    <>
      <Head>
        <title>livestakes.fun | AI-Powered Livestream Betting Platform</title>
        <meta name="description" content="Watch livestreams and bet on them with AI-generated betting opportunities. The future of interactive entertainment and earning." />
        <meta name="keywords" content="livestream, betting, AI betting, streaming platform, live entertainment, AI predictions" />
        <meta property="og:title" content="livestakes.fun | AI-Powered Livestream Betting" />
        <meta property="og:description" content="🎮 Watch livestreams and make money with AI-generated betting opportunities!" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="livestakes.fun | Smart Betting on Live Streams" />
        <meta name="twitter:description" content="AI-powered betting on livestreams. Watch, predict, earn! 🚀" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-black text-white">
        {/* Header */}
        <header className="relative z-10 px-6 py-4">
          <nav className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">L</span>
              </div>
              <span className="text-xl font-bold">livestakes.fun</span>
            </div>
            <div className="hidden md:flex space-x-6">
              <a href="#features" className="hover:text-purple-300 transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-purple-300 transition-colors">How It Works</a>
              <a href="#about" className="hover:text-purple-300 transition-colors">About</a>
            </div>
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all">
              Launch App
            </button>
          </nav>
        </header>

        {/* Hero Section */}
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

        {/* Features Section */}
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

        {/* How It Works Section */}
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

        {/* CTA Section */}
        <section className="px-6 py-20 bg-gradient-to-r from-purple-900/50 to-pink-900/50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Start Earning?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of users who are already making money by watching livestreams
            </p>
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 px-12 py-4 rounded-lg text-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105">
              Launch livestakes.fun
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 py-12 border-t border-purple-500/20">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">L</span>
                  </div>
                  <span className="text-xl font-bold">livestakes.fun</span>
                </div>
                <p className="text-gray-400">The future of interactive livestream entertainment and earning.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Platform</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-purple-300 transition-colors">Features</a></li>
                  <li><a href="#" className="hover:text-purple-300 transition-colors">How It Works</a></li>
                  <li><a href="#" className="hover:text-purple-300 transition-colors">Pricing</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-purple-300 transition-colors">Help Center</a></li>
                  <li><a href="#" className="hover:text-purple-300 transition-colors">Contact Us</a></li>
                  <li><a href="#" className="hover:text-purple-300 transition-colors">FAQ</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Connect</h4>
                <div className="space-y-2">
                  <SocialIcon href="#" icon="🐦" label="Twitter" />
                  <SocialIcon href="#" icon="💬" label="Discord" />
                  <SocialIcon href="#" icon="📧" label="Email" />
                </div>
              </div>
            </div>
            <div className="border-t border-purple-500/20 pt-8 text-center text-gray-400">
              <p>&copy; 2024 livestakes.fun. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
} 