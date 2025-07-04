// ClientWrapper.tsx
"use client";

import React, { useEffect } from 'react';
import { AuthProvider } from "../../context/AuthContext";
import { DynamicContextProvider, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { SolanaWalletConnectors } from "@dynamic-labs/solana";



export const dynamicConfig = {
  environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID || '',
  walletConnectors: [SolanaWalletConnectors],
};

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {

  
  return (
    <DynamicContextProvider
      settings={dynamicConfig}
    >
      <AuthProvider>
          {children}
      </AuthProvider>
    </DynamicContextProvider>
  );
}
