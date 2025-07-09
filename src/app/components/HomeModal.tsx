import React from 'react';
import Image from 'next/image';

interface HomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

interface HomeModalContentProps {
  onClose?: () => void;
}

export const HomeModalContent: React.FC<HomeModalContentProps> = ({ onClose }) => (
  <div className="flex flex-col items-center justify-center min-w-[280px] md:min-w-[320px] max-w-sm md:max-w-md mx-auto">
    {/* Logo and Title */}
    <div className="flex flex-col items-center mb-4 md:mb-6">
      <Image 
        src="https://res.cloudinary.com/storagemanagementcontainer/image/upload/v1751729735/live-stakes-icon_cfc7t8.png" 
        alt="LiveStakes Logo" 
        width={80} 
        height={80} 
        className="md:w-[120px] md:h-[120px] mb-2 md:mb-3" 
      />
      <span className="font-pixel text-xl md:text-2xl text-fuchsia tracking-wide font-extrabold" style={{textShadow: '2px 2px 0 #000'}}>
        livestakes.fun
      </span>
    </div>

    {/* Disclaimer Banner */}
    <div className="w-full border-2 md:border-4 border-black bg-yellow-300 shadow-window-pixel px-3 md:px-4 py-2 md:py-3 mb-4 md:mb-6">
      <div className="text-center">
        <div className="text-sm md:text-lg font-pixel font-bold text-black mb-1 md:mb-2">⚠️ DISCLAIMER</div>
        <div className="text-xs md:text-sm font-pixel text-black leading-tight">
          Betting platform with real money risks
        </div>
      </div>
    </div>

    {/* Platform Description - More compact on mobile */}
    <div className="w-full space-y-3 md:space-y-4 mb-4 md:mb-6">
      {/* Mobile: Combined description */}
      <div className="md:hidden border-2 border-black bg-periwinkle p-2 rounded shadow-window-pixel">
        <div className="bg-cream p-2 rounded">
          <div className="text-purple-800 text-xs leading-relaxed">
            <div className="font-bold text-sm mb-1 text-fuchsia">📱 Short Videos + Betting</div>
            Watch videos, explore markets, place bets. Must be 18+. Only bet what you can afford to lose.
          </div>
        </div>
      </div>

      {/* Desktop: Full descriptions */}
      <div className="hidden md:block border-2 border-black bg-periwinkle p-3 rounded shadow-window-pixel">
        <div className="bg-cream p-3 rounded">
          <div className="text-purple-800 text-sm leading-relaxed">
            <div className="font-bold text-base mb-2 text-fuchsia">📱 Short Video Platform</div>
            Watch engaging short videos while exploring prediction markets and betting opportunities.
          </div>
        </div>
      </div>

      <div className="hidden md:block border-2 border-black bg-periwinkle p-3 rounded shadow-window-pixel">
        <div className="bg-cream p-3 rounded">
          <div className="text-purple-800 text-sm leading-relaxed">
            <div className="font-bold text-base mb-2 text-fuchsia">🎯 Market Betting</div>
            Place bets on live streams, events, and market outcomes. All transactions are on-chain and transparent.
          </div>
        </div>
      </div>

      <div className="hidden md:block border-2 border-black bg-periwinkle p-3 rounded shadow-window-pixel">
        <div className="bg-cream p-3 rounded">
          <div className="text-purple-800 text-sm leading-relaxed">
            <div className="font-bold text-base mb-2 text-fuchsia">⚠️ Risk Warning</div>
            Betting involves financial risk. Only bet what you can afford to lose. Must be 18+ to participate.
          </div>
        </div>
      </div>
    </div>

    {/* Ready to Bet Button */}
    <button 
      className="w-full bg-green-600 hover:bg-green-700 text-white font-pixel text-base md:text-lg py-3 md:py-4 px-4 md:px-6 border-2 md:border-4 border-black shadow-window-pixel transition-all duration-200 hover:transform hover:translate-y-1"
      onClick={onClose}
    >
      🚀 I&apos;M READY TO BET
    </button>

    {/* Small print */}
    <div className="text-xs text-purple-600 text-center mt-3 md:mt-4 leading-tight">
      By continuing, you acknowledge the risks and confirm you are 18+
    </div>
  </div>
);

const HomeModal: React.FC<HomeModalProps> = ({ isOpen, onClose, children }) => {
  // Prevent background scrolling when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4"
      onClick={(e) => {
        // Prevent closing by clicking outside - force user to use button
        e.stopPropagation();
      }}
    >
      <div 
        className="border-2 md:border-4 border-black bg-purple-100 shadow-window-pixel max-w-sm md:max-w-2xl w-full relative z-[10000]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title bar */}
        <div className="flex items-center justify-center bg-red-600 text-yellow-50 px-2 md:px-3 py-2 border-b-2 md:border-b-4 border-black">
          <span className="font-pixel text-xs md:text-sm">⚠️ Platform Disclaimer</span>
        </div>
        <div className="p-4 md:p-6">{children}</div>
      </div>
    </div>
  );
};

export default HomeModal; 