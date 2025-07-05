import React from 'react';
import SocialIcon from './SocialIcon';

const Footer = () => {
  return (
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
  );
};

export default Footer; 