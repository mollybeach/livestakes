'use client';

import React, { useState } from 'react';
import { X, Save, Edit3 } from 'lucide-react';

interface UserProfile {
  id?: number;
  wallet_address: string;
  email?: string;
  username?: string;
  avatar_url?: string;
  github_url?: string;
  bio?: string;
}

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSave: (updatedProfile: UserProfile) => Promise<void>;
}

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave
}) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await onSave(formData);
      setSuccess('Profile updated successfully! 🎉');
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      setError('Failed to update profile. Please try again.');
      console.error('Profile update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-yellow-50 border-4 border-black rounded-none shadow-window-pixel w-full max-w-md">
        {/* Header */}
        <div className="border-b-4 border-black px-6 py-4 bg-pink-600">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-yellow-50 flex items-center gap-2">
              <Edit3 size={20} />
              Edit Profile
            </h2>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="text-yellow-200 hover:text-yellow-50 transition-colors disabled:cursor-not-allowed"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-4 bg-yellow-50">
          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border-2 border-red-500 rounded-none p-3">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-800 text-sm font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-100 border-2 border-green-500 rounded-none p-3">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-green-800 text-sm font-medium">{success}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-bold text-black mb-2">
                Username
              </label>
              <input
                type="text"
                value={formData.username || ''}
                onChange={(e) => handleInputChange('username', e.target.value)}
                className="w-full px-3 py-2 border-2 border-black bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 rounded-none"
                placeholder="Enter your username"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-black mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border-2 border-black bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 rounded-none"
                placeholder="Enter your email"
              />
            </div>

            {/* Avatar URL */}
            <div>
              <label className="block text-sm font-bold text-black mb-2">
                Avatar URL
              </label>
              <input
                type="url"
                value={formData.avatar_url || ''}
                onChange={(e) => handleInputChange('avatar_url', e.target.value)}
                className="w-full px-3 py-2 border-2 border-black bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 rounded-none"
                placeholder="Enter avatar URL"
              />
            </div>

            {/* GitHub URL */}
            <div>
              <label className="block text-sm font-bold text-black mb-2">
                GitHub URL
              </label>
              <input
                type="url"
                value={formData.github_url || ''}
                onChange={(e) => handleInputChange('github_url', e.target.value)}
                className="w-full px-3 py-2 border-2 border-black bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 rounded-none"
                placeholder="Enter GitHub URL"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-bold text-black mb-2">
                Bio
              </label>
              <textarea
                value={formData.bio || ''}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border-2 border-black bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 rounded-none resize-none"
                placeholder="Tell us about yourself..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-yellow-50 font-bold py-3 px-4 border-2 border-black rounded-none transition-all duration-200 flex items-center justify-center uppercase text-sm"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-yellow-50 border-t-transparent rounded-full animate-spin mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditModal; 