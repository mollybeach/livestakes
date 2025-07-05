import React from "react";

interface LivestreamCardProps {
  title: string;
  username: string;
  mcap: string;
  ath: string;
  avatar: string;
  thumbnail: string;
}

const LivestreamCard: React.FC<LivestreamCardProps> = ({
  title,
  username,
  mcap,
  ath,
  avatar,
  thumbnail,
}) => {
  return (
    <div className="bg-[#181A20] rounded-xl overflow-hidden shadow-lg flex flex-col">
      {/* Video/Thumbnail */}
      <div className="relative w-full h-40 bg-black">
        <img
          src={thumbnail}
          alt={title}
          className="object-cover w-full h-full"
        />
        <span className="absolute top-2 left-2 bg-green-500 text-xs font-bold text-white px-2 py-0.5 rounded">LIVE</span>
      </div>
      {/* Info Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#181A20]">
        <div className="flex items-center gap-3">
          <img
            src={avatar}
            alt={username}
            className="w-8 h-8 rounded-full border border-gray-700"
          />
          <div>
            <div className="font-semibold text-white leading-tight text-base">{title}</div>
            <div className="text-gray-400 text-xs leading-tight">{username}</div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-xs text-gray-300">mcap <span className="bg-green-300/80 text-green-900 font-bold px-2 py-0.5 rounded">{mcap}</span></div>
          <div className="text-xs text-gray-500">ATH: {ath}</div>
        </div>
      </div>
    </div>
  );
};

export default LivestreamCard; 