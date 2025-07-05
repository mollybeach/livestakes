import { NextResponse } from 'next/server';
import { getMarkets, getLiveMarkets, getMarketById, getMarketsByCategory } from '../../data/markets';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const liveOnly = searchParams.get('live') === 'true';
    const category = searchParams.get('category');

    if (id) {
      const market = await getMarketById(id);
      if (!market) {
        return NextResponse.json({ error: 'Market not found' }, { status: 404 });
      }
      return NextResponse.json(market);
    }

    if (category) {
      const markets = await getMarketsByCategory(category);
      return NextResponse.json(markets);
    }

    if (liveOnly) {
      const markets = await getLiveMarkets();
      return NextResponse.json(markets);
    }

    const markets = await getMarkets();
    return NextResponse.json(markets);
  } catch (error) {
    console.error('Error fetching markets:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 