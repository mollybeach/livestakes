"use client";
import React, { useState, useEffect } from "react";
import Markets from "../components/Markets";

interface MarketData {
  id: number;
  title: string;
  description: string;
  creator_wallet_address: string;
  status: 'active' | 'ended' | 'scheduled';
  start_time?: string;
  end_time?: string;
  view_count?: number;
  category: string;
  totalVolume?: number;
  participants?: number;
  odds?: string;
  prediction?: string;
  result?: 'Won' | 'Lost' | 'Pending';
}

const MarketsPage = () => {
  const [markets, setMarkets] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/markets');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
          setMarkets(data.data || []);
        } else {
          throw new Error('Failed to fetch markets');
        }
      } catch (err) {
        console.error('Error fetching markets:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch markets');
      } finally {
        setLoading(false);
      }
    };

    fetchMarkets();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex font-pixel bg-purple-200">
        <div className="flex-1 overflow-y-auto flex items-center justify-center">
          <div className="text-2xl text-purple-800">Loading markets...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex font-pixel bg-purple-200">
        <div className="flex-1 overflow-y-auto flex items-center justify-center">
          <div className="text-2xl text-red-600">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex font-pixel bg-purple-200">
      {/* Markets Content */}
      <div className="flex-1 overflow-y-auto">
        <Markets markets={markets} />
      </div>
    </div>
  );
};

export default MarketsPage; 