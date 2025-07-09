'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePrivy } from '@privy-io/react-auth';
import MarketCreationModal from './MarketCreationModal';
import MarketAssociationModal from './MarketAssociationModal';

// Video Upload Modal Component
interface VideoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  userWalletAddress?: string;
}

const VideoUploadModal: React.FC<VideoUploadModalProps> = ({ isOpen, onClose, userWalletAddress }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [marketAddress, setMarketAddress] = useState<string>('');
  const [availableMarkets, setAvailableMarkets] = useState<any[]>([]);
  const [isLoadingMarkets, setIsLoadingMarkets] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch available markets when modal opens
  React.useEffect(() => {
    if (isOpen) {
      fetchAvailableMarkets();
    }
  }, [isOpen]);

  const fetchAvailableMarkets = async () => {
    setIsLoadingMarkets(true);
    setError(null);
    try {
      // Fetch markets from backend API
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${API_BASE_URL}/markets/metadata?limit=50`);
      
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.markets) {
          setAvailableMarkets(result.markets);
        } else {
          throw new Error('Failed to fetch markets from backend');
        }
      } else {
        throw new Error('Backend API unavailable');
      }
    } catch (error) {
      console.error('Error fetching markets:', error);
      // Fallback: try to get markets from contract (commented for now, can be implemented later)
      setError('Unable to load available markets. Please try again.');
      setAvailableMarkets([]);
    } finally {
      setIsLoadingMarkets(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check if it's a video file
      if (file.type.startsWith('video/')) {
        setSelectedFile(file);
        setError(null);
      } else {
        setError('Please select a video file (MP4, MOV, etc.)');
        setSelectedFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !marketAddress || !userWalletAddress) {
      setError('Please select a video file and enter a market address');
      return;
    }

    setIsUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append('video', selectedFile);
      formData.append('market_address', marketAddress);
      formData.append('creator_wallet_address', userWalletAddress);

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${API_BASE_URL}/upload-video-simple`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setSuccess('Video uploaded successfully! 🎉');
        // Reset form
        setSelectedFile(null);
        setMarketAddress('');
        // Close modal after delay
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        setError(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError('Network error during upload');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    if (!isUploading) {
      setSelectedFile(null);
      setMarketAddress('');
      setAvailableMarkets([]);
      setError(null);
      setSuccess(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">📹 Upload Video</h2>
            <button
              onClick={handleClose}
              disabled={isUploading}
              className="text-gray-400 hover:text-gray-600 transition-colors disabled:cursor-not-allowed"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-1">Upload your hackathon project video</p>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-4">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-green-700 text-sm">{success}</p>
              </div>
            </div>
          )}

          {/* File Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Video File
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              disabled={isUploading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            {selectedFile && (
              <p className="text-sm text-gray-600 mt-1">
                Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(1)} MB)
              </p>
            )}
          </div>

          {/* Market Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Select Market
              </label>
              <button
                onClick={fetchAvailableMarkets}
                disabled={isLoadingMarkets || isUploading}
                className="text-xs text-green-600 hover:text-green-800 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                🔄 Refresh
              </button>
            </div>
            {isLoadingMarkets ? (
              <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 flex items-center">
                <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                <span className="text-gray-600">Loading markets...</span>
              </div>
            ) : availableMarkets.length > 0 ? (
              <select
                value={marketAddress}
                onChange={(e) => setMarketAddress(e.target.value)}
                disabled={isUploading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Choose a market...</option>
                {availableMarkets.map((market) => (
                  <option key={market.contract_address} value={market.contract_address}>
                    {market.contract_address.slice(0, 8)}...{market.contract_address.slice(-6)} - {market.category || 'General'}
                  </option>
                ))}
              </select>
            ) : (
              <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
                <div className="text-gray-500 text-center mb-2">No markets available</div>
                <button
                  onClick={() => {
                    handleClose();
                    // This would trigger the market creation modal
                    // You could add a callback prop to open market creation
                  }}
                  className="w-full text-xs bg-purple-100 hover:bg-purple-200 text-purple-700 py-1 px-2 rounded transition-colors"
                >
                  📊 Create New Market First
                </button>
              </div>
            )}
            
            {/* Show selected market details */}
            {marketAddress && availableMarkets.length > 0 && (
              <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                {(() => {
                  const selectedMarket = availableMarkets.find(m => m.contract_address === marketAddress);
                  return selectedMarket ? (
                    <div className="text-sm">
                      <p className="font-medium text-blue-900">
                        {selectedMarket.category || 'General'} Market
                      </p>
                      <p className="text-blue-700 text-xs break-all">
                        Contract: {selectedMarket.contract_address}
                      </p>
                      {selectedMarket.description && (
                        <p className="text-blue-600 text-xs mt-1">
                          {selectedMarket.description}
                        </p>
                      )}
                    </div>
                  ) : null;
                })()}
              </div>
            )}
            
            <p className="text-xs text-gray-500 mt-1">
              Choose the market to associate this video with
            </p>
          </div>

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={isUploading || !selectedFile || !marketAddress || !userWalletAddress}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center"
          >
            {isUploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Uploading & Processing...
              </>
            ) : !userWalletAddress ? (
              <>
                <span className="mr-2">🔒</span>
                Connect Wallet to Upload
              </>
            ) : !selectedFile ? (
              <>
                <span className="mr-2">📹</span>
                Select Video File
              </>
            ) : !marketAddress ? (
              <>
                <span className="mr-2">📊</span>
                Choose Market
              </>
            ) : (
              <>
                <span className="mr-2">🚀</span>
                Upload & Process Video
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

interface DashboardHeaderProps {
  title?: string;
  showBackButton?: boolean;
  showStats?: boolean;
  totalStreams?: number;
  liveStreams?: number;
  onMarketCreated?: (marketAddress: string) => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title = "LiveStakes",
  showBackButton = false,
  showStats = true,
  totalStreams = 0,
  liveStreams = 0,
  onMarketCreated
}) => {
  const { authenticated, user } = usePrivy();
  const [showMarketCreation, setShowMarketCreation] = useState(false);
  const [showVideoUpload, setShowVideoUpload] = useState(false);

  const handleMarketCreated = (marketAddress: string) => {
    console.log('Market created:', marketAddress);
    // Call parent callback if provided
    if (onMarketCreated) {
      onMarketCreated(marketAddress);
    }
    // TODO: Add notification system or refresh data
  };

  return (
    <>
      <div className="bg-pink-500/90 border-2 sm:border-4 border-black rounded-none shadow-window-pixel mb-3 sm:mb-6">
        <div className="flex items-center justify-between px-2 sm:px-3 py-1 bg-pink-600 text-yellow-50 font-pixel">
          <div className="flex items-center gap-2 sm:gap-4">
            {showBackButton && (
              <Link href="/" className="text-yellow-50 hover:text-yellow-200 transition-colors">
                <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
            )}
            <span className="text-sm sm:text-lg font-bold">{title}</span>
          </div>
          
          {showStats && (
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="text-center">
                <div className="text-xs sm:text-sm font-bold text-yellow-50">{totalStreams}</div>
                <div className="text-xs text-yellow-200 hidden sm:block">Streams</div>
                <div className="text-xs text-yellow-200 sm:hidden">Total</div>
              </div>
              <div className="text-center">
                <div className="text-xs sm:text-sm font-bold text-green-400">{liveStreams}</div>
                <div className="text-xs text-yellow-200">Live</div>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse border border-black"></div>
                <span className="text-green-400 text-xs font-bold hidden sm:inline">LIVE</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Action Buttons - more compact on mobile */}
        <div className="bg-yellow-50 p-2 sm:p-4 text-black font-pixel text-xs sm:text-sm">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button 
              onClick={() => setShowMarketCreation(true)}
              className="bg-pink-600 hover:bg-pink-700 text-yellow-50 px-2 sm:px-3 py-1 border border-black rounded-none font-pixel uppercase text-xs transition-colors"
            >
              📊 Market
            </button>
            <button 
              onClick={() => setShowVideoUpload(true)}
              disabled={!authenticated}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-yellow-50 px-2 sm:px-3 py-1 border border-black rounded-none font-pixel uppercase text-xs transition-colors"
            >
              📹 Upload
            </button>
            <button className="bg-yellow-400 hover:bg-yellow-300 text-black px-2 sm:px-3 py-1 border border-black rounded-none font-pixel uppercase text-xs transition-colors hidden sm:inline-block">
              Browse Categories
            </button>
            <button className="bg-yellow-400 hover:bg-yellow-300 text-black px-2 sm:px-3 py-1 border border-black rounded-none font-pixel uppercase text-xs transition-colors hidden sm:inline-block">
              View History
            </button>
            <button className="bg-yellow-400 hover:bg-yellow-300 text-black px-2 sm:px-3 py-1 border border-black rounded-none font-pixel uppercase text-xs transition-colors sm:hidden">
              More
            </button>
          </div>
        </div>
      </div>

      {/* Market Creation Modal */}
      <MarketCreationModal
        isOpen={showMarketCreation}
        onClose={() => setShowMarketCreation(false)}
        onMarketCreated={handleMarketCreated}
      />

      {/* Video Upload Modal */}
      <VideoUploadModal
        isOpen={showVideoUpload}
        onClose={() => setShowVideoUpload(false)}
        userWalletAddress={user?.wallet?.address}
      />
    </>
  );
};

export default DashboardHeader; 