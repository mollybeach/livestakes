'use client';

import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';

interface AuthContextType {
  isLoggedIn: boolean;
  walletAddress: string | null;
  chainId: number | null;
  user: any;
  login: () => void;
  logout: () => void;
  ready: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { ready, authenticated, user, login, logout } = usePrivy();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);

  useEffect(() => {
    if (authenticated && user?.wallet?.address) {
      setWalletAddress(user.wallet.address);
      // Flow EVM Testnet chain ID is 545
      const currentChainId = user.wallet.chainId;
      setChainId(typeof currentChainId === 'string' ? parseInt(currentChainId) : (currentChainId || 545));
    } else {
      setWalletAddress(null);
      setChainId(null);
    }
  }, [authenticated, user]);

  const value: AuthContextType = {
    isLoggedIn: authenticated,
    walletAddress,
    chainId,
    user,
    login,
    logout,
    ready,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};