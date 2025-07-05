import React from "react";
import Card from "./ui/card";
import Button from "./ui/button";
import CardContent from "./CardContent";
import LiveBadge from "./LiveBadge";

interface StreamCardProps {
  id?: number;
  title: string;
  description?: string;
  creator_wallet_address: string;
  stream_url?: string;
  thumbnail_url?: string;
  status: 'scheduled' | 'active' | 'ended';
  start_time?: string;
  end_time?: string;
  view_count?: number;
  category?: string;
  created_at?: string;
  updated_at?: string;
}

const StreamCard: React.FC<StreamCardProps> = ({
  thumbnail_url,
  title,
  description,
  status,
  view_count,
  category,
  start_time,
  end_time,
  creator_wallet_address,
}) => (
  <Card className="relative border-4 border-black rounded-none shadow-window-pixel bg-purple-50 hover:-translate-y-1 transition-transform">
    {status === 'active' && <LiveBadge />}
    <img
      src={thumbnail_url}
      alt={title}
      className="w-full h-48 object-cover border-b-4 border-black"
    />
    <CardContent>
      <div className="flex items-center gap-3 mb-2">
        <img src="https://randomuser.me/api/portraits/men/32.jpg" alt={title} className="w-8 h-8 rounded-full border border-gray-700" />
        <div>
          <h3 className="text-base font-bold">{title}</h3>
          {category && <p className="text-xs text-gray-500">Category: {category}</p>}
        </div>
      </div>
      {description && <p className="text-xs mb-2 text-gray-700">{description}</p>}
      <div className="flex flex-wrap gap-2 mb-2">
        {typeof view_count === 'number' && <span className="text-xs bg-yellow-200 text-yellow-900 font-bold px-2 py-0.5 rounded">👁️ {view_count}</span>}
        {start_time && <span className="text-xs bg-blue-200 text-blue-900 font-bold px-2 py-0.5 rounded">Start: {start_time}</span>}
        {end_time && <span className="text-xs bg-blue-200 text-blue-900 font-bold px-2 py-0.5 rounded">End: {end_time}</span>}
      </div>
      <Button className="mt-2 w-full bg-pink-600 hover:bg-pink-700 text-yellow-50 border border-black rounded-none font-pixel uppercase">
        Bet Now
      </Button>
    </CardContent>
  </Card>
);

export default StreamCard; 