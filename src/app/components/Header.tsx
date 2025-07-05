import React from 'react';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="relative z-10 px-6 py-4">
      <nav className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">L</span>
          </div>
          <span className="text-xl font-bold">livestakes.fun</span>
        </Link>
        <div className="hidden md:flex space-x-6">
          <a href="#features" className="hover:text-purple-300 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-purple-300 transition-colors">How It Works</a>
          <Link href="/livestreams" className="hover:text-purple-300 transition-colors">Livestreams</Link>
          <a href="#about" className="hover:text-purple-300 transition-colors">About</a>
        </div>
        <Link href="/livestakes">
          <button className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all">
            Launch App
          </button>
        </Link>
      </nav>
    </header>
  );
};

export default Header; 