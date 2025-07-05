import { NextResponse } from 'next/server';
import { getLivestreams, getLiveLivestreams, getLivestreamById } from '../../data/livestreams';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const liveOnly = searchParams.get('live') === 'true';

    if (id) {
      const livestream = await getLivestreamById(id);
      if (!livestream) {
        return NextResponse.json({ error: 'Livestream not found' }, { status: 404 });
      }
      return NextResponse.json(livestream);
    }

    if (liveOnly) {
      const livestreams = await getLiveLivestreams();
      return NextResponse.json(livestreams);
    }

    const livestreams = await getLivestreams();
    return NextResponse.json(livestreams);
  } catch (error) {
    console.error('Error fetching livestreams:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 