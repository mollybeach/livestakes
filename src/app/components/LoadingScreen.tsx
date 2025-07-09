"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface LoadingScreenProps {
  isLoading: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLoading }) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Loading streams...');

  const loadingMessages = [
    'Loading streams...',
    'Connecting to markets...',
    'Preparing videos...',
    'Setting up betting...',
    'Almost ready...'
  ];

  useEffect(() => {
    if (!isLoading) return;

    let progressInterval: NodeJS.Timeout;
    let messageInterval: NodeJS.Timeout;
    
    // Simulate loading progress
    progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 15 + 5; // Random progress increment
      });
    }, 200);

    // Cycle through loading messages
    let messageIndex = 0;
    messageInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % loadingMessages.length;
      setLoadingText(loadingMessages[messageIndex]);
    }, 800);

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    };
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[10000] bg-gradient-to-br from-purple-600 via-pink-600 to-fuchsia-600 flex flex-col items-center justify-center font-pixel">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-yellow-400 animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Main loading content */}
      <div className="relative z-10 text-center px-4 max-w-sm w-full">
        {/* Logo with pulse animation */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-400 rounded-none animate-pulse"></div>
            <div className="relative bg-cream border-4 border-black rounded-none p-4 shadow-window-pixel">
              <Image 
                src="https://res.cloudinary.com/storagemanagementcontainer/image/upload/v1751729735/live-stakes-icon_cfc7t8.png"
                alt="LiveStakes Logo"
                width={80}
                height={80}
                className="animate-bounce"
              />
            </div>
          </div>
        </div>

        {/* Brand name with typewriter effect */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-yellow-50 mb-2 animate-pulse" style={{textShadow: '3px 3px 0 #000, 0 3px 0 #000, 3px 0 0 #000'}}>
            livestakes.fun
          </h1>
          <p className="text-yellow-200 text-sm md:text-base">
            🎮 AI-Powered Stream Betting
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="bg-black border-4 border-yellow-400 rounded-none h-6 overflow-hidden shadow-window-pixel">
            <div 
              className="h-full bg-gradient-to-r from-yellow-400 to-green-400 transition-all duration-300 ease-out relative"
              style={{ width: `${Math.min(progress, 100)}%` }}
            >
              {/* Animated shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
            </div>
          </div>
          <div className="flex justify-between mt-2 text-yellow-50 text-xs">
            <span>0%</span>
            <span className="font-bold">{Math.round(Math.min(progress, 100))}%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Loading message with typing effect */}
        <div className="mb-8">
          <div className="bg-periwinkle border-4 border-black rounded-none p-4 shadow-window-pixel">
            <div className="bg-cream p-3 rounded-none border-2 border-black">
              <p className="text-purple-800 text-sm animate-pulse">
                {loadingText}
              </p>
            </div>
          </div>
        </div>

        {/* Spinning loading icons */}
        <div className="flex justify-center space-x-4">
          {['🎯', '📱', '💰'].map((emoji, i) => (
            <div 
              key={i}
              className="w-12 h-12 bg-yellow-400 border-2 border-black rounded-none flex items-center justify-center shadow-window-pixel animate-spin"
              style={{
                animationDelay: `${i * 0.3}s`,
                animationDuration: '2s'
              }}
            >
              <span className="text-lg">{emoji}</span>
            </div>
          ))}
        </div>

        {/* Fun tip */}
        <div className="mt-8 text-yellow-200 text-xs animate-pulse">
          💡 Tip: Enable sound for the best experience!
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen; 