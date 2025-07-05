"use client";
import React from "react";
import Chat from "../components/Chat";

const ChatPage = () => {
  // Mock chat data - in a real app, this would come from an API or WebSocket
  const chatData = {
    currentUser: "PixelTrader",
    currentUserAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
    onlineUsers: 1234,
    activeMarkets: 89,
    totalVolume: "$2.4M",
    liveStreams: 156,
  };

  return (
    <div className="min-h-screen flex bg-purple-200">
        {/* Chat Content */}
        <div className="flex-1 overflow-y-auto">
          <Chat 
            currentUser={chatData.currentUser}
            currentUserAvatar={chatData.currentUserAvatar}
          />
        </div>
    </div>
  );
};

export default ChatPage; 