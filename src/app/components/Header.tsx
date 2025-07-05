import React from 'react';
import Link from 'next/link';
import {
  Home,
  MonitorPlay,
  Trophy,
  BarChart3,
  Info,
  Settings,
  Wallet,
} from "lucide-react";

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
          <Link href="/livestreams" className="flex items-center gap-2 text-yellow-50 hover:text-yellow-200 transition-colors font-pixel text-sm border border-transparent px-2 py-1">
            <MonitorPlay size={16} />
            <span>Livestreams</span>
          </Link>
          <Link href="/leaderboard" className="flex items-center gap-2 text-yellow-50 hover:text-yellow-200 transition-colors font-pixel text-sm border border-transparent px-2 py-1">
            <Trophy size={16} />
            <span>Leaderboard</span>
          </Link>
          <Link href="/chart" className="flex items-center gap-2 text-yellow-50 hover:text-yellow-200 transition-colors font-pixel text-sm border border-transparent px-2 py-1">
            <BarChart3 size={16} />
            <span>Chart</span>
          </Link>
          <Link href="/features" className="flex items-center gap-2 text-yellow-50 hover:text-yellow-200 transition-colors font-pixel text-sm border border-transparent px-2 py-1">
            <Settings size={16} />
            <span>Features</span>
          </Link>
          <Link href="/howitworks" className="flex items-center gap-2 text-yellow-50 hover:text-yellow-200 transition-colors font-pixel text-sm border border-transparent px-2 py-1">
            <Info size={16} />
            <span>How It Works</span>
          </Link>
          <Link href="/about" className="flex items-center gap-2 text-yellow-50 hover:text-yellow-200 transition-colors font-pixel text-sm border border-transparent px-2 py-1">
            <Home size={16} />
            <span>About</span>
          </Link>
        </div>
        <button className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black px-6 py-2 border-2 border-black rounded-none font-pixel uppercase tracking-wider transition-colors">
          <Wallet size={16} />
          <span>Connect Wallet</span>
        </button>
      </nav>
    </header>
  );
};

export default Header; 