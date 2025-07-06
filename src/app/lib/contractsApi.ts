// Smart Contracts API for Betting on Livestreams
import { ethers, Contract, formatEther, parseEther, JsonRpcProvider, BrowserProvider } from 'ethers';
import { mockLivestreams } from '../data/livestreams';
import type { LivestreamDataType, MarketDataType } from '../../types/types';

// API Base URL for backend calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3334/api';

// Contract addresses - update these after deployment
const CONTRACTS = {
  // Local development
  localhost: {
    MarketFactory: '0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1',
    chainId: 1337,
    rpcUrl: 'http://localhost:8545'
  },
  // Flow EVM Testnet
  'flow-testnet': {
    MarketFactory: '0xBa0e5612237c8a7B118E16b6B6C4C2a8dD1f5f1e',
    chainId: 545,
    rpcUrl: 'https://testnet.evm.nodes.onflow.org'
  },
  // Ethereum Sepolia
  sepolia: {
    MarketFactory: '', // Update after deployment
    chainId: 11155111,
    rpcUrl: 'https://sepolia.infura.io/v3/YOUR_PROJECT_ID'
  }
};

// Current network - change this to switch networks
const CURRENT_NETWORK = 'flow-testnet'; // 'localhost' | 'flow-testnet' | 'sepolia'
const MARKET_FACTORY_ADDRESS = CONTRACTS[CURRENT_NETWORK].MarketFactory;

// Helper function to get current network config
export function getCurrentNetworkConfig() {
  return CONTRACTS[CURRENT_NETWORK];
}

// Helper function to check if contract is deployed
export function isContractDeployed() {
  return MARKET_FACTORY_ADDRESS && MARKET_FACTORY_ADDRESS !== '';
}

// Network information for users
export function getNetworkInfo() {
  const config = CONTRACTS[CURRENT_NETWORK];
  const networkNames = {
    localhost: 'Local Development',
    'flow-testnet': 'Flow EVM Testnet',
    sepolia: 'Ethereum Sepolia Testnet'
  };
  
  const explorers = {
    localhost: 'http://localhost:8545',
    'flow-testnet': 'https://evm-testnet.flowscan.org',
    sepolia: 'https://sepolia.etherscan.io'
  };
  
  const faucets = {
    localhost: null,
    'flow-testnet': 'https://testnet-faucet.onflow.org/',
    sepolia: 'https://sepoliafaucet.com/'
  };
  
  return {
    networkId: CURRENT_NETWORK,
    networkName: networkNames[CURRENT_NETWORK],
    chainId: config.chainId,
    rpcUrl: config.rpcUrl,
    explorerUrl: explorers[CURRENT_NETWORK],
    faucetUrl: faucets[CURRENT_NETWORK],
    contractAddress: config.MarketFactory
  };
}

// Test market address from deployment
export const TEST_MARKET_ADDRESS = '0x531A0148643e4D5F8Da1F818b16a56b065709D12';

// Contract ABIs - Import from artifacts for accuracy
import MarketFactoryArtifact from '../../blockchain/artifacts/contracts/MarketFactory.sol/MarketFactory.json';
import PredictionMarketArtifact from '../../blockchain/artifacts/contracts/PredictionMarket.sol/PredictionMarket.json';

const MARKET_FACTORY_ABI = MarketFactoryArtifact.abi;

const PREDICTION_MARKET_ABI = PredictionMarketArtifact.abi;

export enum MarketState {
  Open = 0,
  Closed = 1,
  Resolved = 2
}

// Helper function to convert market state to readable string
export function getMarketStateLabel(state: MarketState): string {
  switch (state) {
    case MarketState.Open:
      return 'Open';
    case MarketState.Closed:
      return 'Closed';
    case MarketState.Resolved:
      return 'Resolved';
    default:
      return 'Unknown';
  }
}

// Helper function to get market state status with color
export function getMarketStateStatus(state: MarketState): { label: string; color: string } {
  switch (state) {
    case MarketState.Open:
      return { label: 'Open', color: 'green' };
    case MarketState.Closed:
      return { label: 'Closed', color: 'yellow' };
    case MarketState.Resolved:
      return { label: 'Resolved', color: 'blue' };
    default:
      return { label: 'Unknown', color: 'gray' };
  }
}

// Per-livestream betting data
export interface LivestreamBet {
  livestreamId: number;
  title: string;
  amount: string;
  percentage: number;
  isActive: boolean;
}

export interface MarketInfo {
  livestreamIds: number[];
  question: string;
  livestreamTitles: string[];
  state: MarketState;
  winningLivestreamId: number;
  totalPool: string;
  totalBettors: number;
  createdAt: number;
  closedAt: number;
  resolvedAt: number;
}

export interface UserBets {
  livestreamIds: number[];
  amounts: string[];
}

export interface MarketOdds {
  livestreamBets: LivestreamBet[];
}

// Get Ethereum provider
function getProvider() {
  if (typeof window !== 'undefined' && window.ethereum) {
    return new BrowserProvider(window.ethereum);
  }
  // Fallback to read-only provider
  const currentConfig = CONTRACTS[CURRENT_NETWORK];
  return new JsonRpcProvider(currentConfig.rpcUrl);
}

// Get signer for transactions
async function getSigner() {
  const provider = getProvider();
  if (provider instanceof BrowserProvider) {
    await provider.send("eth_requestAccounts", []);
    return provider.getSigner();
  }
  throw new Error('No wallet connected');
}

// Associate a market with a livestream (1:1 relationship)
export async function associateMarketWithLivestream(
  marketAddress: string,
  livestreamId: number
): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/livestreams/${livestreamId}/associate-market`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        market_address: marketAddress
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to associate market with livestream');
    }

    console.log(`✅ Successfully associated market ${marketAddress} with livestream ${livestreamId}`);
  } catch (error) {
    console.error('Error associating market with livestream:', error);
    throw error;
  }
}

// Create a new betting market for a livestream
export async function createMarket(
  question: string,
  title: string,
  description: string,
  category: string,
  tags: string[],
  livestreamIds: number[] = [], // Multiple livestreams
  livestreamTitles: string[] = [] // Corresponding titles
): Promise<{ success: boolean; marketAddress?: string; error?: string }> {
  try {
    console.log('🚀 Creating market with multiple livestreams:', {
      question,
      title,
      livestreamIds,
      livestreamTitles
    });
    
    // Validate input
    if (!question || !title) {
      return { success: false, error: 'Question and title are required' };
    }

    // Validate arrays have same length (can be empty)
    if (livestreamIds.length !== livestreamTitles.length) {
      return { success: false, error: 'Livestream IDs and titles must have the same length' };
    }

    // Test contract connection
    const connectionTest = await testContractConnection();
    if (!connectionTest.isConnected) {
      console.error('❌ Contract connection failed:', connectionTest.error);
      return { success: false, error: connectionTest.error || 'Contract connection failed' };
    }

    // Get signer
    const signer = await getSigner();
    if (!signer) {
      return { success: false, error: 'Unable to get signer. Please connect your wallet.' };
    }

    // Create market factory contract instance
    const marketFactory = new ethers.Contract(
      MARKET_FACTORY_ADDRESS,
      MARKET_FACTORY_ABI,
      signer
    );

    console.log('📋 Creating market with params:', {
      livestreamIds,
      question,
      titles: livestreamTitles
    });

    // Create market transaction - can now use empty arrays
    const tx = await marketFactory.createMarket(
      livestreamIds,
      question,
      livestreamTitles
    );

    console.log('⏳ Transaction sent:', tx.hash);
    
    // Wait for transaction confirmation
    const receipt = await tx.wait();
    console.log('✅ Transaction confirmed:', receipt.hash);
    
    // Parse events to get market address
    let marketAddress: string | undefined;
    
    try {
      const iface = new ethers.Interface(MARKET_FACTORY_ABI);
      
      for (const log of receipt.logs) {
        try {
          const parsed = iface.parseLog({
            topics: log.topics,
            data: log.data
          });
          
          if (parsed && parsed.name === 'MarketCreated') {
            marketAddress = parsed.args.marketAddress;
            console.log('🎯 Market created at address:', marketAddress);
            break;
          }
        } catch (parseError) {
          // Skip logs that don't match our interface
          continue;
        }
      }
    } catch (error) {
      console.error('❌ Error parsing events:', error);
      return { success: false, error: 'Market created but could not parse contract address' };
    }

    if (!marketAddress) {
      console.error('❌ Market address not found in transaction events');
      return { success: false, error: 'Market created but contract address not found' };
    }

    // Always store market metadata
    try {
      console.log('💾 Storing market metadata...');
      
      // Store market metadata
      const metadataResponse = await fetch(`${API_BASE_URL}/markets/metadata`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contract_address: marketAddress,
          creator_wallet_address: await signer.getAddress(),
          description,
          category,
          tags,
          livestream_ids: livestreamIds // Can be empty array
        }),
      });

      const metadataResult = await metadataResponse.json();
      if (!metadataResult.success) {
        console.error('❌ Failed to store market metadata:', metadataResult.error);
        // Don't fail the entire creation process for metadata storage issues
      } else {
        console.log('✅ Market metadata stored successfully');
      }
    } catch (error) {
      console.error('❌ Error storing market metadata:', error);
      // Don't fail the entire creation process
    }

    console.log('🎉 Market created successfully!');
    return { success: true, marketAddress };
    
  } catch (error: any) {
    console.error('❌ Error creating market:', error);
    
    // Parse different error types
    if (error.code === 'ACTION_REJECTED') {
      return { success: false, error: 'Transaction rejected by user' };
    } else if (error.code === 'INSUFFICIENT_FUNDS') {
      return { success: false, error: 'Insufficient funds to create market' };
    } else if (error.reason?.includes('execution reverted')) {
      return { success: false, error: `Contract error: ${error.reason}` };
    } else if (error.message?.includes('network')) {
      return { success: false, error: 'Network error. Please check your connection.' };
    } else {
      return { success: false, error: error.message || 'Unknown error occurred' };
    }
  }
}

// Create a market with metadata (stored on-chain via the contract)
export async function createMarketWithMetadata(
  livestreamId: number | null,
  question: string,
  title: string,
  description?: string,
  category?: string,
  tags?: string[]
): Promise<string> {
  try {
    // Get the creator's wallet address
    const creatorAddress = await connectWallet();
    
    // Create the market on blockchain with the provided title and question
    // The smart contract will store these on-chain
    const livestreamIds = livestreamId ? [livestreamId] : []; // Can be empty
    const livestreamTitles = livestreamId ? [title] : []; // Can be empty
    
    const result = await createMarket(
      question,
      title,
      description || '',
      category || '',
      tags || [],
      livestreamIds,
      livestreamTitles
    );

    if (!result.success) {
      throw new Error(result.error || 'Failed to create market');
    }

    const marketAddress = result.marketAddress!;
    console.log('Market created on-chain:', marketAddress);
    
    // Store additional metadata off-chain
    if (description || category || tags) {
      try {
        const response = await fetch(`${API_BASE_URL}/markets`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contract_address: marketAddress,
            creator_wallet_address: creatorAddress,
            description,
            category,
            tags
          }),
        });

        if (!response.ok) {
          console.warn('Failed to store market metadata, but market was created successfully');
        } else {
          console.log('Market metadata stored successfully');
        }
      } catch (metadataError) {
        console.warn('Failed to store market metadata:', metadataError);
        // Don't throw error - the market was created successfully
      }
    }
    
    return marketAddress;
  } catch (error) {
    console.error('Error creating market with metadata:', error);
    throw error;
  }
}

// Get market information
export async function getMarketInfo(marketAddress: string): Promise<MarketInfo> {
  try {
    const provider = getProvider();
    const contract = new Contract(marketAddress, PredictionMarketArtifact.abi, provider);
    
    const info = await contract.getMarketInfo();
    
    // Convert arrays to proper format
    const livestreamIds = info[0].map((id: any) => Number(id));
    
    return {
      livestreamIds,
      question: info[1],
      livestreamTitles: info[2],
      state: info[3],
      winningLivestreamId: Number(info[4]),
      totalPool: formatEther(info[5]),
      totalBettors: Number(info[6]),
      createdAt: Number(info[7]),
      closedAt: Number(info[8]),
      resolvedAt: Number(info[9])
    };
  } catch (error) {
    console.error('Error fetching market info:', error);
    throw error;
  }
}

// Place a bet on a specific livestream in a market
export async function placeBet(
  marketAddress: string,
  livestreamId: number,
  amount: string
): Promise<string> {
  try {
    const signer = await getSigner();
    const contract = new Contract(marketAddress, PREDICTION_MARKET_ABI, signer);
    
    console.log(`Placing bet: ${amount} FLOW on livestream ${livestreamId}`);
    
    const tx = await contract.placeBet(livestreamId, {
      value: parseEther(amount)
    });
    
    console.log('Bet transaction sent:', tx.hash);
    const receipt = await tx.wait();
    console.log('Bet confirmed:', receipt.hash);
    
    return receipt.hash;
  } catch (error) {
    console.error('Error placing bet:', error);
    
    // Enhanced error handling for betting scenarios
    if (error instanceof Error) {
      if (error.message.includes('user rejected')) {
        throw new Error('Bet cancelled by user');
      } else if (error.message.includes('insufficient funds')) {
        throw new Error('Insufficient FLOW tokens to place bet');
      } else if (error.message.includes('execution reverted')) {
        throw new Error('Bet failed - market may be closed or invalid amount');
      } else if (error.message.includes('network')) {
        throw new Error('Network error - check your connection to Flow EVM testnet');
      } else if (error.message.includes('MarketClosed')) {
        throw new Error('This market is closed for betting');
      } else if (error.message.includes('InvalidAmount')) {
        throw new Error('Invalid bet amount - must be greater than 0');
      } else if (error.message.includes('Livestream not active')) {
        throw new Error('This livestream is not available for betting');
      }
    }
    
    throw error;
  }
}

// Get user's bets for a market (per-livestream)
export async function getUserBets(marketAddress: string, userAddress: string): Promise<UserBets> {
  try {
    const provider = getProvider();
    const contract = new Contract(marketAddress, PREDICTION_MARKET_ABI, provider);
    
    const bets = await contract.getUserBets(userAddress);
    
    return {
      livestreamIds: bets[0].map((id: any) => Number(id)),
      amounts: bets[1].map((amount: any) => formatEther(amount))
    };
  } catch (error) {
    console.error('Error fetching user bets:', error);
    return { livestreamIds: [], amounts: [] };
  }
}

// Get market odds (per-livestream betting data)
export async function getMarketOdds(marketAddress: string): Promise<MarketOdds> {
  try {
    const provider = getProvider();
    const contract = new Contract(marketAddress, PREDICTION_MARKET_ABI, provider);
    
    const betsData = await contract.getAllLivestreamBets();
    
    const livestreamBets: LivestreamBet[] = [];
    for (let i = 0; i < betsData[0].length; i++) {
      livestreamBets.push({
        livestreamId: Number(betsData[0][i]),
        title: betsData[1][i],
        amount: formatEther(betsData[2][i]),
        percentage: Number(betsData[3][i]),
        isActive: true
      });
    }
    
    return {
      livestreamBets
    };
  } catch (error) {
    console.error('Error fetching odds:', error);
    return { livestreamBets: [] };
  }
}

// Get potential payout for a user's bet on a specific livestream
export async function getPotentialPayout(
  marketAddress: string,
  userAddress: string,
  livestreamId: number
): Promise<string> {
  try {
    const provider = getProvider();
    const contract = new Contract(marketAddress, PREDICTION_MARKET_ABI, provider);
    
    // Calculate potential payout based on current pool distribution
    const [userBets, marketInfo] = await Promise.all([
      contract.getUserBets(userAddress),
      contract.getMarketInfo()
    ]);
    
    // Find user's bet on this livestream
    const livestreamIds = userBets[0].map((id: any) => Number(id));
    const amounts = userBets[1];
    
    const index = livestreamIds.indexOf(livestreamId);
    if (index === -1) return '0';
    
    const userBet = amounts[index];
    const totalPool = marketInfo[5]; // totalPool is at index 5
    
    // Get total bets on this livestream
    const livestreamBetData = await contract.getLivestreamBets(livestreamId);
    const livestreamPool = livestreamBetData[0];
    
    if (livestreamPool.toString() === '0') return '0';
    
    // Calculate potential payout: (userBet / livestreamPool) * totalPool
    const payout = (userBet * totalPool) / livestreamPool;
    return formatEther(payout);
  } catch (error) {
    console.error('Error fetching potential payout:', error);
    return '0';
  }
}

// Claim payout from a resolved market
export async function claimPayout(marketAddress: string): Promise<string> {
  try {
    const signer = await getSigner();
    const contract = new Contract(marketAddress, PREDICTION_MARKET_ABI, signer);
    
    const tx = await contract.claimPayout();
    const receipt = await tx.wait();
    
    return receipt.hash;
  } catch (error) {
    console.error('Error claiming payout:', error);
    throw error;
  }
}

// Check if user has MetaMask installed
export function isWalletAvailable(): boolean {
  return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
}

// Request wallet connection
export async function connectWallet(): Promise<string> {
  if (!isWalletAvailable()) {
    throw new Error('Please install MetaMask');
  }
  
  try {
    const provider = new BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    return await signer.getAddress();
  } catch (error) {
    console.error('Error connecting wallet:', error);
    throw error;
  }
}

// Debug function to test contract connectivity
export async function testContractConnection(): Promise<{
  isConnected: boolean;
  contractAddress: string;
  networkConfig: any;
  totalMarkets: number;
  owner: string;
  error?: string;
}> {
  try {
    const provider = getProvider();
    const contract = new Contract(MARKET_FACTORY_ADDRESS, MARKET_FACTORY_ABI, provider);
    
    const [totalMarkets, owner] = await Promise.all([
      contract.getTotalMarketCount(),
      contract.owner()
    ]);
    
    return {
      isConnected: true,
      contractAddress: MARKET_FACTORY_ADDRESS,
      networkConfig: getCurrentNetworkConfig(),
      totalMarkets: Number(totalMarkets),
      owner: owner
    };
  } catch (error) {
    console.error('Contract connection test failed:', error);
    return {
      isConnected: false,
      contractAddress: MARKET_FACTORY_ADDRESS,
      networkConfig: getCurrentNetworkConfig(),
      totalMarkets: 0,
      owner: '',
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

// Extended market info including metadata
export interface MarketWithMetadata extends MarketInfo {
  contractAddress: string;
  creator: string;
  description?: string;
  category?: string;
  tags?: string[];
}

// Fetch markets with metadata and filtering
export async function fetchMarketsWithMetadata(filters: {
  category?: string;
  tags?: string[];
  creator?: string;
  limit?: number;
  offset?: number;
} = {}): Promise<{
  markets: MarketWithMetadata[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}> {
  try {
    // Build query parameters
    const params = new URLSearchParams();
    if (filters.category) params.set('category', filters.category);
    if (filters.tags && filters.tags.length > 0) params.set('tags', filters.tags.join(','));
    if (filters.creator) params.set('creator', filters.creator);
    if (filters.limit) params.set('limit', filters.limit.toString());
    if (filters.offset) params.set('offset', filters.offset.toString());

    // Fetch metadata from database
    const response = await fetch(`${API_BASE_URL}/markets/metadata?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to fetch market metadata');
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch market metadata');
    }

    // For each market, fetch on-chain data
    const provider = getProvider();
    const marketsWithMetadata: MarketWithMetadata[] = [];

    for (const metadata of data.markets) {
      try {
        const contract = new Contract(metadata.contract_address, PREDICTION_MARKET_ABI, provider);
        const onChainInfo = await contract.getMarketInfo();
        
        const marketWithMetadata: MarketWithMetadata = {
          livestreamIds: onChainInfo[0].map((id: any) => Number(id)),
          question: onChainInfo[1],
          livestreamTitles: onChainInfo[2],
          state: onChainInfo[3],
          winningLivestreamId: Number(onChainInfo[4]),
          totalPool: formatEther(onChainInfo[5]),
          totalBettors: Number(onChainInfo[6]),
          createdAt: Number(onChainInfo[7]),
          closedAt: Number(onChainInfo[8]),
          resolvedAt: Number(onChainInfo[9]),
          // Metadata
          contractAddress: metadata.contract_address,
          creator: metadata.creator_wallet_address,
          description: metadata.description,
          category: metadata.category,
          tags: metadata.tags
        };

        marketsWithMetadata.push(marketWithMetadata);
      } catch (error) {
        console.error(`Failed to fetch on-chain data for market ${metadata.contract_address}:`, error);
        // Skip this market if on-chain data is unavailable
      }
    }

    return {
      markets: marketsWithMetadata,
      pagination: data.pagination
    };
  } catch (error) {
    console.error('Error fetching markets with metadata:', error);
    throw error;
  }
}

// Fetch all available tags for filtering
export async function fetchAvailableTags(): Promise<string[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/markets/metadata/tags`);
    if (!response.ok) {
      throw new Error('Failed to fetch tags');
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch tags');
    }

    return data.tags;
  } catch (error) {
    console.error('Error fetching available tags:', error);
    return [];
  }
}

// Fetch all available categories for filtering
export async function fetchAvailableCategories(): Promise<string[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/markets/metadata/categories`);
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch categories');
    }

    return data.categories;
  } catch (error) {
    console.error('Error fetching available categories:', error);
    return [];
  }
}

// Market leaderboard entry interface
export interface MarketLeaderboardEntry {
  rank: number;
  marketAddress: string;
  question: string;
  totalPool: string;
  totalBettors: number;
  category: string;
  state: MarketState;
  createdAt: number;
  livestreamTitles: string[];
}

// Fetch market leaderboard data based on betting activity
export async function fetchMarketLeaderboardData(limit: number = 20): Promise<MarketLeaderboardEntry[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/leaderboard/markets?limit=${limit}`);
    if (!response.ok) {
      throw new Error('Failed to fetch market leaderboard data');
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch market leaderboard data');
    }

    return data.leaderboard;
  } catch (error) {
    console.error('Error fetching market leaderboard data:', error);
    // Return mock data as fallback
    return generateMockMarketLeaderboardData(limit);
  }
}

// Generate mock market leaderboard data for development/testing
function generateMockMarketLeaderboardData(limit: number): MarketLeaderboardEntry[] {
  const mockData: MarketLeaderboardEntry[] = [];
  
  for (let i = 0; i < limit; i++) {
    const totalPool = (Math.random() * 1000 + 50).toFixed(2);
    const totalBettors = Math.floor(Math.random() * 50) + 5;
    const categories = ['hackathon', 'gaming', 'technology', 'education', 'entertainment'];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const states = [MarketState.Open, MarketState.Closed, MarketState.Resolved];
    const state = states[Math.floor(Math.random() * states.length)];
    
    mockData.push({
      rank: i + 1,
      marketAddress: `0x${Math.random().toString(16).substring(2, 42)}`,
      question: `Will this ${category} project win the hackathon?`,
      totalPool,
      totalBettors,
      category,
      state,
      createdAt: Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000),
      livestreamTitles: [`${category.charAt(0).toUpperCase() + category.slice(1)} Project ${i + 1}`]
    });
  }
  
  return mockData.sort((a, b) => parseFloat(b.totalPool) - parseFloat(a.totalPool));
}

// Livestream leaderboard entry interface
export interface LivestreamLeaderboardEntry {
  rank: number;
  livestreamId: number;
  title: string;
  creatorUsername: string;
  totalBets: number;
  totalVolume: string;
  category: string;
  status: string;
  viewCount: number;
  createdAt: number;
  thumbnailUrl: string;
  market_address: string;
}

// Fetch livestream leaderboard data from API
export async function fetchLivestreamLeaderboardData(limit: number = 20): Promise<LivestreamLeaderboardEntry[]> {
  // Use canonical mockLivestreams, rank by view_count (descending)
  const sorted = [...mockLivestreams]
    .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
    .slice(0, limit);
  return sorted.map((stream, idx) => ({
    rank: idx + 1,
    livestreamId: stream.id || idx + 1,
    title: stream.title,
    creatorUsername: stream.creator_wallet_address,
    totalBets: 0, // You can update this if you have bet data
    totalVolume: '0', // You can update this if you have volume data
    category: stream.category || 'general',
    status: stream.status,
    viewCount: stream.view_count || 0,
    createdAt: stream.created_at ? new Date(stream.created_at).getTime() : Date.now(),
    thumbnailUrl: stream.thumbnail_url || '',
    market_address: stream.market_address || '',
  }));
}
