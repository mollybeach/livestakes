'use client';

import React, { useState, useEffect } from 'react';
import { getMarketsForLivestream, getMarketInfo, MarketState } from '../lib/contractsApi';

interface BettingIndicatorProps {
  livestreamId: number;
  className?: string;
}

const BettingIndicator: React.FC<BettingIndicatorProps> = ({ livestreamId, className = '' }) => {
  const [hasActiveMarkets, setHasActiveMarkets] = useState(false);
  const [marketCount, setMarketCount] = useState(0);
  const [totalPool, setTotalPool] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMarketStatus();
  }, [livestreamId]);

  const loadMarketStatus = async () => {
    try {
      const markets = await getMarketsForLivestream(livestreamId);
      setMarketCount(markets.length);

      if (markets.length > 0) {
        // Check if any markets are active and calculate total pool
        const marketInfoPromises = markets.map(market => getMarketInfo(market));
        const marketInfos = await Promise.all(marketInfoPromises);
        
        const activeMarkets = marketInfos.filter(info => info.state === MarketState.Open);
        const totalETH = marketInfos.reduce((sum, info) => sum + parseFloat(info.totalPool), 0);
        
        setHasActiveMarkets(activeMarkets.length > 0);
        setTotalPool(totalETH);
      }
    } catch (error) {
      console.error('Error loading market status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600 ${className}`}>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse mr-1"></div>
        Loading...
      </div>
    );
  }

  if (!hasActiveMarkets && marketCount === 0) {
    return (
      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600 ${className}`}>
        <div className="w-2 h-2 bg-gray-400 rounded-full mr-1"></div>
        No Markets
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${className} ${
      hasActiveMarkets 
        ? 'bg-green-100 text-green-700' 
        : 'bg-yellow-100 text-yellow-700'
    }`}>
      <div className={`w-2 h-2 rounded-full mr-1 ${
        hasActiveMarkets ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'
      }`}></div>
      {hasActiveMarkets ? (
        <>
          🎯 {marketCount} Market{marketCount > 1 ? 's' : ''}
          {totalPool > 0 && (
            <span className="ml-1 text-xs opacity-75">
              ({totalPool.toFixed(3)} ETH)
            </span>
          )}
        </>
      ) : (
        `${marketCount} Closed`
      )}
    </div>
  );
};

export default BettingIndicator; 