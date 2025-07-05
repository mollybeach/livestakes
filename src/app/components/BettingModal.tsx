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
  const [userBets, setUserBets] = useState<UserBets>({ yesBets: '0', noBets: '0' });
  const [marketOdds, setMarketOdds] = useState<MarketOdds>({ yesOdds: 50, noOdds: 50 });
  
  // Betting state
  const [betSide, setBetSide] = useState<BetSide>(BetSide.Yes);
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
      
      if (market && market.contract_address) {
        console.log(`✅ Found market ${market.contract_address}`);
        setSelectedMarket(market.contract_address);
        setShowCreateMarket(false);
      } else {
        console.log(`⚠️ No market found for livestream ${livestreamId}, showing create market interface`);
        // Set a default market question for hackathon projects
        setNewMarketQuestion(`Will ${livestreamTitle} win the hackathon?`);
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
          livestreamId: livestreamId,
          question: marketData.question || `Will ${livestreamTitle} win?`,
          livestreamTitle: livestreamTitle,
          state: marketData.state as MarketState,
          outcome: marketData.state === 2 ? BetSide.Yes : BetSide.No, // Default to Yes if resolved
          yesBets: marketData.yes_bets || '0',
          noBets: marketData.no_bets || '0',
          totalPool: marketData.total_pool || '0',
          totalBettors: 0,
          createdAt: marketData.created_at ? new Date(marketData.created_at).getTime() : Date.now(),
          closedAt: 0,
          resolvedAt: marketData.state === 2 ? Date.now() : 0
        });
        
        // Set odds from backend data
        setMarketOdds({
          yesOdds: marketData.yes_odds || 50,
          noOdds: marketData.no_odds || 50
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
          setUserBets({ yesBets: '0', noBets: '0' });
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
    if (!selectedMarket || !authenticated || !user?.wallet?.address) {
      setError('Please connect your wallet to place a bet');
      return;
    }

    try {
      setIsPlacingBet(true);
      setError(null);
      setSuccess(null);
      
      console.log(`🎯 Placing bet: ${betAmount} FLOW on ${betSide === BetSide.Yes ? 'Yes' : 'No'}`);
      
      const txHash = await placeBet(selectedMarket, betSide, betAmount);
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
        livestreamId,
        newMarketQuestion,
        livestreamTitle
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
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              🎯 Bet on Project
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-1 truncate">{livestreamTitle}</p>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading market data...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Success State */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-green-700 text-sm">{success}</p>
              </div>
            </div>
          )}

          {/* Create Market Interface */}
          {showCreateMarket && !isLoading && (
            <div className="text-center py-6">
              <div className="text-6xl mb-4">🏗️</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Market</h3>
              <p className="text-sm text-gray-600 mb-4">
                This hackathon project doesn't have a betting market yet. Create one to get started!
              </p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Market Question
                </label>
                <input
                  type="text"
                  value={newMarketQuestion}
                  onChange={(e) => setNewMarketQuestion(e.target.value)}
                  placeholder="Will this project win the hackathon?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <button
                onClick={handleCreateMarket}
                disabled={isCreatingMarket || !newMarketQuestion.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center"
              >
                {isCreatingMarket ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
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
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-1">
                  {marketInfo.question}
                </h3>
                <p className="text-sm text-gray-600">
                  Total Pool: {parseFloat(marketInfo.totalPool).toFixed(2)} FLOW
                </p>
              </div>

              {/* Market Status */}
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  marketInfo.state === MarketState.Open 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {marketInfo.state === MarketState.Open ? '🟢 Active' : '🔴 Closed'}
                </span>
                <div className="text-sm text-gray-600">
                  Yes: {marketOdds.yesOdds}% • No: {marketOdds.noOdds}%
                </div>
              </div>

              {/* Betting Form */}
              {marketInfo.state === MarketState.Open && (
                <div className="space-y-4">
                  {/* Bet Side Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Choose Your Prediction
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setBetSide(BetSide.Yes)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          betSide === BetSide.Yes
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-lg font-semibold">✅ Yes</div>
                        <div className="text-sm opacity-75">{marketOdds.yesOdds}% odds</div>
                      </button>
                      
                      <button
                        onClick={() => setBetSide(BetSide.No)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          betSide === BetSide.No
                            ? 'border-red-500 bg-red-50 text-red-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-lg font-semibold">❌ No</div>
                        <div className="text-sm opacity-75">{marketOdds.noOdds}% odds</div>
                      </button>
                    </div>
                  </div>

                  {/* Amount Slider */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bet Amount: {betAmount} FLOW
                    </label>
                    <div className="space-y-3">
                      <input
                        type="range"
                        min="1"
                        max="100"
                        value={sliderValue}
                        onChange={handleSliderChange}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
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
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <span className="text-sm text-gray-600 font-medium">FLOW</span>
                      </div>
                    </div>
                  </div>

                  {/* Place Bet Button */}
                  <button
                    onClick={handlePlaceBet}
                    disabled={isPlacingBet || !authenticated}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center"
                  >
                    {isPlacingBet ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Placing Bet...
                      </>
                    ) : (
                      <>
                        <span className="mr-2">🎯</span>
                        Place Bet {betAmount} FLOW on {betSide === BetSide.Yes ? 'Yes' : 'No'}
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* User Bets */}
              {authenticated && (parseFloat(userBets.yesBets) > 0 || parseFloat(userBets.noBets) > 0) && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Your Bets</h4>
                  <div className="space-y-1 text-sm">
                    {parseFloat(userBets.yesBets) > 0 && (
                      <div className="flex justify-between text-blue-800">
                        <span>✅ Yes</span>
                        <span>{userBets.yesBets} FLOW</span>
                      </div>
                    )}
                    {parseFloat(userBets.noBets) > 0 && (
                      <div className="flex justify-between text-blue-800">
                        <span>❌ No</span>
                        <span>{userBets.noBets} FLOW</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Claim Payout Button */}
                  {marketInfo.state === MarketState.Resolved && (
                    <button
                      onClick={handleClaimPayout}
                      disabled={isClaiming}
                      className="w-full mt-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center"
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