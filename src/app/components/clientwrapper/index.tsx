// ClientWrapper.tsx
"use client";

import React from 'react';
import { AuthProvider } from "../../context/AuthContext";
import { PrivyProvider } from "@privy-io/react-auth";

// Flow EVM Testnet configuration
const flowEvmTestnet = {
  id: 545,
  name: 'Flow EVM Testnet',
  network: 'flow-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Flow',
    symbol: 'FLOW',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet.evm.nodes.onflow.org'],
    },
    public: {
      http: ['https://testnet.evm.nodes.onflow.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Flow EVM Testnet Explorer',
      url: 'https://evm-testnet.flowscan.io',
    },
  },
  testnet: true,
};

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''}
      config={{
        loginMethods: ['wallet', 'email'],
        appearance: {
          theme: 'dark',
          accentColor: '#8B5CF6',
          logo: 'https://res.cloudinary.com/storagemanagementcontainer/image/upload/v1751729735/live-stakes-icon_cfc7t8.png',
        },
        defaultChain: flowEvmTestnet,
        supportedChains: [flowEvmTestnet],
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      <AuthProvider>
        {children}
      </AuthProvider>
    </PrivyProvider>
  );
}
