"use client";
import React, { useState } from "react";
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
} from "lucide-react";
import { mockProfileData, ProfileData } from "../data/profile";

interface ProfileProps {
  profileData?: ProfileData;
}

const Profile: React.FC<ProfileProps> = ({ 
  profileData = mockProfileData
}) => {
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(profileData.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

  return (
    <div className="min-h-screen bg-mauve font-pixel p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-plum border-4 border-black p-6 mb-6">
          <div className="flex items-center gap-6">
            <img 
              src={profileData.avatar} 
              alt={profileData.username} 
              className="w-20 h-20 rounded-full border-4 border-black"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-cream mb-2">{profileData.username}</h1>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2 bg-butter text-black px-3 py-1 border-2 border-black">
                  <Wallet size={16} />
                  <span className="font-pixel text-sm">{profileData.address}</span>
                  <button 
                    onClick={copyAddress}
                    className="ml-2 hover:pink transition-colors p-1"
                  >
                    <Copy size={14} />
                  </button>
                </div>
                <a 
                  href={profileData.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-steel text-white px-3 py-1 border-2 border-black hover:bg-gray-700 transition-colors"
                >
                  <Github size={16} />
                  <span className="font-pixel text-sm">GitHub</span>
                </a>
                {copied && (
                  <span className="text-green-400 text-sm font-pixel">Copied!</span>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                <Trophy size={20} className="text-gold" />
                <span className="text-cream font-pixel">{profileData.rank}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star size={20} className="text-gold" />
                <span className="text-cream font-pixel">{profileData.rating}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-coral border-4 border-black p-4 text-center">
            <div className="text-pink-600 text-2xl font-bold">{profileData.stats.totalBets}</div>
            <div className="text-cream text-sm font-pixel">Total Bets</div>
          </div>
          <div className="bg-coral border-4 border-black p-4 text-center">
            <div className="text-pink-600 text-2xl font-bold">{profileData.stats.winRate}</div>
            <div className="text-cream text-sm font-pixel">Win Rate</div>
          </div>
          <div className="bg-coral border-4 border-black p-4 text-center">
            <div className="text-pink-600 text-2xl font-bold">{profileData.stats.totalWinnings}</div>
            <div className="text-cream text-sm font-pixel">Total Winnings</div>
          </div>
          <div className="bg-coral border-4 border-black p-4 text-center">
            <div className="text-pink-600 text-2xl font-bold">{profileData.stats.activeProjects}</div>
            <div className="text-cream text-sm font-pixel">Active Projects</div>
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
              {profileData.liveStreams.map((stream) => (
                <div key={stream.id} className="bg-cream border-2 border-black p-4">
                  <div className="flex gap-3">
                    <img 
                      src={stream.thumbnail} 
                      alt={stream.title}
                      className="w-16 h-12 object-cover border border-black"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-plum text-sm">{stream.title}</h3>
                        <span className={`px-2 py-1 text-xs font-pixel border border-black ${getStatusColor(stream.status)}`}>
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
              {profileData.recentBets.map((bet) => (
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
            {profileData.projects.map((project) => (
              <div key={project.id} className="bg-cream border-2 border-black p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-plum">{project.title}</h3>
                  <span className={`px-2 py-1 text-xs font-pixel border-2 border-black ${getStatusColor(project.status)}`}>
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
                    <span className={`px-2 py-1 text-xs font-pixel border border-black ${getBetStatusColor(project.result)}`}>
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
            {profileData.achievements.map((achievement) => {
              const IconComponent = getIconComponent(achievement.icon);
              return (
                <div key={achievement.id} className="bg-sage border-2 border-black p-4 text-center">
                  <IconComponent size={32} className="mx-auto mb-2 text-black" />
                  <div className="font-bold text-black font-pixel">{achievement.title}</div>
                  <div className="text-xs text-black">{achievement.description}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 