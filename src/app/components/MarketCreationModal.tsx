'use client';

import React, { useState } from 'react';
import { createMarketWithMetadata, testContractConnection } from '../lib/contractsApi';
import { usePrivy } from '@privy-io/react-auth';

interface MarketCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMarketCreated?: (marketAddress: string) => void;
}

interface FormData {
  question: string;
  title: string;
  description: string;
  category: string;
  tags: string;
}

interface FormErrors {
  question?: string;
  title?: string;
  description?: string;
  category?: string;
  tags?: string;
}

const CATEGORIES = [
  'general',
  'gaming',
  'sports',
  'technology',
  'entertainment',
  'education',
  'business',
  'lifestyle',
  'music',
  'art'
];

export default function MarketCreationModal({ 
  isOpen, 
  onClose, 
  onMarketCreated 
}: MarketCreationModalProps) {
  const { authenticated } = usePrivy();
  const [formData, setFormData] = useState<FormData>({
    question: '',
    title: '',
    description: '',
    category: 'general',
    tags: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionTest, setConnectionTest] = useState<any>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.question.trim()) {
      newErrors.question = 'Question is required';
    } else if (formData.question.length < 10) {
      newErrors.question = 'Question must be at least 10 characters long';
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters long';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    if (formData.tags) {
      const tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      if (tags.length > 10) {
        newErrors.tags = 'Maximum 10 tags allowed';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    try {
      const result = await testContractConnection();
      setConnectionTest(result);
      console.log('Contract connection test:', result);
    } catch (error) {
      console.error('Connection test failed:', error);
      setConnectionTest({ isConnected: false, error: String(error) });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!authenticated) {
      alert('Please connect your wallet first');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Parse tags
      const tags = formData.tags 
        ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        : [];

      console.log('Creating market with data:', formData);
      
      const marketAddress = await createMarketWithMetadata(
        null, // No livestream association initially
        formData.question,
        formData.title,
        formData.description,
        formData.category,
        tags
      );

      console.log('Market created successfully:', marketAddress);
      
      // Reset form
      setFormData({
        question: '',
        title: '',
        description: '',
        category: 'general',
        tags: ''
      });
      
      // Call success callback
      if (onMarketCreated) {
        onMarketCreated(marketAddress);
      }
      
      // Close modal
      onClose();
      
      // Show success message
      alert(`Market created successfully!\nAddress: ${marketAddress}`);
      
    } catch (error) {
      console.error('Error creating market:', error);
      alert(`Error creating market: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  const handleEscapeKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && !isLoading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
      onKeyDown={handleEscapeKey}
      tabIndex={-1}
    >
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Create New Market</h2>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-white disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Connection Test Section */}
        <div className="mb-6 p-4 bg-gray-700 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-300">Contract Connection</h3>
            <button
              onClick={handleTestConnection}
              disabled={isTestingConnection}
              className="text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded disabled:opacity-50"
            >
              {isTestingConnection ? 'Testing...' : 'Test Connection'}
            </button>
          </div>
          
          {connectionTest && (
            <div className={`text-xs p-2 rounded ${
              connectionTest.isConnected 
                ? 'bg-green-600/20 text-green-400' 
                : 'bg-red-600/20 text-red-400'
            }`}>
              {connectionTest.isConnected ? (
                <div>
                  <div>✅ Connected to contract</div>
                  <div>Total Markets: {connectionTest.totalMarkets}</div>
                  <div>Owner: {connectionTest.owner?.slice(0, 10)}...</div>
                </div>
              ) : (
                <div>
                  <div>❌ Connection failed</div>
                  <div>{connectionTest.error}</div>
                </div>
              )}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Question Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Question *
            </label>
            <input
              type="text"
              name="question"
              value={formData.question}
              onChange={handleInputChange}
              placeholder="e.g., Will the presenter finish the demo without bugs?"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              disabled={isLoading}
            />
            {errors.question && (
              <p className="text-red-400 text-xs mt-1">{errors.question}</p>
            )}
          </div>

          {/* Title Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Bug-free Demo Prediction"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              disabled={isLoading}
            />
            {errors.title && (
              <p className="text-red-400 text-xs mt-1">{errors.title}</p>
            )}
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Additional details about the market..."
              rows={3}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              disabled={isLoading}
            />
            {errors.description && (
              <p className="text-red-400 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          {/* Category Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-500"
              disabled={isLoading}
            >
              {CATEGORIES.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Tags Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Tags
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="hackathon, demo, coding (comma separated)"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              disabled={isLoading}
            />
            {errors.tags && (
              <p className="text-red-400 text-xs mt-1">{errors.tags}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Separate tags with commas. Maximum 10 tags.
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !authenticated}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating...' : 'Create Market'}
            </button>
          </div>

          {!authenticated && (
            <p className="text-yellow-400 text-sm text-center mt-2">
              Please connect your wallet to create markets
            </p>
          )}
        </form>
      </div>
    </div>
  );
} 