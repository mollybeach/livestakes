'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MonitorPlay,
  Trophy,
  BarChart3,
  Info,
  Wallet,
  Wrench,
  Star,
  Store,
  PlaySquare,
  User,
  Menu,
  X,
  FileText,
} from "lucide-react";
import { LIVE_STAKES_LOGO_URL } from '../lib/cloudinary';
import ConnectWallet from './ConnectWallet';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const truncateAddress = (address: string) => {
    if (address.length <= 8) return address;
    return `${address.slice(0, 1)}..${address.slice(-1)}`;
  };

  const navItems = [
    { href: "/livestreams", icon: <MonitorPlay size={16} />, label: "Livestreams" },
    { href: "/feed", icon: <PlaySquare size={16} />, label: "Feed" },
    { href: "/leaderboard", icon: <Trophy size={16} />, label: "Leaderboard" },
    { href: "/chart", icon: <BarChart3 size={16} />, label: "Chart" },
    { href: "/markets", icon: <Store size={16} />, label: "Markets" },
    { href: "/profile", icon: <User size={16} />, label: "" },
    { 
      href: "https://evm-testnet.flowscan.org/address/0xBa0e5612237c8a7B118E16b6B6C4C2a8dD1f5f1e", 
      icon: <FileText size={16} />, 
      label: "",
      external: true
    },
  ];

  const socialLinks = [
    { href: "/about", icon: <Info size={16} />, label: "About" },
    { 
      href: "https://github.com/mollybeach/livestakes", 
      icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>, 
      label: "GitHub",
      external: true
    },
    { 
      href: "https://twitter.com/livestakes", 
      icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
      </svg>, 
      label: "Twitter",
      external: true
    },
  ];

  return (
    <header className="relative z-10 px-4 sm:px-6 py-4 bg-pink-600 border-b-4 border-black">
      <nav className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2" onClick={closeMobileMenu}>
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-cream border-2 border-black rounded-none flex items-center justify-center overflow-hidden">
            <img 
              src={LIVE_STAKES_LOGO_URL}
              alt="LiveStakes Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-base sm:text-lg font-bold text-yellow-50">livestakes.fun</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Text + Icon Links */}
          <div className="flex space-x-4">
            {navItems.map((item) => (
              <Link 
                key={item.href}
                href={item.href} 
                className={`flex items-center gap-2 text-yellow-50 hover:text-yellow-200 transition-colors text-sm border border-transparent px-2 py-1 ${
                  item.label ? '' : 'justify-center'
                }`}
                {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {item.icon}
                {item.label && <span>{item.label}</span>}
              </Link>
            ))}
          </div>

          {/* Icon-Only Links */}
          <div className="flex space-x-2">
            {socialLinks.map((item) => (
              <Link 
                key={item.href}
                href={item.href} 
                className="flex items-center justify-center text-yellow-50 hover:text-yellow-200 transition-colors text-sm border border-transparent px-2 py-1"
                {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {item.icon}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-2">
          <ConnectWallet style="header" />
          <button
            onClick={toggleMobileMenu}
            className="text-yellow-50 hover:text-yellow-200 transition-colors p-2"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop Wallet */}
        <div className="hidden md:block">
          <ConnectWallet style="header" />
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-pink-600 border-b-4 border-black z-20">
          <div className="px-4 py-6 space-y-4">
            {/* Navigation Links */}
            <div className="grid grid-cols-2 gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={`flex items-center gap-3 text-yellow-50 hover:text-yellow-200 transition-colors p-3 border border-yellow-200/20 rounded ${
                    item.label ? '' : 'justify-center'
                  }`}
                  {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {item.icon}
                  {item.label && <span className="text-sm font-medium">{item.label}</span>}
                </Link>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex justify-center space-x-4 pt-4 border-t border-yellow-200/20">
              {socialLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className="flex items-center justify-center text-yellow-50 hover:text-yellow-200 transition-colors p-2"
                  {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {item.icon}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 