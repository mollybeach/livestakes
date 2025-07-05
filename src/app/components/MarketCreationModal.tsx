'use client';

import React, { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import {
  createMarket,
  getNetworkInfo,
  isContractDeployed,
  connectWallet,
  isWalletAvailable
} from '../lib/contractsApi';

interface MarketCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMarketCreated?: (marketAddress: string, marketData: any) => void;
}

interface MarketFormData {
  question: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  expiryDays: number;
}

const MarketCreationModal: React.FC<MarketCreationModalProps> = ({
  isOpen,
  onClose,
  onMarketCreated
}) => {
  const { authenticated, user } = usePrivy();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [walletAddress, setWalletAddress] = useState<string>('');
  
  const [formData, setFormData] = useState<MarketFormData>({
    question: '',
    title: '',
    description: '',
    category: 'general',
    tags: [],
    expiryDays: 7
  });

  const [newTag, setNewTag] = useState('');

  // Load wallet info on open
  useEffect(() => {
    if (isOpen && authenticated && user?.wallet?.address) {
      setWalletAddress(user.wallet.address);
    }
  }, [isOpen, authenticated, user]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const handleConnectWallet = async () => {
    try {
      const address = await connectWallet();
      setWalletAddress(address);
      setError('');
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setError('Failed to connect wallet. Please install MetaMask.');
    }
  };

  const handleInputChange = (field: keyof MarketFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = (): string | null => {
    if (!formData.question.trim()) return 'Question is required';
    if (!formData.title.trim()) return 'Title is required';
    if (formData.question.length < 10) return 'Question must be at least 10 characters';
    if (formData.title.length < 5) return 'Title must be at least 5 characters';
    if (formData.expiryDays < 1 || formData.expiryDays > 365) return 'Expiry must be between 1 and 365 days';
    return null;
  };

  const handleCreateMarket = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!walletAddress) {
      setError('Please connect your wallet');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Create market on blockchain using a temporary livestream ID (0)
      // We'll create a proper system for this later
      const marketAddress = await createMarket(
        0, // Temporary livestream ID for standalone markets
        formData.question,
        formData.title
      );

      setSuccess(`Market created successfully! Address: ${marketAddress}`);
      
      // Call the callback if provided
      if (onMarketCreated) {
        onMarketCreated(marketAddress, {
          question: formData.question,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          tags: formData.tags,
          expiryDays: formData.expiryDays,
          creator: walletAddress
        });
      }

      // Reset form
      setFormData({
        question: '',
        title: '',
        description: '',
        category: 'general',
        tags: [],
        expiryDays: 7
      });

      // Close modal after a delay
      setTimeout(() => {
        onClose();
        setSuccess('');
      }, 3000);

    } catch (err) {
      console.error('Error creating market:', err);
      setError('Failed to create market. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      question: '',
      title: '',
      description: '',
      category: 'general',
      tags: [],
      expiryDays: 7
    });
    setError('');
    setSuccess('');
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Create Betting Market
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Network Info */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-blue-900">
                {getNetworkInfo().networkName}
              </span>
            </div>
            <p className="text-xs text-blue-700">
              Markets will be deployed to: Chain ID {getNetworkInfo().chainId}
            </p>
          </div>

          {/* Contract Deployment Check */}
          {!isContractDeployed() && (
            <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm text-orange-700 font-medium mb-1">
                ⚠️ Contracts not deployed
              </p>
              <p className="text-xs text-orange-600">
                Smart contracts are not deployed on {getNetworkInfo().networkName}. 
                Please deploy contracts first.
              </p>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Success Display */}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-600">{success}</p>
            </div>
          )}

          {/* Wallet Connection */}
          {!authenticated || !walletAddress ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">Connect your wallet to create markets</p>
              <button
                onClick={handleConnectWallet}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Connect Wallet
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Market Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Market Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., Epic Gaming Tournament Predictions"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  maxLength={100}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.title.length}/100 characters
                </p>
              </div>

              {/* Market Question */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Market Question *
                </label>
                <textarea
                  value={formData.question}
                  onChange={(e) => handleInputChange('question', e.target.value)}
                  placeholder="e.g., Will the streamer reach 10,000 viewers during this session?"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={3}
                  maxLength={300}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.question.length}/300 characters
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Additional context or rules for this market..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={2}
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.description.length}/500 characters
                </p>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="general">General</option>
                  <option value="gaming">Gaming</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="education">Education</option>
                  <option value="music">Music</option>
                  <option value="sports">Sports</option>
                  <option value="technology">Technology</option>
                  <option value="art">Art & Creative</option>
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag..."
                    className="flex-1 p-2 border border-gray-300 rounded-lg text-sm"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                  />
                  <button
                    onClick={addTag}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="text-purple-500 hover:text-purple-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Expiry */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Market Duration (days)
                </label>
                <input
                  type="number"
                  value={formData.expiryDays}
                  onChange={(e) => handleInputChange('expiryDays', parseInt(e.target.value) || 1)}
                  min="1"
                  max="365"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Market will be available for betting for this many days
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleCreateMarket}
                  disabled={isLoading || !isContractDeployed()}
                  className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Creating Market...' : 'Create Market'}
                </button>
                <button
                  onClick={resetForm}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium"
                >
                  Reset
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-gray-500 text-white hover:bg-gray-600 rounded-lg font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketCreationModal; 