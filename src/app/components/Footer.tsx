import React from "react";

const Footer = () => (
  <footer className="bg-plum border-t-4 border-black py-4 font-pixel">
    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between px-6 text-cream">
      <div className="flex items-center gap-2 mb-2 sm:mb-0">
        <span className="text-lg">💖</span>
        <span className="font-bold">LiveStakes</span>
        <span className="text-xs text-butter ml-2">© {new Date().getFullYear()} Molly Beach, Ziz Khu, João Santos</span>
      </div>
      <div className="flex gap-4">
        <a href="#features" className="hover:text-butter text-xs">Features</a>
        <a href="#how-it-works" className="hover:text-butter text-xs">How It Works</a>
        <a href="#about" className="hover:text-butter text-xs">About</a>
        <a href="https://github.com/your-repo" target="_blank" rel="noopener noreferrer" className="hover:text-butter text-xs">GitHub</a>
      </div>
    </div>
  </footer>
);

export default Footer; 