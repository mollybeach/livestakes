'use client';

import React, { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import {
  getMarketInfo,
  placeBet,
  getUserBets,
  getMarketOdds,
  createMarket,
  claimPayout,
  MarketState,
  MarketInfo,
  UserBets,
  MarketOdds,
  LivestreamBet,
  connectWallet,
  isWalletAvailable,
  getNetworkInfo,
  isContractDeployed
} from '../lib/contractsApi';
import { MarketData } from '../lib/livestreamsApi';

interface BettingModalProps {
  isOpen: boolean;
  onClose: () => void;
  livestreamId: number;
  livestreamTitle: string;
  livestreamDescription?: string;
  market?: MarketData;
}

const BettingModal: React.FC<BettingModalProps> = ({
  isOpen,
  onClose,
  livestreamId,
  livestreamTitle,
  livestreamDescription,
  market,
}) => {
  const { ready, authenticated, user } = usePrivy();
  
  // Market state
  const [selectedMarket, setSelectedMarket] = useState<string>('');
  const [marketInfo, setMarketInfo] = useState<MarketInfo | null>(null);
  const [userBets, setUserBets] = useState<UserBets>({ livestreamIds: [], amounts: [] });
  const [marketOdds, setMarketOdds] = useState<MarketOdds>({ livestreamBets: [] });
  
  // Betting state
  const [selectedLivestreamId, setSelectedLivestreamId] = useState<number | null>(null);
  const [betAmount, setBetAmount] = useState<string>('0.1');
  const [sliderValue, setSliderValue] = useState<number>(10); // 10 = 0.1 FLOW
  const [isPlacingBet, setIsPlacingBet] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  
  // Market creation state
  const [showCreateMarket, setShowCreateMarket] = useState(false);
  const [newMarketQuestion, setNewMarketQuestion] = useState('');
  const [isCreatingMarket, setIsCreatingMarket] = useState(false);
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load markets when modal opens
  useEffect(() => {
    if (isOpen) {
      loadMarkets();
    }
  }, [isOpen, livestreamId, market]);

  const loadMarkets = async () => {
    try {
      console.log(`🔍 BettingModal: Loading markets for livestream ${livestreamId}...`);
      console.log(`📊 Markets data:`, market);
      
      // Always set the current livestream as selected for betting
      setSelectedLivestreamId(livestreamId);
      
      if (market && market.contract_address) {
        console.log(`✅ Found market ${market.contract_address}`);
        setSelectedMarket(market.contract_address);
        setShowCreateMarket(false);
      } else {
        console.log(`⚠️ No market found for livestream ${livestreamId}, showing create market interface`);
        // Set a default market question for hackathon projects
        setNewMarketQuestion(`Which hackathon project will win?`);
        setShowCreateMarket(true);
      }
    } catch (error) {
      console.error('Error loading markets:', error);
      setError('Failed to load markets');
    }
  };

  // Load market info when market selection changes
  useEffect(() => {
    if (selectedMarket && isOpen) {
      loadMarketInfo();
    }
  }, [selectedMarket, isOpen]);

  const loadMarketInfo = async () => {
    if (!selectedMarket) return;
    
    try {
      setIsLoading(true);
      setError(null);
      console.log(`📊 Loading market info for ${selectedMarket}...`);
      
      // First, check if we have backend data for this market
      const marketData = market && market.contract_address === selectedMarket ? market : null;
      
      if (marketData && marketData.state !== undefined) {
        // Use backend data
        console.log(`✅ Using backend market data for ${selectedMarket}`);
        setMarketInfo({
          livestreamIds: [livestreamId], // Current livestream
          question: marketData.question || `Which hackathon project will win?`,
          livestreamTitles: [livestreamTitle],
          state: marketData.state as MarketState,
          winningLivestreamId: 0, // Default to 0 if not resolved
          totalPool: marketData.total_pool || '0',
          totalBettors: 0,
          createdAt: marketData.created_at ? new Date(marketData.created_at).getTime() : Date.now(),
          closedAt: 0,
          resolvedAt: marketData.state === 2 ? Date.now() : 0
        });
        
        // Set default odds (empty for now)
        setMarketOdds({
          livestreamBets: []
        });
      } else {
        // Fallback to on-chain data
        console.log(`📡 Fetching on-chain data for ${selectedMarket}...`);
        const [info, odds] = await Promise.all([
          getMarketInfo(selectedMarket),
          getMarketOdds(selectedMarket)
        ]);
        
        setMarketInfo(info);
        setMarketOdds(odds);
      }
      
      // Always try to load user bets from blockchain
      if (authenticated && user?.wallet?.address) {
        try {
          const bets = await getUserBets(selectedMarket, user.wallet.address);
          setUserBets(bets);
        } catch (error) {
          console.warn('Could not load user bets:', error);
          setUserBets({ livestreamIds: [], amounts: [] });
        }
      }
    } catch (error) {
      console.error('Error loading market info:', error);
      setError('Failed to load market information');
    } finally {
      setIsLoading(false);
    }
  };

  // Convert slider value to FLOW amount
  const convertSliderToFlow = (value: number) => {
    // Slider range: 1-100
    // FLOW range: 0.01-10.0
    const flowAmount = (value / 100) * 10; // Max 10 FLOW
    return Math.max(0.01, flowAmount); // Min 0.01 FLOW
  };

  // Handle slider change
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setSliderValue(value);
    const flowAmount = convertSliderToFlow(value);
    setBetAmount(flowAmount.toFixed(2));
  };

  // Handle direct amount input
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBetAmount(value);
    
    // Update slider to match
    const flowValue = parseFloat(value) || 0;
    const sliderVal = Math.min(100, Math.max(1, (flowValue / 10) * 100));
    setSliderValue(sliderVal);
  };

  const handlePlaceBet = async () => {
    if (!selectedMarket || !authenticated || !user?.wallet?.address || !livestreamId) {
      setError('Please connect your wallet and select a project to bet on');
      return;
    }

    try {
      setIsPlacingBet(true);
      setError(null);
      setSuccess(null);
      
      console.log(`🎯 Placing bet: ${betAmount} FLOW on livestream ${livestreamId}`);
      
      const txHash = await placeBet(selectedMarket, livestreamId, betAmount);
      console.log(`✅ Bet placed successfully! Transaction: ${txHash}`);
      
      setSuccess(`Bet placed successfully! 🎉`);
      
      // Refresh market info and user bets
      await loadMarketInfo();
      
      // Reset form
      setSliderValue(10);
      setBetAmount('0.1');
      
    } catch (error) {
      console.error('Error placing bet:', error);
      setError(error instanceof Error ? error.message : 'Failed to place bet');
    } finally {
      setIsPlacingBet(false);
    }
  };

  const handleCreateMarket = async () => {
    if (!newMarketQuestion.trim()) {
      setError('Please enter a market question');
      return;
    }

    try {
      setIsCreatingMarket(true);
      setError(null);
      setSuccess(null);
      
      console.log(`🏗️ Creating market: ${newMarketQuestion}`);
      
      const contractAddress = await createMarket(
        newMarketQuestion,
        livestreamTitle,
        '', // description
        'hackathon', // category
        [], // tags
        [], // livestreamIds - empty for now
        [] // livestreamTitles - empty for now
      );
      
      console.log(`✅ Market created successfully! Address: ${contractAddress}`);
      
      setSuccess(`Market created successfully! 🎉`);
      setShowCreateMarket(false);
      
      // Refresh the page or reload markets
      window.location.reload();
      
    } catch (error) {
      console.error('Error creating market:', error);
      setError(error instanceof Error ? error.message : 'Failed to create market');
    } finally {
      setIsCreatingMarket(false);
    }
  };

  const handleClaimPayout = async () => {
    if (!selectedMarket || !authenticated || !user?.wallet?.address) {
      setError('Please connect your wallet to claim payout');
      return;
    }

    try {
      setIsClaiming(true);
      setError(null);
      setSuccess(null);
      
      console.log(`💰 Claiming payout for market ${selectedMarket}`);
      
      const txHash = await claimPayout(selectedMarket);
      console.log(`✅ Payout claimed successfully! Transaction: ${txHash}`);
      
      setSuccess(`Payout claimed successfully! 🎉`);
      
      // Refresh user bets
      await loadMarketInfo();
      
    } catch (error) {
      console.error('Error claiming payout:', error);
      setError(error instanceof Error ? error.message : 'Failed to claim payout');
    } finally {
      setIsClaiming(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white border-4 border-black shadow-window-pixel w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between bg-purple-600 text-yellow-50 px-3 py-1 border-b-4 border-black">
          <span className="text-xs">🎯 BETTING MODAL</span>
          <button
            onClick={onClose}
            className="bg-yellow-400 text-black px-1 border border-black leading-none"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="bg-pink-100 p-4">
          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-sm text-purple-800">Loading market data...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-100 border-2 border-red-400 rounded-none p-4 mb-4">
              <div className="flex items-center">
                <span className="text-red-600 mr-2">⚠️</span>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Success State */}
          {success && (
            <div className="bg-green-100 border-2 border-green-400 rounded-none p-4 mb-4">
              <div className="flex items-center">
                <span className="text-green-600 mr-2">✅</span>
                <p className="text-green-700 text-sm">{success}</p>
              </div>
            </div>
          )}

          {/* Create Market Interface */}
          {showCreateMarket && !isLoading && (
            <div className="text-center py-6">
              <div className="text-6xl mb-4">🏗️</div>
              <h3 className="text-lg font-bold text-purple-900 mb-2">Create Market</h3>
              <p className="text-sm text-purple-700 mb-4">
                This hackathon project doesn&apos;t have a betting market yet. Create one to get started!
              </p>
              
              <div className="mb-4">
                <label className="block text-sm font-bold text-purple-800 mb-2">
                  Market Question
                </label>
                <input
                  type="text"
                  value={newMarketQuestion}
                  onChange={(e) => setNewMarketQuestion(e.target.value)}
                  placeholder="Will this project win the hackathon?"
                  className="w-full px-3 py-2 border-2 border-black bg-white text-purple-900 focus:outline-none focus:border-purple-500"
                />
              </div>
              
              <button
                onClick={handleCreateMarket}
                disabled={isCreatingMarket || !newMarketQuestion.trim()}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-yellow-50 font-bold py-3 px-4 border-2 border-black transition-colors flex items-center justify-center"
              >
                {isCreatingMarket ? (
                  <>
                    <div className="w-4 h-4 border-2 border-yellow-50 border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating Market...
                  </>
                ) : (
                  <>
                    <span className="mr-2">🚀</span>
                    Create Market
                  </>
                )}
              </button>
            </div>
          )}

          {/* Betting Interface */}
          {!showCreateMarket && selectedMarket && marketInfo && !isLoading && (
            <div className="space-y-4">
              {/* Market Question */}
              <div className="bg-cream border-2 border-black p-4">
                <h3 className="font-bold text-purple-900 mb-1">
                  {marketInfo.question}
                </h3>
                <p className="text-sm text-purple-700">
                  Total Pool: {parseFloat(marketInfo.totalPool).toFixed(2)} FLOW
                </p>
              </div>

              {/* Market Status */}
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 border-2 border-black text-sm font-bold ${
                  Number(marketInfo.state) === MarketState.Open 
                    ? 'bg-green-400 text-green-900' 
                    : 'bg-gray-400 text-gray-900'
                }`}>
                  {Number(marketInfo.state) === MarketState.Open ? '🟢 Active' : '🔴 Closed'}
                </span>
                <div className="text-sm text-purple-700 font-bold">
                  Hackathon Competition
                </div>
              </div>

              {/* Current Project Info */}
              <div className="bg-purple-200 border-2 border-black p-4">
                <h4 className="font-bold text-purple-900 mb-1">Betting on this Project</h4>
                <p className="text-sm text-purple-800">{livestreamTitle}</p>
                <p className="text-xs text-purple-700 mt-1">
                  Bet FLOW tokens on whether this project will win the hackathon
                </p>
              </div>

              {/* Betting Form */}
              {Number(marketInfo.state) === MarketState.Open && (
                <div className="space-y-4">
                  {/* Amount Slider */}
                  <div>
                    <label className="block text-sm font-bold text-purple-800 mb-2">
                      Bet Amount: {betAmount} FLOW
                    </label>
                    <div className="space-y-3">
                      <input
                        type="range"
                        min="1"
                        max="100"
                        value={sliderValue}
                        onChange={handleSliderChange}
                        className="w-full h-2 bg-gray-200 rounded-none appearance-none cursor-pointer slider border-2 border-black"
                      />
                      <div className="flex justify-between text-xs text-purple-700 font-bold">
                        <span>0.01 FLOW</span>
                        <span>10.0 FLOW</span>
                      </div>
                      
                      {/* Direct amount input */}
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          value={betAmount}
                          onChange={handleAmountChange}
                          min="0.01"
                          max="10"
                          step="0.01"
                          className="flex-1 px-3 py-2 border-2 border-black bg-white text-purple-900 focus:outline-none focus:border-purple-500"
                        />
                        <span className="text-sm text-purple-800 font-bold">FLOW</span>
                      </div>
                    </div>
                  </div>

                  {/* Place Bet Button */}
                  <button
                    onClick={handlePlaceBet}
                    disabled={isPlacingBet || !authenticated}
                    className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-yellow-50 font-bold py-3 px-4 border-2 border-black transition-colors flex items-center justify-center"
                  >
                    {isPlacingBet ? (
                      <>
                        <div className="w-4 h-4 border-2 border-yellow-50 border-t-transparent rounded-full animate-spin mr-2"></div>
                        Placing Bet...
                      </>
                    ) : (
                      <>
                        <span className="mr-2">🎯</span>
                        Bet {betAmount} FLOW on {livestreamTitle}
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* User Bets */}
              {authenticated && userBets.livestreamIds.length > 0 && (
                <div className="bg-blue-200 border-2 border-black p-4">
                  <h4 className="font-bold text-blue-900 mb-2">Your Bets</h4>
                  <div className="space-y-1 text-sm">
                    {userBets.livestreamIds.map((id, index) => (
                      <div key={id} className="flex justify-between text-blue-800 font-bold">
                        <span>🎯 Project {id}</span>
                        <span>{userBets.amounts[index]} FLOW</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Claim Payout Button */}
                  {Number(marketInfo.state) === MarketState.Resolved && (
                    <button
                      onClick={handleClaimPayout}
                      disabled={isClaiming}
                      className="w-full mt-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2 px-4 border-2 border-black transition-colors flex items-center justify-center"
                    >
                      {isClaiming ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Claiming...
                        </>
                      ) : (
                        <>
                          <span className="mr-2">💰</span>
                          Claim Payout
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BettingModal; 