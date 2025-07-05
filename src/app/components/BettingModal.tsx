'use client';

import React, { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import {
  getMarketsForLivestream,
  getMarketInfo,
  placeBet,
  getUserBets,
  getMarketOdds,
  createMarket,
  claimPayout,
  BetSide,
  MarketState,
  MarketInfo,
  UserBets,
  MarketOdds,
  connectWallet,
  isWalletAvailable,
  getNetworkInfo,
  isContractDeployed
} from '../lib/contractsApi';

interface BettingModalProps {
  isOpen: boolean;
  onClose: () => void;
  livestreamId: number;
  livestreamTitle: string;
  livestreamDescription?: string;
}

const BettingModal: React.FC<BettingModalProps> = ({
  isOpen,
  onClose,
  livestreamId,
  livestreamTitle,
  livestreamDescription
}) => {
  const { authenticated, user } = usePrivy();
  const [markets, setMarkets] = useState<string[]>([]);
  const [selectedMarket, setSelectedMarket] = useState<string>('');
  const [marketInfo, setMarketInfo] = useState<MarketInfo | null>(null);
  const [userBets, setUserBets] = useState<UserBets>({ yesBets: '0', noBets: '0' });
  const [marketOdds, setMarketOdds] = useState<MarketOdds>({ yesOdds: 50, noOdds: 50 });
  const [betAmount, setBetAmount] = useState<string>('0.01');
  const [selectedSide, setSelectedSide] = useState<BetSide>(BetSide.Yes);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [showCreateMarket, setShowCreateMarket] = useState(false);
  const [newMarketQuestion, setNewMarketQuestion] = useState('');
  const [walletAddress, setWalletAddress] = useState<string>('');

  // Load markets and wallet info on open
  useEffect(() => {
    if (isOpen) {
      loadMarkets();
      if (authenticated && user?.wallet?.address) {
        setWalletAddress(user.wallet.address);
      }
    }
  }, [isOpen, authenticated, user]);

  // Load market info when selected market changes
  useEffect(() => {
    if (selectedMarket) {
      loadMarketInfo();
    }
  }, [selectedMarket, walletAddress]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup on unmount
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

  const loadMarkets = async () => {
    try {
      const marketAddresses = await getMarketsForLivestream(livestreamId);
      setMarkets(marketAddresses);
      
      if (marketAddresses.length > 0) {
        setSelectedMarket(marketAddresses[0]);
      } else {
        setShowCreateMarket(true);
      }
    } catch (err) {
      console.error('Error loading markets:', err);
      setError('Failed to load markets');
    }
  };

  const loadMarketInfo = async () => {
    if (!selectedMarket) return;

    try {
      const [info, odds] = await Promise.all([
        getMarketInfo(selectedMarket),
        getMarketOdds(selectedMarket)
      ]);

      setMarketInfo(info);
      setMarketOdds(odds);

      // Load user bets if wallet is connected
      if (walletAddress) {
        const bets = await getUserBets(selectedMarket, walletAddress);
        setUserBets(bets);
      }
    } catch (err) {
      console.error('Error loading market info:', err);
      setError('Failed to load market information');
    }
  };

  const handleConnectWallet = async () => {
    try {
      const address = await connectWallet();
      setWalletAddress(address);
      setError('');
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setError('Failed to connect wallet. Please install MetaMask.');
    }
  };

  const handleCreateMarket = async () => {
    if (!newMarketQuestion.trim()) {
      setError('Please enter a market question');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const marketAddress = await createMarket(
        livestreamId,
        newMarketQuestion,
        livestreamTitle
      );

      console.log('Market created:', marketAddress);
      
      // Refresh markets
      await loadMarkets();
      setSelectedMarket(marketAddress);
      setShowCreateMarket(false);
      setNewMarketQuestion('');
    } catch (err) {
      console.error('Error creating market:', err);
      setError('Failed to create market. You may not have permission.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlaceBet = async () => {
    if (!selectedMarket || !betAmount || !walletAddress) {
      setError('Please connect wallet and enter bet amount');
      return;
    }

    const amount = parseFloat(betAmount);
    if (amount <= 0) {
      setError('Please enter a valid bet amount');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const txHash = await placeBet(selectedMarket, selectedSide, betAmount);
      console.log('Bet placed:', txHash);
      
      // Refresh market info
      await loadMarketInfo();
      
      // Clear bet amount
      setBetAmount('0.01');
    } catch (err) {
      console.error('Error placing bet:', err);
      setError('Failed to place bet. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClaimPayout = async () => {
    if (!selectedMarket) return;

    setIsLoading(true);
    setError('');

    try {
      const txHash = await claimPayout(selectedMarket);
      console.log('Payout claimed:', txHash);
      
      // Refresh market info
      await loadMarketInfo();
    } catch (err) {
      console.error('Error claiming payout:', err);
      setError('Failed to claim payout. You may not have winning bets.');
    } finally {
      setIsLoading(false);
    }
  };

  const getMarketStateLabel = (state: MarketState) => {
    switch (state) {
      case MarketState.Open: return 'Open';
      case MarketState.Closed: return 'Closed';
      case MarketState.Resolved: return 'Resolved';
      default: return 'Unknown';
    }
  };

  const formatEther = (value: string) => {
    return parseFloat(value).toFixed(4);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4"
      onClick={(e) => {
        // Close modal if clicking on backdrop
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Bet on Stream
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Network Info */}
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-blue-900">
                {getNetworkInfo().networkName}
              </span>
            </div>
            <p className="text-xs text-blue-700">
              Chain ID: {getNetworkInfo().chainId} | 
              <a 
                href={`${getNetworkInfo().explorerUrl}/address/${getNetworkInfo().contractAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 underline hover:text-blue-800"
              >
                View Contract
              </a>
            </p>
          </div>

          {/* Stream Info */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-1">{livestreamTitle}</h3>
            {livestreamDescription && (
              <p className="text-sm text-gray-600">{livestreamDescription}</p>
            )}
          </div>

          {/* Contract Deployment Check */}
          {!isContractDeployed() && (
            <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm text-orange-700 font-medium mb-1">
                ⚠️ Contracts not deployed
              </p>
              <p className="text-xs text-orange-600">
                Smart contracts are not deployed on {getNetworkInfo().networkName}. 
                Please deploy contracts first or switch to a network with deployed contracts.
              </p>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Wallet Connection */}
          {!authenticated || !walletAddress ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">Connect your wallet to start betting</p>
              <button
                onClick={handleConnectWallet}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Connect Wallet
              </button>
            </div>
          ) : (
            <>
              {/* Market Creation */}
              {showCreateMarket && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Create Betting Market</h3>
                  <input
                    type="text"
                    value={newMarketQuestion}
                    onChange={(e) => setNewMarketQuestion(e.target.value)}
                    placeholder="Enter market question (e.g., 'Will this stream reach 1000 viewers?')"
                    className="w-full p-2 border border-gray-300 rounded-lg mb-3"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleCreateMarket}
                      disabled={isLoading}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      {isLoading ? 'Creating...' : 'Create Market'}
                    </button>
                    <button
                      onClick={() => setShowCreateMarket(false)}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Market Selection */}
              {markets.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Market
                  </label>
                  <select
                    value={selectedMarket}
                    onChange={(e) => setSelectedMarket(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    {markets.map((market, index) => (
                      <option key={market} value={market}>
                        Market {index + 1}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Market Info */}
              {marketInfo && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">{marketInfo.question}</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Status</p>
                      <p className="font-medium">{getMarketStateLabel(marketInfo.state)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Total Pool</p>
                      <p className="font-medium">{formatEther(marketInfo.totalPool)} ETH</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Yes Odds</p>
                      <p className="font-medium text-green-600">{marketOdds.yesOdds}%</p>
                    </div>
                    <div>
                      <p className="text-gray-600">No Odds</p>
                      <p className="font-medium text-red-600">{marketOdds.noOdds}%</p>
                    </div>
                  </div>
                </div>
              )}

              {/* User Bets */}
              {(parseFloat(userBets.yesBets) > 0 || parseFloat(userBets.noBets) > 0) && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Your Bets</h4>
                  <div className="text-sm">
                    <p>Yes: {formatEther(userBets.yesBets)} ETH</p>
                    <p>No: {formatEther(userBets.noBets)} ETH</p>
                  </div>
                </div>
              )}

              {/* Betting Interface */}
              {marketInfo && marketInfo.state === MarketState.Open && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Place Your Bet</h3>
                  
                  {/* Side Selection */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Choose Side
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedSide(BetSide.Yes)}
                        className={`flex-1 p-3 rounded-lg font-medium transition-colors ${
                          selectedSide === BetSide.Yes
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        Yes ({marketOdds.yesOdds}%)
                      </button>
                      <button
                        onClick={() => setSelectedSide(BetSide.No)}
                        className={`flex-1 p-3 rounded-lg font-medium transition-colors ${
                          selectedSide === BetSide.No
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        No ({marketOdds.noOdds}%)
                      </button>
                    </div>
                  </div>

                  {/* Bet Amount */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bet Amount (ETH)
                    </label>
                    <input
                      type="number"
                      value={betAmount}
                      onChange={(e) => setBetAmount(e.target.value)}
                      min="0.001"
                      step="0.001"
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                    <div className="flex gap-2 mt-2">
                      {['0.01', '0.1', '0.5', '1.0'].map((amount) => (
                        <button
                          key={amount}
                          onClick={() => setBetAmount(amount)}
                          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
                        >
                          {amount}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Place Bet Button */}
                  <button
                    onClick={handlePlaceBet}
                    disabled={isLoading || !betAmount || parseFloat(betAmount) <= 0}
                    className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Placing Bet...' : `Bet ${betAmount} ETH on ${selectedSide === BetSide.Yes ? 'Yes' : 'No'}`}
                  </button>
                </div>
              )}

              {/* Claim Payout */}
              {marketInfo && marketInfo.state === MarketState.Resolved && (
                <div className="mb-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">
                      Market Resolved: {marketInfo.outcome === BetSide.Yes ? 'Yes' : 'No'} Won!
                    </h4>
                    <button
                      onClick={handleClaimPayout}
                      disabled={isLoading}
                      className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
                    >
                      {isLoading ? 'Claiming...' : 'Claim Payout'}
                    </button>
                  </div>
                </div>
              )}

              {/* Create Another Market */}
              {!showCreateMarket && (
                <button
                  onClick={() => setShowCreateMarket(true)}
                  className="w-full bg-yellow-600 text-white py-2 rounded-lg font-medium hover:bg-yellow-700 mb-4"
                >
                  Create New Market
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BettingModal; 