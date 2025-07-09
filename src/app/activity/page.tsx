"use client";
import React, { useEffect } from "react";
import { usePrivy } from '@privy-io/react-auth';

const ActivityPage = () => {
  const { authenticated, login, ready } = usePrivy();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (ready && !authenticated) {
      login();
    }
  }, [ready, authenticated, login]);

  // Show loading while Privy is initializing
  if (!ready) {
    return (
      <div className="min-h-screen flex font-pixel bg-purple-200 items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🔄</div>
          <p className="text-purple-800">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!authenticated) {
    return (
      <div className="min-h-screen flex font-pixel bg-purple-200 items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🔐</div>
          <p className="text-purple-800 mb-4">Please login to view your activity</p>
          <button 
            onClick={login}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 border-2 border-black rounded-none font-pixel transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex font-pixel bg-purple-200">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-purple-800 mb-6">Activity</h1>
          
          <div className="space-y-6">
            {/* Recent Activity */}
            <div className="bg-white rounded-lg border-4 border-black shadow-window-pixel p-6">
              <h2 className="text-xl font-bold text-purple-800 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">❤️</div>
                    <div>
                      <p className="font-semibold text-purple-800">You liked a video</p>
                      <p className="text-purple-600 text-sm">2 hours ago</p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">🎯</div>
                    <div>
                      <p className="font-semibold text-green-800">You placed a bet</p>
                      <p className="text-green-600 text-sm">1 day ago</p>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">💬</div>
                    <div>
                      <p className="font-semibold text-blue-800">You commented on a video</p>
                      <p className="text-blue-600 text-sm">2 days ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Stats */}
            <div className="bg-white rounded-lg border-4 border-black shadow-window-pixel p-6">
              <h2 className="text-xl font-bold text-purple-800 mb-4">Your Stats</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-purple-100 border-2 border-purple-300 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">❤️</div>
                  <div className="text-xl font-bold text-purple-800">24</div>
                  <div className="text-purple-600 text-sm">Likes Given</div>
                </div>
                <div className="bg-green-100 border-2 border-green-300 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">🎯</div>
                  <div className="text-xl font-bold text-green-800">8</div>
                  <div className="text-green-600 text-sm">Bets Placed</div>
                </div>
                <div className="bg-blue-100 border-2 border-blue-300 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">💬</div>
                  <div className="text-xl font-bold text-blue-800">12</div>
                  <div className="text-blue-600 text-sm">Comments</div>
                </div>
                <div className="bg-yellow-100 border-2 border-yellow-300 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">🏆</div>
                  <div className="text-xl font-bold text-yellow-800">3</div>
                  <div className="text-yellow-600 text-sm">Wins</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityPage; 