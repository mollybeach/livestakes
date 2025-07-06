import { NextRequest, NextResponse } from 'next/server';
import { mockMarkets, MarketDataType } from '../../data/markets';

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
    
    // Transform livestream data to market data format
    const markets: MarketDataType[] = data.data?.map((livestream: any) => ({
      id: livestream.id,
      title: livestream.title,
      description: livestream.description || `Prediction market for ${livestream.title}`,
      creator_wallet_address: livestream.creator_wallet_address,
      status: livestream.status,
      start_time: livestream.start_time,
      end_time: livestream.end_time,
      view_count: livestream.view_count || 0,
      category: livestream.category || 'general',
      totalVolume: 0,
      participants: 0,
      odds: "1.0x",
      prediction: "Pending",
      result: undefined,
      sponsor: undefined,
      website: undefined,
      prizes: []
    })) || mockMarkets;

    return NextResponse.json({ data: markets });
  } catch (error) {
    console.error('Error fetching markets:', error);
    // Return mock data as fallback
    return NextResponse.json({ data: mockMarkets });
  }
} 