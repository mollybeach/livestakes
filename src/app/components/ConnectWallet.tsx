'use client';

import React from 'react';
import { usePrivy } from '@privy-io/react-auth';

export default function ConnectWallet() {
  const { ready, authenticated, user, login, logout } = usePrivy();

  // Don't render anything until Privy is ready
  if (!ready) {
    return (
      <div className="bg-gray-700 px-4 py-2 rounded-lg animate-pulse">
        <div className="h-4 w-20 bg-gray-600 rounded"></div>
      </div>
    );
  }

  if (authenticated && user) {
    // Get the EVM wallet address for display
    const walletAddress = user.wallet?.address;
    const displayAddress = walletAddress 
      ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
      : 'Connected';

    return (
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 bg-green-600/20 border border-green-500/30 px-3 py-2 rounded-lg">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span className="text-sm text-green-300">{displayAddress}</span>
          <span className="text-xs text-gray-400">FLOW</span>
        </div>
        <button
          onClick={logout}
          className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm font-medium transition-all"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={login}
      className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105"
    >
      Connect Wallet
    </button>
  );
} 