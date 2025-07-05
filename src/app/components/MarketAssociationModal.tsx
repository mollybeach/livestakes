'use client';

import React, { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { 
  associateMarketWithLivestream,
  getMarketInfo,
  getNetworkInfo 
} from '../lib/contractsApi';

interface MarketAssociationModalProps {
  isOpen: boolean;
  onClose: () => void;
  livestreamId: number;
  livestreamTitle: string;
  onMarketAssociated?: (marketAddress: string) => void;
}

interface MarketInfo {
  address: string;
  question: string;
  title: string;
  state: number;
  totalPool: string;
  isAssociated: boolean;
}

const MarketAssociationModal: React.FC<MarketAssociationModalProps> = ({
  isOpen,
  onClose,
  livestreamId,
  livestreamTitle,
  onMarketAssociated
}) => {
  const { authenticated } = usePrivy();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [marketAddress, setMarketAddress] = useState<string>('');
  const [marketInfo, setMarketInfo] = useState<MarketInfo | null>(null);
  const [associatedMarkets, setAssociatedMarkets] = useState<string[]>([]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      loadAssociatedMarkets();
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const loadAssociatedMarkets = async () => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3334/api';
      const response = await fetch(`${API_BASE_URL}/markets?livestream_id=${livestreamId}`);
      const data = await response.json();
      
      if (data.success) {
        setAssociatedMarkets(data.market_addresses || []);
      }
    } catch (err) {
      console.error('Error loading associated markets:', err);
    }
  };

  const validateMarketAddress = (address: string): boolean => {
    // Basic ETH address validation
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const handleLookupMarket = async () => {
    if (!marketAddress) {
      setError('Please enter a market address');
      return;
    }

    if (!validateMarketAddress(marketAddress)) {
      setError('Please enter a valid market address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const info = await getMarketInfo(marketAddress);
      setMarketInfo({
        address: marketAddress,
        question: info.question,
        title: info.livestreamTitles?.[0] || '',
        state: info.state,
        totalPool: info.totalPool,
        isAssociated: associatedMarkets.includes(marketAddress)
      });
    } catch (err) {
      setError('Market not found or invalid address');
      setMarketInfo(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssociateMarket = async () => {
    if (!marketInfo || !authenticated) {
      setError('Please connect your wallet and lookup a market first');
      return;
    }

    if (marketInfo.isAssociated) {
      setError('Market is already associated with this livestream');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await associateMarketWithLivestream(marketAddress, livestreamId);
      
      // Update local state
      setAssociatedMarkets(prev => [...prev, marketAddress]);
      setMarketInfo(prev => prev ? { ...prev, isAssociated: true } : null);
      
      // Call callback
      if (onMarketAssociated) {
        onMarketAssociated(marketAddress);
      }

      setError('');
      // Show success message briefly
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError('Failed to associate market. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setMarketAddress('');
    setMarketInfo(null);
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Associate Market with Livestream
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Livestream Info */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-1">Livestream</h3>
            <p className="text-blue-700">{livestreamTitle}</p>
            <p className="text-sm text-blue-600 mt-1">
              ID: {livestreamId} • Network: {getNetworkInfo().networkName}
            </p>
          </div>

          {/* Associated Markets */}
          {associatedMarkets.length > 0 && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">
                Associated Markets ({associatedMarkets.length})
              </h3>
              <div className="space-y-2">
                {associatedMarkets.map((address, index) => (
                  <div key={index} className="text-sm text-green-700 font-mono">
                    {address}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Wallet Connection Check */}
          {!authenticated ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">Connect your wallet to associate markets</p>
              <button
                onClick={onClose}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Market Address Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Market Contract Address
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={marketAddress}
                    onChange={(e) => setMarketAddress(e.target.value)}
                    placeholder="0x..."
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
                  />
                  <button
                    onClick={handleLookupMarket}
                    disabled={isLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Looking up...' : 'Lookup'}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Enter the contract address of the market you want to associate
                </p>
              </div>

              {/* Market Info Display */}
              {marketInfo && (
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">Market Information</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Question:</span>
                      <p className="text-sm text-gray-800">{marketInfo.question}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Title:</span>
                      <p className="text-sm text-gray-800">{marketInfo.title}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">State:</span>
                      <span className={`text-sm ml-2 px-2 py-1 rounded-full ${
                        marketInfo.state === 0 ? 'bg-green-100 text-green-800' :
                        marketInfo.state === 1 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {marketInfo.state === 0 ? 'Open' : marketInfo.state === 1 ? 'Closed' : 'Resolved'}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Total Pool:</span>
                      <span className="text-sm text-gray-800 ml-2">{marketInfo.totalPool} ETH</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Association Status:</span>
                      <span className={`text-sm ml-2 px-2 py-1 rounded-full ${
                        marketInfo.isAssociated ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {marketInfo.isAssociated ? 'Already Associated' : 'Not Associated'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleAssociateMarket}
                  disabled={isLoading || !marketInfo || marketInfo.isAssociated}
                  className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Associating...' : 'Associate Market'}
                </button>
                <button
                  onClick={resetForm}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium"
                >
                  Reset
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-gray-500 text-white hover:bg-gray-600 rounded-lg font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketAssociationModal; 