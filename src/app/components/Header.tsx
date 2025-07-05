import React from 'react';
import Link from 'next/link';
import ConnectWallet from './ConnectWallet';

const Header = () => {
  return (
    <header className="relative z-10 px-6 py-4 bg-pink-600 border-b-4 border-black">
      <nav className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-yellow-400 border-2 border-black rounded-none flex items-center justify-center">
            <span className="text-black font-bold font-pixel">L</span>
          </div>
          <span className="text-xl font-bold text-yellow-50 font-pixel">livestakes.fun</span>
        </Link>
        <div className="hidden md:flex space-x-6">
          <a href="/features" className="text-yellow-50 hover:text-yellow-200 transition-colors font-pixel text-sm">Features</a>
          <a href="/howitworks" className="text-yellow-50 hover:text-yellow-200 transition-colors font-pixel text-sm">How It Works</a>
          <Link href="/livestreams" className="text-yellow-50 hover:text-yellow-200 transition-colors font-pixel text-sm">Livestreams</Link>
          <Link href="/leaderboard" className="text-yellow-50 hover:text-yellow-200 transition-colors font-pixel text-sm">Leaderboard</Link>
          <Link href="/chart" className="text-yellow-50 hover:text-yellow-200 transition-colors font-pixel text-sm">Chart</Link>
          <a href="/about" className="text-yellow-50 hover:text-yellow-200 transition-colors font-pixel text-sm">About</a>
        </div>
        <button className="bg-yellow-400 hover:bg-yellow-300 text-black px-6 py-2 border-2 border-black rounded-none font-pixel uppercase tracking-wider transition-colors">
          Connect Wallet
        </button>
      </nav>
    </header>
  );
};

export default Header; 