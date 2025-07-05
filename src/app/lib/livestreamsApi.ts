// Livestreams API utility functions for frontend


export interface Livestream {
  id: number;
  title: string;
  description: string;
  creator_wallet_address: string;
  stream_url: string;
  thumbnail_url?: string;
  view_count: number;
  status: 'live' | 'ended' | 'scheduled';
  category: string;
  start_time: string;
  end_time?: string;
  created_at: string;
  updated_at?: string;
  tags?: string[];
  transcript?: string;
  market_address?: string; // Keep for backward compatibility
  markets?: MarketData[]; // New: supports multiple markets
}

export interface MarketData {
  contract_address: string;
  creator_wallet_address: string;
  question?: string;
  title?: string;
  description?: string;
  category?: string;
  tags?: string[];
  state?: number;
  yes_bets?: string;
  no_bets?: string;
  total_pool?: string;
  total_bettors?: number;
  livestream_ids?: number[]; // New: supports multiple livestreams
  transcript?: string;
  market_address?: string; // Single contract address for 1:1 relationship
  market?: any; // Single market data
  created_at?: string;
  updated_at?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  count?: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Sample data for development/demo purposes
const SAMPLE_LIVESTREAMS: Livestream[] = [
  {
    id: 1,
    title: "Epic Fortnite Battle Royale - Road to Victory!",
    description: "Join me as I attempt to get my first Victory Royale of the season! High-stakes gameplay with live betting opportunities.",
    creator_wallet_address: "0x1234567890123456789012345678901234567890",
    stream_url: "https://twitch.tv/epic_gamer",
    thumbnail_url: "https://via.placeholder.com/400x225/6366f1/ffffff?text=LIVE+Fortnite",
    status: "live" as const,
    start_time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    view_count: 1250,
    category: "gaming",
    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Crypto Trading Masterclass LIVE",
    description: "Learning advanced trading strategies while the market is hot! Real-time analysis and predictions.",
    creator_wallet_address: "0x2345678901234567890123456789012345678901",
    stream_url: "https://youtube.com/live/crypto_master",
    thumbnail_url: "https://via.placeholder.com/400x225/8b5cf6/ffffff?text=LIVE+Trading",
    status: "live" as const,
    start_time: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    view_count: 892,
    category: "finance",
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    title: "Cooking Challenge: 30-Minute Gourmet Meal",
    description: "Can I create a restaurant-quality dish in just 30 minutes? You decide the outcome!",
    creator_wallet_address: "0x3456789012345678901234567890123456789012",
    stream_url: "https://twitch.tv/chef_challenge",
    thumbnail_url: "https://via.placeholder.com/400x225/ec4899/ffffff?text=LIVE+Cooking",
    status: "live" as const,
    start_time: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    view_count: 567,
    category: "lifestyle",
    created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 4,
    title: "Late Night Jazz Session",
    description: "Smooth jazz improvisations to end your day. Relaxing vibes with surprise musical moments.",
    creator_wallet_address: "0x4567890123456789012345678901234567890123",
    stream_url: "https://twitch.tv/jazz_session",
    thumbnail_url: "https://via.placeholder.com/400x225/6366f1/ffffff?text=Jazz+Session",
    status: "ended" as const,
    start_time: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    end_time: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // ended 3 hours ago
    view_count: 1890,
    category: "music",
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 5,
    title: "Tomorrow's Big Tournament Prep",
    description: "Getting ready for the championship match. Strategy discussion and practice rounds.",
    creator_wallet_address: "0x5678901234567890123456789012345678901234",
    stream_url: "https://twitch.tv/tournament_prep",
    thumbnail_url: "https://via.placeholder.com/400x225/8b5cf6/ffffff?text=Tournament+Prep",
    status: "scheduled" as const,
    start_time: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(), // 12 hours from now
    view_count: 0,
    category: "gaming",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 6,
    title: "Art Stream: Digital Illustration Speed Paint",
    description: "Creating a fantasy character from scratch. Watch the magic happen in real-time!",
    creator_wallet_address: "0x6789012345678901234567890123456789012345",
    stream_url: "https://twitch.tv/art_stream",
    thumbnail_url: "https://via.placeholder.com/400x225/ec4899/ffffff?text=Art+Stream",
    status: "ended" as const,
    start_time: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    end_time: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    view_count: 743,
    category: "art",
    created_at: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  }
];

// Helper function to handle API responses
async function handleApiResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'API request failed');
  }
  
  return data;
}


// Helper function to simulate API response with sample data
function createSampleResponse<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data,
    count: Array.isArray(data) ? data.length : undefined
  };
}

// Livestreams API functions

/**
 * Get all livestreams with optional filtering
 */
export async function getAllLivestreams(filters?: {
  status?: string;
  creator_wallet_address?: string;
  limit?: number;
  offset?: number;
}): Promise<ApiResponse<Livestream[]>> {
  const params = new URLSearchParams();
  
  if (filters?.status) params.append('status', filters.status);
  if (filters?.creator_wallet_address) params.append('creator_wallet_address', filters.creator_wallet_address);
  if (filters?.limit) params.append('limit', filters.limit.toString());
  if (filters?.offset) params.append('offset', filters.offset.toString());
  
  const url = `${API_BASE_URL}/livestreams${params.toString() ? `?${params.toString()}` : ''}`;
  
  try {
    const response = await fetch(url);
    const rawData = await handleApiResponse<any[]>(response);
    
    // Normalize the backend data to match our Livestream interface
    if (rawData.success && rawData.data && Array.isArray(rawData.data)) {
      // const normalizedData = rawData.data.map(normalizeLivestreamData);
      return {
        success: true,
        data: rawData.data,
        count: rawData.data.length
      };
    }
    
    return rawData;
  } catch (error) {
    console.warn('API not available, using sample data:', error);
    
    // Filter sample data based on filters
    let filteredData = [...SAMPLE_LIVESTREAMS];
    
    if (filters?.status) {
      filteredData = filteredData.filter(stream => stream.status === filters.status);
    }
    
    if (filters?.creator_wallet_address) {
      filteredData = filteredData.filter(stream => stream.creator_wallet_address === filters.creator_wallet_address);
    }
    
    if (filters?.offset) {
      filteredData = filteredData.slice(filters.offset);
    }
    
    if (filters?.limit) {
      filteredData = filteredData.slice(0, filters.limit);
    }
    
    return createSampleResponse(filteredData);
  }
}

/**
 * Get a livestream by ID
 */
export async function getLivestreamById(id: number): Promise<ApiResponse<Livestream>> {
  try {
    const response = await fetch(`${API_BASE_URL}/livestreams/${id}`);
    const rawData = await handleApiResponse<any>(response);
    
    // Normalize the backend data to match our Livestream interface
    if (rawData.success && rawData.data) {
      return {
        success: true,
        data: rawData.data
      };
    }
    
    return rawData;
  } catch (error) {
    console.error('Error fetching livestream:', error);
    throw error;
  }
}

/**
 * Create a new livestream
 */
export async function createLivestream(livestream: Omit<Livestream, 'id' | 'created_at' | 'updated_at' | 'view_count'>): Promise<ApiResponse<Livestream>> {
  try {
    const response = await fetch(`${API_BASE_URL}/livestreams`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(livestream),
    });
    return await handleApiResponse<Livestream>(response);
  } catch (error) {
    console.error('Error creating livestream:', error);
    throw error;
  }
}

/**
 * Update a livestream
 */
export async function updateLivestream(id: number, updates: Partial<Livestream>): Promise<ApiResponse<Livestream>> {
  try {
    const response = await fetch(`${API_BASE_URL}/livestreams/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    return await handleApiResponse<Livestream>(response);
  } catch (error) {
    console.error('Error updating livestream:', error);
    throw error;
  }
}

/**
 * Delete a livestream
 */
export async function deleteLivestream(id: number): Promise<ApiResponse<null>> {
  try {
    const response = await fetch(`${API_BASE_URL}/livestreams/${id}`, {
      method: 'DELETE',
    });
    return await handleApiResponse<null>(response);
  } catch (error) {
    console.error('Error deleting livestream:', error);
    throw error;
  }
}

/**
 * Get livestreams by creator wallet address
 */
export async function getLivestreamsByCreator(walletAddress: string): Promise<ApiResponse<Livestream[]>> {
  try {
    const response = await fetch(`${API_BASE_URL}/livestreams/creator/${encodeURIComponent(walletAddress)}`);
    return await handleApiResponse<Livestream[]>(response);
  } catch (error) {
    console.error('Error fetching livestreams by creator:', error);
    throw error;
  }
}

/**
 * Increment view count for a livestream
 */
export async function incrementViewCount(id: number): Promise<ApiResponse<Livestream>> {
  try {
    const response = await fetch(`${API_BASE_URL}/livestreams/${id}/view`, {
      method: 'POST',
    });
    return await handleApiResponse<Livestream>(response);
  } catch (error) {
    console.error('Error incrementing view count:', error);
    throw error;
  }
}

// Utility functions for livestream management

/**
 * Start a livestream (update status to active)
 */
export async function startLivestream(id: number): Promise<ApiResponse<Livestream>> {
  return updateLivestream(id, {
    status: 'live',
    start_time: new Date().toISOString(),
  });
}

/**
 * End a livestream (update status to ended)
 */
export async function endLivestream(id: number): Promise<ApiResponse<Livestream>> {
  return updateLivestream(id, {
    status: 'ended',
    end_time: new Date().toISOString(),
  });
}

/**
 * Get active livestreams
 */
export async function getActiveLivestreams(): Promise<ApiResponse<Livestream[]>> {
  try {
    const response = await fetch(`${API_BASE_URL}/livestreams?status=live`);
    const rawData = await handleApiResponse<any[]>(response);
    
    // Normalize the backend data to match our Livestream interface
    if (rawData.success && rawData.data && Array.isArray(rawData.data)) {
      return {
        success: true,
        data: rawData.data,
        count: rawData.data.length
      };
    }
    
    return rawData;
  } catch (error) {
    console.warn('Active livestreams API not available, using sample data:', error);
    // Return sample active livestreams
    const activeSample = SAMPLE_LIVESTREAMS.filter(stream => stream.status === 'live');
    return createSampleResponse(activeSample);
  }
}

/**
 * Get ended livestreams (for showing past streams)
 */
export async function getEndedLivestreams(limit?: number): Promise<ApiResponse<Livestream[]>> {
  return getAllLivestreams({ status: 'ended', limit });
}

/**
 * Get scheduled livestreams
 */
export async function getScheduledLivestreams(): Promise<ApiResponse<Livestream[]>> {
  return getAllLivestreams({ status: 'scheduled' });
}

/**
 * Format livestream for display
 */
export function formatLivestreamTime(dateString?: string): string {
  if (!dateString) return 'Not set';
  
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Get livestream status badge color
 */
export function getStatusColor(status: string): string {
  switch (status) {
    case 'live':
      return 'bg-green-500';
    case 'scheduled':
      return 'bg-yellow-500';
    case 'ended':
      return 'bg-gray-500';
    default:
      return 'bg-gray-400';
  }
}

/**
 * Check if user can edit livestream (based on wallet address)
 */
export function canEditLivestream(livestream: Livestream, userWalletAddress?: string): boolean {
  return !!userWalletAddress && livestream.creator_wallet_address === userWalletAddress;
} 