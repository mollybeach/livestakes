"use client";
import React from "react";
import Profile from "../components/Profile";
import { mockProfileData } from "../data/profile";
import { useAuth } from "../context/AuthContext";

const ProfilePage = () => {
  const { walletAddress, isLoggedIn } = useAuth();
  // Clone the mock data and override the address if wallet is connected
  const profileData = isLoggedIn && walletAddress
    ? { ...mockProfileData, address: walletAddress }
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