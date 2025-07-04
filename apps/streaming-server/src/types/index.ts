export interface Stream {
  id: string;
  title: string;
  description: string;
  projectId: string;
  status: 'live' | 'ended' | 'scheduled';
  startTime: Date;
  endTime?: Date;
  viewerCount: number;
  webrtcUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Market {
  id: string;
  streamId: string;
  question: string;
  description: string;
  status: 'active' | 'settled' | 'cancelled';
  yesPrice: number;
  noPrice: number;
  totalVolume: number;
  totalBets: number;
  settlementTime?: Date;
  outcome?: 'yes' | 'no';
  createdAt: Date;
  updatedAt: Date;
}

export interface Bet {
  id: string;
  marketId: string;
  userId: string;
  outcome: 'yes' | 'no';
  amount: number;
  price: number;
  status: 'pending' | 'confirmed' | 'settled';
  createdAt: Date;
  updatedAt: Date;
}

export interface Stats {
  totalStreams: number;
  activeStreams: number;
  totalVolume: number;
  activeBettors: number;
  totalMarkets: number;
  activeMarkets: number;
}

export interface WebRTCSignal {
  type: 'offer' | 'answer' | 'ice-candidate';
  streamId: string;
  data: any;
  from: string;
  to?: string;
} 