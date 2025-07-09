"use client";
import React, { useState } from 'react';
import { FaTwitter, FaTelegram, FaWhatsapp, FaFacebook, FaLinkedin, FaCopy, FaTimes } from 'react-icons/fa';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoTitle: string;
  videoUrl?: string;
  streamId: number;
}

const ShareModal: React.FC<ShareModalProps> = ({ 
  isOpen, 
  onClose, 
  videoTitle, 
  videoUrl, 
  streamId 
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Generate the share URL (in a real app, this would be the actual video URL)
  const shareUrl = videoUrl || `${window.location.origin}/video/${streamId}`;
  const shareText = `Check out this video: ${videoTitle}`;
  
  const shareLinks = [
    {
      name: 'X (Twitter)',
      icon: <FaTwitter className="text-lg" />,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      name: 'Telegram',
      icon: <FaTelegram className="text-lg" />,
      url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
      color: 'bg-blue-400 hover:bg-blue-500',
    },
    {
      name: 'WhatsApp',
      icon: <FaWhatsapp className="text-lg" />,
      url: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      name: 'Facebook',
      icon: <FaFacebook className="text-lg" />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      name: 'LinkedIn',
      icon: <FaLinkedin className="text-lg" />,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      color: 'bg-blue-700 hover:bg-blue-800',
    },
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleShareClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <div 
        className="border-2 md:border-4 border-black bg-cream shadow-window-pixel max-w-sm w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-pink-600 text-yellow-50 px-3 py-2 border-b-2 md:border-b-4 border-black">
          <span className="font-pixel text-sm">📤 Share Video</span>
          <button
            onClick={onClose}
            className="bg-yellow-400 text-black px-2 py-1 border border-black leading-none font-pixel text-sm hover:bg-yellow-300 transition-colors"
            aria-label="Close share modal"
          >
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Video title */}
          <div className="mb-4">
            <h3 className="text-purple-800 font-pixel text-sm mb-2">Sharing:</h3>
            <p className="text-purple-600 text-xs bg-periwinkle p-2 border border-black rounded-none">
              {videoTitle.length > 60 ? `${videoTitle.slice(0, 60)}...` : videoTitle}
            </p>
          </div>

          {/* Social share buttons */}
          <div className="space-y-3 mb-4">
            <h4 className="text-purple-800 font-pixel text-xs mb-2">Choose platform:</h4>
            <div className="grid grid-cols-1 gap-2">
              {shareLinks.map((platform) => (
                <button
                  key={platform.name}
                  onClick={() => handleShareClick(platform.url)}
                  className={`flex items-center gap-3 w-full px-3 py-2 ${platform.color} text-white border-2 border-black rounded-none shadow-window-pixel transition-all duration-200 hover:transform hover:translate-y-1 font-pixel text-xs`}
                >
                  {platform.icon}
                  <span>Share on {platform.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Copy link section */}
          <div className="space-y-2">
            <h4 className="text-purple-800 font-pixel text-xs">Or copy link:</h4>
            <div className="flex gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-2 py-1 border-2 border-black rounded-none bg-white text-xs font-mono text-purple-800"
              />
              <button
                onClick={handleCopyLink}
                className={`px-3 py-1 border-2 border-black rounded-none font-pixel text-xs transition-all duration-200 ${
                  copied 
                    ? 'bg-green-500 text-white' 
                    : 'bg-yellow-400 text-black hover:bg-yellow-300'
                }`}
              >
                {copied ? '✓ Copied!' : <FaCopy />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal; 