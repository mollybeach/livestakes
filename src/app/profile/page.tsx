"use client";
import React from "react";
import Profile from "../components/Profile";
import { mockProfileData } from "../data/profile";

const ProfilePage = () => {
  return (
    <div className="min-h-screen flex font-pixel bg-purple-200">
      <div className="flex-1 overflow-y-auto">
        <Profile profileData={mockProfileData} />
      </div>
    </div>
  );
};

export default ProfilePage; 