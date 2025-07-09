"use client";
import React, { useEffect } from "react";
import Profile from "../components/Profile";
import { mockProfileData } from "../data/profile";
import { usePrivy } from '@privy-io/react-auth';

const ProfilePage = () => {
  const { authenticated, user, login, ready } = usePrivy();

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
          <p className="text-purple-800 mb-4">Please login to view your profile</p>
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

  // Clone the mock data and override the address if wallet is connected
  const profileData = user?.wallet?.address
    ? { ...mockProfileData, address: user.wallet.address }
    : mockProfileData;

  return (
    <div className="min-h-screen flex font-pixel bg-purple-200">
      <div className="flex-1 overflow-y-auto">
        <Profile profileData={profileData} />
      </div>
    </div>
  );
};

export default ProfilePage; 