import React from 'react';
import Image from 'next/image';
import ConnectWallet from './ConnectWallet';

interface HomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const HomeModalContent: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-w-[420px] min-h-[340px] max-w-2xl mx-auto">
    {/* Yellow Banner */}
    <div className="w-full border-4 border-black bg-yellow-300 shadow-window-pixel px-4 py-2 mb-4 flex items-center justify-center">
      <span className="text-2xl tracking-wider">♡ WATCH. BET. WIN.</span>
    </div>
    {/* Tri-split row */}
    <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
      {/* How it works */}
      <div className="flex-1 flex flex-col items-center md:items-end text-right max-w-xs">
        <div className="w-full border-2 border-black bg-periwinkle p-2 rounded shadow-window-pixel">
          <div className="bg-cream p-2 rounded text-left">
            <div className="text-plum font-bold text-base sm:text-lg mb-1">How it works:</div>
            <div className="text-fuchsia text-[11px] sm:text-xs leading-tight">Watch a livestream, connect your wallet, and bet on outcomes—all on-chain and transparent.</div>
          </div>
        </div>
      </div>
      {/* Logo and Title */}
      <div className="flex flex-col items-center flex-shrink-0 px-2">
        <Image src="https://res.cloudinary.com/storagemanagementcontainer/image/upload/v1751729735/live-stakes-icon_cfc7t8.png" alt="LiveStakes Logo" width={160} height={160} className="mb-2" />
        <span className="text-2xl sm:text-3xl text-fuchsia tracking-widest leading-tight font-extrabold" style={{textShadow: '2px 2px 0 #000, 0 2px 0 #000, 2px 0 0 #000'}}>
          livestakes.fun
        </span>
      </div>
      {/* Why join */}
      <div className="flex-1 flex flex-col items-center md:items-start text-left max-w-xs">
        <div className="w-full border-2 border-black bg-periwinkle p-2 rounded shadow-window-pixel">
          <div className="bg-cream p-2 rounded text-left">
            <div className="text-plum font-bold text-base sm:text-lg mb-1">Why join?</div>
            <div className="text-fuchsia text-[11px] sm:text-xs leading-tight">Earn FLOW, climb the leaderboard, and engage with hackathons in a new way. No crypto experience needed—just connect and play!</div>
          </div>
        </div>
      </div>
    </div>
    {/* Main description below tri-split */}
    <div className="w-full max-w-xl text-xs sm:text-sm leading-relaxed text-center mb-6 text-purple-800">
      LiveStakes is the world&apos;s first <b>AI-powered livestream betting platform</b> built for hackathons and live events.
    </div>
    {/* Connect Wallet at the bottom */}
    <div className="mt-auto w-full flex justify-center">
      <ConnectWallet style="header" color="fuchsia" />
    </div>
  </div>
);

const HomeModal: React.FC<HomeModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="border-4 border-black bg-purple-100 shadow-window-pixel max-w-2xl w-full mx-4">
        {/* Title bar */}
        <div className="flex items-center justify-between bg-purple-600 text-yellow-50 px-3 py-1 border-b-4 border-black">
          <span className="text-sm">♡ Action!</span>
          <button
            onClick={onClose}
            className="bg-yellow-400 text-black px-2 border border-black leading-none text-lg hover:bg-yellow-300 transition-colors"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default HomeModal; 