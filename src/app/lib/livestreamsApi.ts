// Livestreams API utility functions for frontend

import { mockLivestreams } from '../data/livestreams';
import type { LivestreamDataType, MarketDataType } from '../../types/types';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  count?: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3334/api';
const DEFAULT_AVATAR = "https://res.cloudinary.com/storagemanagementcontainer/image/upload/v1751747169/default-avatar_ynttwb.png";

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
}): Promise<ApiResponse<LivestreamDataType[]>> {
  const params = new URLSearchParams();
  
  if (filters?.status) params.append('status', filters.status);
  if (filters?.creator_wallet_address) params.append('creator_wallet_address', filters.creator_wallet_address);
  if (filters?.limit) params.append('limit', filters.limit.toString());
  if (filters?.offset) params.append('offset', filters.offset.toString());
  
  const url = `${API_BASE_URL}/livestreams${params.toString() ? `?${params.toString()}` : ''}`;
  
  try {
    const response = await fetch(url);
    const rawData = await handleApiResponse<any[]>(response);
    
    // Normalize the backend data to match our LivestreamDataType interface
    if (rawData.success && rawData.data && Array.isArray(rawData.data)) {
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
    let filteredData = mockLivestreams;
    
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
export async function getLivestreamById(id: number): Promise<ApiResponse<LivestreamDataType>> {
  try {
    const response = await fetch(`${API_BASE_URL}/livestreams/${id}`);
    const rawData = await handleApiResponse<any>(response);
    
    // Normalize the backend data to match our LivestreamDataType interface
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
export async function createLivestream(livestream: Omit<LivestreamDataType, 'id' | 'created_at' | 'updated_at' | 'view_count'>): Promise<ApiResponse<LivestreamDataType>> {
  try {
    const response = await fetch(`${API_BASE_URL}/livestreams`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(livestream),
    });
    return await handleApiResponse<LivestreamDataType>(response);
  } catch (error) {
    console.error('Error creating livestream:', error);
    throw error;
  }
}

/**
 * Update a livestream
 */
export async function updateLivestream(id: number, updates: Partial<LivestreamDataType>): Promise<ApiResponse<LivestreamDataType>> {
  try {
    const response = await fetch(`${API_BASE_URL}/livestreams/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    return await handleApiResponse<LivestreamDataType>(response);
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
export async function getLivestreamsByCreator(walletAddress: string): Promise<ApiResponse<LivestreamDataType[]>> {
  try {
    const response = await fetch(`${API_BASE_URL}/livestreams/creator/${encodeURIComponent(walletAddress)}`);
    return await handleApiResponse<LivestreamDataType[]>(response);
  } catch (error) {
    console.error('Error fetching livestreams by creator:', error);
    throw error;
  }
}

/**
 * Increment view count for a livestream
 */
export async function incrementViewCount(id: number): Promise<ApiResponse<LivestreamDataType>> {
  try {
    const response = await fetch(`${API_BASE_URL}/livestreams/${id}/view`, {
      method: 'POST',
    });
    return await handleApiResponse<LivestreamDataType>(response);
  } catch (error) {
    console.error('Error incrementing view count:', error);
    throw error;
  }
}

// Utility functions for livestream management

/**
 * Start a livestream (update status to active)
 */
export async function startLivestream(id: number): Promise<ApiResponse<LivestreamDataType>> {
  return updateLivestream(id, {
    status: 'active',
  });
}

/**
 * End a livestream (update status to ended)
 */
export async function endLivestream(id: number): Promise<ApiResponse<LivestreamDataType>> {
  return updateLivestream(id, {
    status: 'ended',
    end_time: new Date().toISOString(),
  });
}

/**
 * Get active livestreams
 */
export async function getActiveLivestreams(): Promise<ApiResponse<LivestreamDataType[]>> {
  try {
    const response = await fetch(`${API_BASE_URL}/livestreams?status=live`);
    const rawData = await handleApiResponse<any[]>(response);
    
    // Normalize the backend data to match our LivestreamDataType interface
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
    const activeSample = mockLivestreams.filter(stream => stream.status === 'active').map(toLivestream);
    return createSampleResponse(activeSample);
  }
}

/**
 * Get ended livestreams (for showing past streams)
 */
export async function getEndedLivestreams(limit?: number): Promise<ApiResponse<LivestreamDataType[]>> {
  return getAllLivestreams({ status: 'ended', limit });
}

/**
 * Get scheduled livestreams
 */
export async function getScheduledLivestreams(): Promise<ApiResponse<LivestreamDataType[]>> {
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
export function canEditLivestream(livestream: LivestreamDataType, userWalletAddress?: string): boolean {
  return !!userWalletAddress && livestream.creator_wallet_address === userWalletAddress;
}

function toLivestream(l: any): LivestreamDataType {
  return {
    id: l.id,
    title: l.title,
    description: l.description,
    creator_wallet_address: l.creator_wallet_address,
    stream_url: l.stream_url,
    thumbnail_url: l.thumbnail_url,
    status: l.status,
    start_time: l.start_time,
    end_time: l.end_time,
    view_count: l.view_count,
    category: l.category,
    created_at: l.created_at,
    updated_at: l.updated_at,
    avatar: l.avatar || DEFAULT_AVATAR,
    github_url: l.github_url || "https://github.com"
  };
} 