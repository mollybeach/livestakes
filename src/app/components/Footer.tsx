'use client';

import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-pink-600 border-t-4 border-black text-yellow-50 px-4 sm:px-6 py-4 sm:py-6 font-pixel">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-6">
          
          {/* Brand Section */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <h3 className="text-sm sm:text-lg font-bold mb-2">livestakes.fun</h3>
            <p className="text-xs text-yellow-200 leading-relaxed">
              AI-powered livestream betting platform. Watch, predict, and earn.
            </p>
          </div>

          {/* Quick Links - Hide on mobile for minimalism */}
          <div className="hidden sm:block">
            <h4 className="text-sm font-bold mb-2">Platform</h4>
            <ul className="space-y-1 text-xs">
              <li><Link href="/livestreams" className="text-yellow-200 hover:text-yellow-50 transition-colors">Livestreams</Link></li>
              <li><Link href="/markets" className="text-yellow-200 hover:text-yellow-50 transition-colors">Markets</Link></li>
              <li><Link href="/leaderboard" className="text-yellow-200 hover:text-yellow-50 transition-colors">Leaderboard</Link></li>
              <li><Link href="/chart" className="text-yellow-200 hover:text-yellow-50 transition-colors">Analytics</Link></li>
            </ul>
          </div>

          {/* Support - Hide on mobile */}
          <div className="hidden lg:block">
            <h4 className="text-sm font-bold mb-2">Support</h4>
            <ul className="space-y-1 text-xs">
              <li><Link href="/features" className="text-yellow-200 hover:text-yellow-50 transition-colors">Features</Link></li>
              <li><Link href="/support" className="text-yellow-200 hover:text-yellow-50 transition-colors">Help Center</Link></li>
              <li><Link href="/about" className="text-yellow-200 hover:text-yellow-50 transition-colors">About</Link></li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-sm font-bold mb-2">Connect</h4>
            <div className="flex gap-3">
              <a 
                href="https://github.com/mollybeach/livestakes" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-yellow-200 hover:text-yellow-50 transition-colors"
                title="GitHub"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a 
                href="https://twitter.com/livestakes" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-yellow-200 hover:text-yellow-50 transition-colors"
                title="Twitter"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-pink-500 pt-3 sm:pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
          <p className="text-xs text-yellow-200 text-center sm:text-left">
            © 2024 livestakes.fun. All rights reserved.
          </p>
          <div className="flex gap-3 sm:gap-4 text-xs">
            <Link href="/privacy" className="text-yellow-200 hover:text-yellow-50 transition-colors">Privacy</Link>
            <Link href="/terms" className="text-yellow-200 hover:text-yellow-50 transition-colors">Terms</Link>
            <span className="text-yellow-200">Made with 💜</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 