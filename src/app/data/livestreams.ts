export interface Livestream {
  id: string;
  title: string;
  username: string;
  mcap: string;
  ath: string;
  avatar: string;
  thumbnail: string;
  isLive?: boolean;
  viewers?: number;
  category?: string;
}

export const mockLivestreams: Livestream[] = [
  {
    id: "1",
    title: "Swim",
    username: "DomvXXYK",
    mcap: "$4.1K",
    ath: "$4.5K",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    thumbnail: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    isLive: true,
    viewers: 1247,
    category: "Gaming"
  },
  {
    id: "2",
    title: "PHI",
    username: "GkaQ92oy",
    mcap: "$33.9K",
    ath: "$40.9K",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    thumbnail: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    isLive: true,
    viewers: 892,
    category: "Crypto"
  },
  {
    id: "3",
    title: "DEGEN",
    username: "4hUjfREs",
    mcap: "$22.4K",
    ath: "$250.8K",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    thumbnail: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    isLive: false,
    viewers: 0,
    category: "Trading"
  },
  {
    id: "4",
    title: "5M",
    username: "EZkKsSf4",
    mcap: "$10.3K",
    ath: "$202.6K",
    avatar: "https://randomuser.me/api/portraits/men/12.jpg",
    thumbnail: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80",
    isLive: true,
    viewers: 2156,
    category: "Gaming"
  },
  {
    id: "5",
    title: "$ElonMusk",
    username: "AUjFNfoi",
    mcap: "$5.0K",
    ath: "$6.2K",
    avatar: "https://randomuser.me/api/portraits/men/99.jpg",
    thumbnail: "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80",
    isLive: true,
    viewers: 3421,
    category: "Crypto"
  },
  {
    id: "6",
    title: "clown",
    username: "CzYrVYCK5",
    mcap: "$4.4K",
    ath: "$4.9K",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    thumbnail: "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80",
    isLive: false,
    viewers: 0,
    category: "Entertainment"
  },
  {
    id: "7",
    title: "cutie",
    username: "4pnRiQsm",
    mcap: "$65.7K",
    ath: "$855.2K",
    avatar: "https://randomuser.me/api/portraits/men/23.jpg",
    thumbnail: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    isLive: true,
    viewers: 1893,
    category: "Gaming"
  },
  {
    id: "8",
    title: "Happy Birthday Cher",
    username: "1M",
    mcap: "$138.1K",
    ath: "$1.1M",
    avatar: "https://randomuser.me/api/portraits/men/88.jpg",
    thumbnail: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    isLive: true,
    viewers: 5678,
    category: "Music"
  },
];

export const getLivestreams = async (): Promise<Livestream[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockLivestreams;
};

export const getLiveLivestreams = async (): Promise<Livestream[]> => {
  const streams = await getLivestreams();
  return streams.filter(stream => stream.isLive);
};

export const getLivestreamById = async (id: string): Promise<Livestream | null> => {
  const streams = await getLivestreams();
  return streams.find(stream => stream.id === id) || null;
}; 