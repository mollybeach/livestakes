// Smart Contracts API for Betting on Livestreams
import { ethers, Contract, formatEther, parseEther, JsonRpcProvider, BrowserProvider } from 'ethers';

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
    MarketFactory: '0x1D075376Cc90078B53480D60488E2f2e64Ce866a',
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

// Contract ABIs
const MARKET_FACTORY_ABI = [
  "function createMarket(uint256 livestreamId, string memory question, string memory livestreamTitle) external returns (address)",
  "function getMarketsForLivestream(uint256 livestreamId) external view returns (address[] memory)",
  "function getMarketCountForLivestream(uint256 livestreamId) external view returns (uint256)",
  "function getAllMarkets(uint256 offset, uint256 limit) external view returns (address[] memory)",
  "function owner() external view returns (address)",
  "event MarketCreated(address indexed marketAddress, uint256 indexed livestreamId, string question)"
];

const PREDICTION_MARKET_ABI = [
  "function placeBet(uint8 side) external payable",
  "function getMarketInfo() external view returns (uint256, string, string, uint8, uint8, uint256, uint256, uint256, uint256, uint256, uint256, uint256)",
  "function getUserBets(address user) external view returns (uint256 yesBets, uint256 noBets)",
  "function getOdds() external view returns (uint256 yesOdds, uint256 noOdds)",
  "function getPotentialPayout(address user, uint8 side) external view returns (uint256)",
  "function claimPayout() external",
  "function closeMarket() external",
  "function resolveMarket(uint8 outcome) external",
  "event BetPlaced(address indexed user, uint8 side, uint256 amount, uint256 timestamp)",
  "event PayoutClaimed(address indexed user, uint256 amount, uint256 timestamp)"
];

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

// Create a new betting market for a livestream
export async function createMarket(
  livestreamId: number,
  question: string,
  livestreamTitle: string
): Promise<string> {
  try {
    const signer = await getSigner();
    const contract = new Contract(MARKET_FACTORY_ADDRESS, MARKET_FACTORY_ABI, signer);
    
    const tx = await contract.createMarket(livestreamId, question, livestreamTitle);
    const receipt = await tx.wait();
    
    // Find the MarketCreated event
    const event = receipt.events?.find((e: any) => e.event === 'MarketCreated');
    if (event) {
      return event.args.marketAddress;
    }
    
    throw new Error('Market creation failed');
  } catch (error) {
    console.error('Error creating market:', error);
    throw error;
  }
}

// Get all markets for a specific livestream
export async function getMarketsForLivestream(livestreamId: number): Promise<string[]> {
  try {
    const provider = getProvider();
    const contract = new Contract(MARKET_FACTORY_ADDRESS, MARKET_FACTORY_ABI, provider);
    
    const markets = await contract.getMarketsForLivestream(livestreamId);
    return markets;
  } catch (error) {
    console.error('Error fetching markets:', error);
    return [];
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
    
    const tx = await contract.placeBet(side, {
      value: parseEther(amount)
    });
    
    const receipt = await tx.wait();
    return receipt.hash;
  } catch (error) {
    console.error('Error placing bet:', error);
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