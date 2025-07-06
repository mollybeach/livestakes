"use client";
import React, { useState, useEffect } from "react";
import { usePrivy } from '@privy-io/react-auth';
import {
  Wallet,
  Trophy,
  TrendingUp,
  Star,
  Award,
  Target,
  Users,
  Coins,
  Activity,
  Copy,
  Github,
  MonitorPlay,
  Eye,
  Calendar,
  Edit3,
  Heart,
  MessageCircle,
  Check,
  X as CloseIcon,
} from "lucide-react";
import { mockProfileData, ProfileData } from "../data/profile";
import ProfileEditModal from "./ProfileEditModal";
import ImageUploadModal from "./ImageUploadModal";

interface UserProfile {
  id?: number;
  wallet_address: string;
  email?: string;
  username?: string;
  avatar_url?: string;
  github_url?: string;
  bio?: string;
  win_rate?: number;
  total_winnings?: string;
  total_bets?: number;
  total_wins?: number;
  rank?: string;
  rating?: number;
}

interface ProfileProps {
  profileData?: ProfileData;
}

const DEFAULT_AVATAR = "https://res.cloudinary.com/storagemanagementcontainer/image/upload/v1751747169/default-avatar_ynttwb.png";
const DEFAULT_LOGO = "https://res.cloudinary.com/storagemanagementcontainer/image/upload/v1751729735/live-stakes-icon_cfc7t8.png";

const Profile: React.FC<ProfileProps> = ({ 
  profileData = mockProfileData
}) => {
  const { authenticated, user } = usePrivy();
  const [copied, setCopied] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editingUsername, setEditingUsername] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");

  // Fetch user profile from database
  useEffect(() => {
    if (authenticated && user?.wallet?.address) {
      fetchUserProfile(user.wallet.address);
    }
  }, [authenticated, user?.wallet?.address]);

  const fetchUserProfile = async (walletAddress: string) => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3334';
      const response = await fetch(`${API_BASE_URL}/api/users/${walletAddress}`);
      
      if (response.ok) {
        const result = await response.json();
        setUserProfile(result.user);
      } else {
        // Create new user profile if not found
        await createUserProfile(walletAddress);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const createUserProfile = async (walletAddress: string) => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3334';
      const response = await fetch(`${API_BASE_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wallet_address: walletAddress,
          username: `User_${walletAddress.slice(0, 6)}`,
          avatar_url: DEFAULT_AVATAR,
        }),
      });
      
      if (response.ok) {
        const result = await response.json();
        setUserProfile(result.user);
      }
    } catch (error) {
      console.error('Error creating user profile:', error);
    }
  };

  const handleSaveProfile = async (updatedProfile: UserProfile) => {
    if (!user?.wallet?.address) return;
    
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3334';
      const response = await fetch(`${API_BASE_URL}/api/users/${user.wallet.address}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProfile),
      });
      
      if (response.ok) {
        const result = await response.json();
        setUserProfile(result.user);
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const handleImageUpload = async (imageUrl: string) => {
    if (!user?.wallet?.address || !userProfile) return;
    
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3334';
      const response = await fetch(`${API_BASE_URL}/api/users/${user.wallet.address}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...userProfile,
          avatar_url: imageUrl,
        }),
      });
      
      if (response.ok) {
        const result = await response.json();
        setUserProfile(result.user);
      } else {
        throw new Error('Failed to update profile image');
      }
    } catch (error) {
      console.error('Error updating profile image:', error);
      throw error;
    }
  };

  const copyAddress = () => {
    const address = userProfile?.wallet_address || profileData.address;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const truncateAddress = (address: string) => {
    if (address.length <= 8) return address;
    return `${address.slice(0, 1)}..${address.slice(-1)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-sage text-forest';
      case 'ended':
        return 'bg-slate text-charcoal';
      case 'scheduled':
        return 'bg-butter text-yellow-900';
      default:
        return 'bg-butter text-yellow-900';
    }
  };

  const getBetStatusColor = (status: string) => {
    switch (status) {
      case 'won':
        return 'bg-sage text-forest';
      case 'lost':
        return 'bg-rust text-burgundy';
      case 'pending':
        return 'bg-butter text-yellow-900';
      default:
        return 'bg-butter text-yellow-900';
    }
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Trophy':
        return Trophy;
      case 'TrendingUp':
        return TrendingUp;
      case 'Users':
        return Users;
      case 'Coins':
        return Coins;
      default:
        return Trophy;
    }
  };

  // Use user profile data if available, otherwise fall back to mock data
  const displayProfile = userProfile ? {
    username: userProfile.username || `User_${userProfile.wallet_address.slice(0, 6)}`,
    address: userProfile.wallet_address,
    avatar: userProfile.avatar_url || DEFAULT_AVATAR,
    githubUrl: userProfile.github_url,
    rank: userProfile.rank || 'Newcomer',
    rating: userProfile.rating || 0,
    stats: {
      totalBets: userProfile.total_bets || 0,
      winRate: userProfile.win_rate || 0,
      totalWinnings: userProfile.total_winnings || '0',
      activeProjects: profileData.stats.activeProjects, // Keep from mock for now
    },
    liveStreams: profileData.liveStreams, // Keep from mock for now
    recentBets: profileData.recentBets, // Keep from mock for now
    projects: profileData.projects, // Keep from mock for now
    achievements: profileData.achievements, // Keep from mock for now
  } : profileData;

  return (
    <>
      <div className="min-h-screen bg-mauve p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="bg-plum border-4 border-black p-6 mb-6">
            <div className="flex items-center gap-6">
              {/* Profile Image with Edit Button */}
              <div className="relative group">
                <img 
                  src={displayProfile.avatar} 
                  alt={displayProfile.username} 
                  className="w-20 h-20 rounded-full border-4 border-black"
                />
                {authenticated && (
                  <button
                    onClick={() => setShowImageUploadModal(true)}
                    className="absolute -top-2 -right-2 bg-purple-600 hover:bg-purple-700 text-yellow-50 p-1 border-2 border-black rounded-none opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Edit3 size={12} />
                  </button>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {editingUsername ? (
                    <>
                      <input
                        type="text"
                        value={usernameInput}
                        onChange={e => setUsernameInput(e.target.value)}
                        className="px-2 py-1 border-2 border-black rounded-none text-lg font-bold bg-white text-plum"
                      />
                      <button
                        onClick={async () => {
                          if (!userProfile) return;
                          await handleSaveProfile({ ...userProfile, username: usernameInput, wallet_address: userProfile.wallet_address || "" });
                          setEditingUsername(false);
                        }}
                        className="ml-1 text-green-700 hover:text-green-900"
                      >
                        <Check size={18} />
                      </button>
                      <button
                        onClick={() => setEditingUsername(false)}
                        className="ml-1 text-red-700 hover:text-red-900"
                      >
                        <CloseIcon size={18} />
                      </button>
                    </>
                  ) : (
                    <>
                      <h1 className="text-3xl font-bold text-cream mb-2">{displayProfile.username}</h1>
                      {authenticated && (
                        <button
                          onClick={() => {
                            setEditingUsername(true);
                            setUsernameInput(displayProfile.username);
                          }}
                          className="ml-2 text-purple-700 hover:text-purple-900"
                          aria-label="Edit username"
                        >
                          <Edit3 size={18} />
                        </button>
                      )}
                    </>
                  )}
                </div>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2 bg-butter text-black px-3 py-1 border-2 border-black">
                    <Wallet size={16} />
                    <span className="text-sm hidden md:inline">{displayProfile.address}</span>
                    <span className="text-sm md:hidden">{truncateAddress(displayProfile.address)}</span>
                    <button 
                      onClick={copyAddress}
                      className="ml-2 hover:pink transition-colors p-1"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                  
                  {displayProfile.githubUrl && (
                    <a 
                      href={displayProfile.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-steel text-white px-3 py-1 border-2 border-black hover:bg-gray-700 transition-colors relative group"
                    >
                      <Github size={16} />
                      <span className="text-sm">GitHub</span>
                      {authenticated && (
                        <button
                          onClick={() => setShowEditModal(true)}
                          className="absolute -top-1 -right-1 bg-purple-600 hover:bg-purple-700 text-yellow-50 p-0.5 border border-black rounded-none opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Edit3 size={8} />
                        </button>
                      )}
                    </a>
                  )}
                  
                  {copied && (
                    <span className="text-green-400 text-sm">Copied!</span>
                  )}
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy size={20} className="text-gold" />
                  <span className="text-cream">{displayProfile.rank}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star size={20} className="text-gold" />
                  <span className="text-cream">{displayProfile.rating}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-coral border-4 border-black p-4 text-center">
              <div className="text-pink-600 text-2xl font-bold">{displayProfile.stats.totalBets}</div>
              <div className="text-cream text-sm">Total Bets</div>
            </div>
            <div className="bg-coral border-4 border-black p-4 text-center">
              <div className="text-pink-600 text-2xl font-bold">{displayProfile.stats.winRate}%</div>
              <div className="text-cream text-sm">Win Rate</div>
            </div>
            <div className="bg-coral border-4 border-black p-4 text-center">
              <div className="text-pink-600 text-2xl font-bold">{displayProfile.stats.totalWinnings}</div>
              <div className="text-cream text-sm">Total Winnings</div>
            </div>
            <div className="bg-coral border-4 border-black p-4 text-center">
              <div className="text-pink-600 text-2xl font-bold">{displayProfile.stats.activeProjects}</div>
              <div className="text-cream text-sm">Active Projects</div>
            </div>
          </div>

          {/* Live Streams and Recent Bets */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Live Streams Section */}
            <div className="bg-periwinkle border-4 border-black p-6">
              <h2 className="text-2xl font-bold text-cream mb-4 flex items-center gap-2">
                <MonitorPlay size={24} />
                My Live Streams
              </h2>
              <div className="space-y-4">
                {displayProfile.liveStreams.map((stream) => (
                  <div key={stream.id} className="bg-cream border-2 border-black p-4">
                    <div className="flex gap-3">
                      <img 
                        src={DEFAULT_LOGO} 
                        alt={stream.title}
                        className="w-16 h-12 object-cover border border-black"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-plum text-sm">{stream.title}</h3>
                          <span className={`px-2 py-1 text-xs border border-black ${getStatusColor(stream.status)}`}>
                            {stream.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-purple-700">
                          <div className="flex items-center gap-1">
                            <Eye size={12} />
                            <span>{stream.viewers}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar size={12} />
                            <span>{stream.duration}</span>
                          </div>
                          <span className="bg-sky text-navy px-2 py-1 border border-black">
                            {stream.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-periwinkle border-4 border-black p-6">
              <h2 className="text-2xl font-bold text-cream mb-4 flex items-center gap-2">
                <Activity size={24} />
                Recent Bets
              </h2>
              <div className="space-y-3">
                {displayProfile.recentBets.map((bet) => (
                  <div key={bet.id} className="bg-cream border-2 border-black p-3 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-plum">{bet.title}</div>
                      <div className="text-xs text-purple-700">{bet.date}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-plum">{bet.amount}</div>
                      <span className={`text-xs px-2 py-1 border border-black ${getBetStatusColor(bet.status)}`}>
                        {bet.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Projects Section */}
          <div className="bg-periwinkle border-4 border-black p-6 mb-6">
            <h2 className="text-2xl font-bold text-cream mb-4 flex items-center gap-2">
              <Target size={24} />
              My Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayProfile.projects.map((project) => (
                <div key={project.id} className="bg-cream border-2 border-black p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-plum">{project.title}</h3>
                    <span className={`px-2 py-1 text-xs border-2 border-black ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>
                  <p className="text-sm text-purple-700 mb-2">{project.description}</p>
                  <div className="flex justify-between items-center text-xs">
                    <span className="bg-sky text-navy px-2 py-1 border border-black">
                      Volume: {project.volume}
                    </span>
                    <span className="bg-mauve text-plum px-2 py-1 border border-black">
                      {project.participants} participants
                    </span>
                    <span className="bg-sage text-forest px-2 py-1 border border-black">
                      {project.odds}
                    </span>
                  </div>
                  {project.result && (
                    <div className="mt-2">
                      <span className={`px-2 py-1 text-xs border border-black ${getBetStatusColor(project.result)}`}>
                        {project.result}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Achievements Section */}
          <div className="bg-periwinkle border-4 border-black p-6">
            <h2 className="text-2xl font-bold text-cream mb-4 flex items-center gap-2">
              <Award size={24} />
              Achievements
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {displayProfile.achievements.map((achievement) => {
                const IconComponent = getIconComponent(achievement.icon);
                return (
                  <div key={achievement.id} className="bg-sage border-2 border-black p-4 text-center">
                    <IconComponent size={32} className="mx-auto mb-2 text-black" />
                    <div className="font-bold text-black">{achievement.title}</div>
                    <div className="text-xs text-black">{achievement.description}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Edit Modal */}
      {userProfile && (
        <ProfileEditModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          profile={userProfile}
          onSave={handleSaveProfile}
        />
      )}

      {/* Image Upload Modal */}
      {showImageUploadModal && (
        <ImageUploadModal
          isOpen={showImageUploadModal}
          onClose={() => setShowImageUploadModal(false)}
          currentImageUrl={displayProfile.avatar}
          onImageUpload={handleImageUpload}
        />
      )}
    </>
  );
};

export default Profile; 