import { NextRequest, NextResponse } from 'next/server';
import { mockLivestreams, LivestreamDataType } from '../../data/livestreams';

export async function GET(request: NextRequest) {
  try {
    // Fetch data from your backend API
    const response = await fetch('http://localhost:3334/api/livestreams', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform backend data to match our frontend interface
    const livestreams: LivestreamDataType[] = data.data?.map((livestream: any) => ({
      id: livestream.id,
      title: livestream.title,
      description: livestream.description,
      creator_wallet_address: livestream.creator_wallet_address,
      stream_url: livestream.stream_url,
      thumbnail_url: livestream.thumbnail_url,
      status: livestream.status,
      start_time: livestream.start_time,
      end_time: livestream.end_time,
      view_count: livestream.view_count,
      category: livestream.category,
      created_at: livestream.created_at,
      updated_at: livestream.updated_at,
      avatar: livestream.avatar || "https://res.cloudinary.com/storagemanagementcontainer/image/upload/v1751747169/default-avatar_ynttwb.png",
      github_url: livestream.github_url || "https://github.com"
    })) || mockLivestreams;

    return NextResponse.json({ data: livestreams });
  } catch (error) {
    console.error('Error fetching livestreams:', error);
    // Return mock data as fallback
    return NextResponse.json({ data: mockLivestreams });
  }
} 