"use client";
import React, { useEffect } from "react";
import { usePrivy } from '@privy-io/react-auth';

const CreatePage = () => {
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
          <p className="text-purple-800 mb-4">Please login to create content</p>
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
          <h1 className="text-3xl font-bold text-purple-800 mb-6">Create Content</h1>
          
          <div className="bg-white rounded-lg border-4 border-black shadow-window-pixel p-6">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎬</div>
              <h2 className="text-2xl font-bold text-purple-800 mb-4">Create Feature Coming Soon!</h2>
              <p className="text-purple-600 mb-6">
                Upload videos, create livestreams, and build your audience.
              </p>
              <div className="space-y-4">
                <div className="bg-purple-100 border-2 border-purple-300 rounded-lg p-4 text-left">
                  <h3 className="font-bold text-purple-800 mb-2">📹 Video Upload</h3>
                  <p className="text-purple-600 text-sm">Upload and manage your video content</p>
                </div>
                <div className="bg-purple-100 border-2 border-purple-300 rounded-lg p-4 text-left">
                  <h3 className="font-bold text-purple-800 mb-2">🔴 Live Streaming</h3>
                  <p className="text-purple-600 text-sm">Start live streams with betting opportunities</p>
                </div>
                <div className="bg-purple-100 border-2 border-purple-300 rounded-lg p-4 text-left">
                  <h3 className="font-bold text-purple-800 mb-2">🎯 Market Creation</h3>
                  <p className="text-purple-600 text-sm">Create custom betting markets for your content</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePage; 