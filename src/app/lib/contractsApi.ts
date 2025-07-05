// Smart Contracts API for Betting on Livestreams
import { ethers, Contract, formatEther, parseEther, JsonRpcProvider, BrowserProvider } from 'ethers';

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
    MarketFactory: '0x216178eacF4188Df1DCf2Dd5ce8Ba06F07189B84',
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

export enum BetSide {
  Yes = 0,
  No = 1
}

export enum MarketState {
  Open = 0,
  Closed = 1,
  Resolved = 2
}

export interface MarketInfo {
  livestreamId: number;
  question: string;
  livestreamTitle: string;
  state: MarketState;
  outcome: BetSide;
  yesBets: string;
  noBets: string;
  totalPool: string;
  totalBettors: number;
  createdAt: number;
  closedAt: number;
  resolvedAt: number;
}

export interface UserBets {
  yesBets: string;
  noBets: string;
}

export interface MarketOdds {
  yesOdds: number;
  noOdds: number;
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
  livestreamId: number,
  question: string,
  livestreamTitle: string
): Promise<string> {
  try {
    console.log('Creating market with params:', { livestreamId, question, livestreamTitle });
    
    const signer = await getSigner();
    const contract = new Contract(MARKET_FACTORY_ADDRESS, MARKET_FACTORY_ABI, signer);
    
    console.log('Contract address:', MARKET_FACTORY_ADDRESS);
    console.log('Network config:', getCurrentNetworkConfig());
    
    // Check if contract is deployed by calling a simple view function
    try {
      const owner = await contract.owner();
      console.log('Contract owner:', owner);
    } catch (error) {
      console.error('Contract not deployed or not accessible:', error);
      throw new Error('Contract not deployed or not accessible');
    }
    
    console.log('Sending createMarket transaction...');
    const tx = await contract.createMarket(livestreamId, question, livestreamTitle);
    console.log('Transaction sent:', tx.hash);
    
    console.log('Waiting for transaction receipt...');
    const receipt = await tx.wait();
    console.log('Transaction receipt:', receipt);
    
    // In ethers v6, we need to parse logs differently
    const iface = new ethers.Interface(MARKET_FACTORY_ABI);
    
    // Find the MarketCreated event in the logs
    let marketAddress = null;
    for (const log of receipt.logs) {
      try {
        const parsedLog = iface.parseLog(log);
        if (parsedLog && parsedLog.name === 'MarketCreated') {
          marketAddress = parsedLog.args.marketAddress;
          console.log('MarketCreated event found:', parsedLog.args);
          break;
        }
      } catch (error) {
        // This log might not be from our contract, continue
        continue;
      }
    }
    
    if (marketAddress) {
      console.log('Market created successfully:', marketAddress);
      
      // Associate the market with the livestream in the backend (1:1 relationship)
      if (livestreamId > 0) {
        try {
          console.log(`Associating market ${marketAddress} with livestream ${livestreamId}...`);
          await associateMarketWithLivestream(marketAddress, livestreamId);
          console.log('Market associated with livestream successfully');
        } catch (associationError) {
          console.error('Failed to associate market with livestream:', associationError);
          // Don't throw error - the market was created successfully
        }
      }
      
      return marketAddress;
    }
    
    throw new Error('MarketCreated event not found in transaction logs');
  } catch (error) {
    console.error('Error creating market:', error);
    
    // Provide more detailed error information
    if (error instanceof Error) {
      if (error.message.includes('user rejected')) {
        throw new Error('Transaction was rejected by user');
      } else if (error.message.includes('insufficient funds')) {
        throw new Error('Insufficient FLOW tokens to create market');
      } else if (error.message.includes('execution reverted')) {
        throw new Error('Transaction reverted - check contract conditions');
      } else if (error.message.includes('network')) {
        throw new Error('Network error - check your connection to Flow EVM testnet');
      }
    }
    
    throw error;
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
    const marketAddress = await createMarket(livestreamId || 0, question, title);

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
    const contract = new Contract(marketAddress, PREDICTION_MARKET_ABI, provider);
    
    const info = await contract.getMarketInfo();
    
    return {
      livestreamId: Number(info[0]),
      question: info[1],
      livestreamTitle: info[2],
      state: info[3],
      outcome: info[4],
      yesBets: formatEther(info[5]),
      noBets: formatEther(info[6]),
      totalPool: formatEther(info[7]),
      totalBettors: Number(info[8]),
      createdAt: Number(info[9]),
      closedAt: Number(info[10]),
      resolvedAt: Number(info[11])
    };
  } catch (error) {
    console.error('Error fetching market info:', error);
    throw error;
  }
}

// Place a bet on a market
export async function placeBet(
  marketAddress: string,
  side: BetSide,
  amount: string
): Promise<string> {
  try {
    const signer = await getSigner();
    const contract = new Contract(marketAddress, PREDICTION_MARKET_ABI, signer);
    
    console.log(`Placing bet: ${amount} FLOW on ${side === BetSide.Yes ? 'Yes' : 'No'}`);
    
    const tx = await contract.placeBet(side, {
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
      }
    }
    
    throw error;
  }
}

// Get user's bets for a market
export async function getUserBets(marketAddress: string, userAddress: string): Promise<UserBets> {
  try {
    const provider = getProvider();
    const contract = new Contract(marketAddress, PREDICTION_MARKET_ABI, provider);
    
    const bets = await contract.getUserBets(userAddress);
    
    return {
      yesBets: formatEther(bets.yesBets),
      noBets: formatEther(bets.noBets)
    };
  } catch (error) {
    console.error('Error fetching user bets:', error);
    return { yesBets: '0', noBets: '0' };
  }
}

// Get market odds
export async function getMarketOdds(marketAddress: string): Promise<MarketOdds> {
  try {
    const provider = getProvider();
    const contract = new Contract(marketAddress, PREDICTION_MARKET_ABI, provider);
    
    const odds = await contract.getOdds();
    
    return {
      yesOdds: Number(odds.yesOdds),
      noOdds: Number(odds.noOdds)
    };
  } catch (error) {
    console.error('Error fetching odds:', error);
    return { yesOdds: 50, noOdds: 50 };
  }
}

// Get potential payout for a user's bet
export async function getPotentialPayout(
  marketAddress: string,
  userAddress: string,
  side: BetSide
): Promise<string> {
  try {
    const provider = getProvider();
    const contract = new Contract(marketAddress, PREDICTION_MARKET_ABI, provider);
    
    const payout = await contract.getPotentialPayout(userAddress, side);
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
          livestreamId: Number(onChainInfo[0]),
          question: onChainInfo[1],
          livestreamTitle: onChainInfo[2],
          state: onChainInfo[3],
          outcome: onChainInfo[4],
          yesBets: formatEther(onChainInfo[5]),
          noBets: formatEther(onChainInfo[6]),
          totalPool: formatEther(onChainInfo[7]),
          totalBettors: Number(onChainInfo[8]),
          createdAt: Number(onChainInfo[9]),
          closedAt: Number(onChainInfo[10]),
          resolvedAt: Number(onChainInfo[11]),
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