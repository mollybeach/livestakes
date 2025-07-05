import React from "react";
import Card from "./ui/card";
import Button from "./ui/button";
import CardContent from "./CardContent";
import LiveBadge from "./LiveBadge";

interface StreamCardProps {
  thumbnail: string;
  username: string;
  title: string;
  team: string;
  odds: string;
  isLive?: boolean;
  avatar: string;
  mcap: string;
  ath: string;
  viewers?: number;
}

const StreamCard: React.FC<StreamCardProps> = ({ thumbnail, username, team, odds, isLive, avatar, mcap, ath, viewers }) => (
  <Card className="relative border-4 border-black rounded-none shadow-window-pixel bg-purple-50 hover:-translate-y-1 transition-transform">
    {isLive && <LiveBadge />}
    <img
      src={thumbnail}
      alt="thumbnail"
      className="w-full h-48 object-cover border-b-4 border-black"
    />
    <CardContent>
      <div className="flex items-center gap-3 mb-2">
        <img src={avatar} alt={team} className="w-8 h-8 rounded-full border border-gray-700" />
        <div>
          <h3 className="text-base font-bold">{username}</h3>
          <p className="text-xs text-gray-500">Team: {team}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-2">
        <span className="text-xs bg-green-200 text-green-900 font-bold px-2 py-0.5 rounded">mcap {mcap}</span>
        <span className="text-xs bg-blue-200 text-blue-900 font-bold px-2 py-0.5 rounded">ATH {ath}</span>
        {typeof viewers === 'number' && <span className="text-xs bg-yellow-200 text-yellow-900 font-bold px-2 py-0.5 rounded">👁️ {viewers}</span>}
      </div>
      <span className="text-xs bg-green-200 text-purple-900 font-bold px-2 py-0.5 rounded">Odds: {odds}</span>
      <Button className="mt-2 w-full bg-pink-600 hover:bg-pink-700 text-yellow-50 border border-black rounded-none font-pixel uppercase">
        Bet Now
      </Button>
    </CardContent>
  </Card>
);

export default StreamCard; 