"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  User,
  MessageCircle,
  MoreVertical,
  Smile,
  Paperclip,
} from "lucide-react";
import Button from "./ui/button";

interface Message {
  id: number;
  user: string;
  avatar: string;
  message: string;
  timestamp: string;
  isOwn: boolean;
}

interface ChatProps {
  messages?: Message[];
  currentUser?: string;
  currentUserAvatar?: string;
}

const Chat: React.FC<ChatProps> = ({ 
  messages = [],
  currentUser = "PixelTrader",
  currentUserAvatar = "https://randomuser.me/api/portraits/men/32.jpg"
}) => {
  const [newMessage, setNewMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      id: 1,
      user: "CryptoQueen",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      message: "Anyone else bullish on that Solana DeFi protocol? 🚀",
      timestamp: "2:34 PM",
      isOwn: false,
    },
    {
      id: 2,
      user: "BlockchainBro",
      avatar: "https://randomuser.me/api/portraits/men/67.jpg",
      message: "I'm in! The odds look great at 2.5x",
      timestamp: "2:35 PM",
      isOwn: false,
    },
    {
      id: 3,
      user: "PixelTrader",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      message: "Just placed my bet! This is going to moon 🌙",
      timestamp: "2:36 PM",
      isOwn: true,
    },
    {
      id: 4,
      user: "DeFiDude",
      avatar: "https://randomuser.me/api/portraits/men/23.jpg",
      message: "What's everyone's prediction for the AI Trading Bot market?",
      timestamp: "2:37 PM",
      isOwn: false,
    },
    {
      id: 5,
      user: "NFTNinja",
      avatar: "https://randomuser.me/api/portraits/women/28.jpg",
      message: "I think it'll outperform BTC by 50% easy 💪",
      timestamp: "2:38 PM",
      isOwn: false,
    },
    {
      id: 6,
      user: "PixelTrader",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      message: "The volume is insane on this one!",
      timestamp: "2:39 PM",
      isOwn: true,
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now(),
        user: currentUser,
        avatar: currentUserAvatar,
        message: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: true,
      };
      setChatMessages([...chatMessages, message]);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-mauve font-pixel p-6">
      <div className="max-w-4xl mx-auto">
        {/* Chat Header */}
        <div className="bg-plum border-4 border-black p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageCircle size={24} className="text-gold" />
              <h1 className="text-2xl font-bold text-cream">LiveStakes Chat</h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-cream text-sm font-pixel">Online: 1,234</span>
              <button className="text-cream hover:text-butter transition-colors">
                <MoreVertical size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="bg-periwinkle border-4 border-black h-[600px] flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.isOwn ? 'justify-end' : 'justify-start'}`}
              >
                {!message.isOwn && (
                  <img
                    src={message.avatar}
                    alt={message.user}
                    className="w-8 h-8 rounded-full border-2 border-black flex-shrink-0"
                  />
                )}
                <div className={`max-w-[70%] ${message.isOwn ? 'order-first' : ''}`}>
                  {!message.isOwn && (
                    <div className="text-xs text-butter mb-1 font-pixel">
                      {message.user}
                    </div>
                  )}
                  <div
                    className={`p-3 rounded-lg border-2 border-black ${
                      message.isOwn
                        ? 'bg-gold text-black'
                        : 'bg-lavender text-plum'
                    }`}
                  >
                    <p className="text-sm font-pixel">{message.message}</p>
                  </div>
                  <div className="text-xs text-butter mt-1 font-pixel">
                    {message.timestamp}
                  </div>
                </div>
                {message.isOwn && (
                  <img
                    src={message.avatar}
                    alt={message.user}
                    className="w-8 h-8 rounded-full border-2 border-black flex-shrink-0"
                  />
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t-4 border-black p-4 bg-lavender">
            <div className="flex gap-2">
              <button className="text-purple-600 hover:text-purple-800 transition-colors p-2">
                <Smile size={20} />
              </button>
              <button className="text-purple-600 hover:text-purple-800 transition-colors p-2">
                <Paperclip size={20} />
              </button>
              <div className="flex-1">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="w-full px-3 py-2 border-2 border-black bg-cream text-plum font-pixel text-sm focus:outline-none focus:border-purple-500"
                />
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="bg-yellow-400 hover:bg-yellow-300 text-black border-2 border-black font-pixel px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={16} />
              </Button>
            </div>
          </div>
        </div>

        {/* Chat Info */}
        <div className="mt-4 bg-pink-600 border-4 border-black p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-yellow-400 text-xl font-bold">1,234</div>
              <div className="text-yellow-50 text-sm font-pixel">Online Users</div>
            </div>
            <div>
              <div className="text-yellow-400 text-xl font-bold">89</div>
              <div className="text-yellow-50 text-sm font-pixel">Active Markets</div>
            </div>
            <div>
              <div className="text-yellow-400 text-xl font-bold">$2.4M</div>
              <div className="text-yellow-50 text-sm font-pixel">Total Volume</div>
            </div>
            <div>
              <div className="text-yellow-400 text-xl font-bold">156</div>
              <div className="text-yellow-50 text-sm font-pixel">Live Streams</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat; 