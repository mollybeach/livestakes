import Head from 'next/head';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import CTA from './components/CTA';
import Footer from './components/Footer';

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
        <Header />
        <Hero />
        <Features />
        <HowItWorks />
        <CTA />
        <Footer />
      </div>
    </>
  );
} 