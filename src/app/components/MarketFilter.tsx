'use client';

import React, { useState, useEffect } from 'react';
import { fetchAvailableTags, fetchAvailableCategories } from '../lib/contractsApi';

interface MarketFilterProps {
  onFilterChange: (filters: {
    category?: string;
    tags?: string[];
    search?: string;
  }) => void;
  selectedCategory?: string;
  selectedTags?: string[];
  searchTerm?: string;
}

export default function MarketFilter({ 
  onFilterChange, 
  selectedCategory, 
  selectedTags = [], 
  searchTerm = '' 
}: MarketFilterProps) {
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  // Load available tags and categories
  useEffect(() => {
    const loadFilterOptions = async () => {
      setIsLoading(true);
      try {
        const [tags, categories] = await Promise.all([
          fetchAvailableTags(),
          fetchAvailableCategories()
        ]);
        setAvailableTags(tags);
        setAvailableCategories(categories);
      } catch (error) {
        console.error('Error loading filter options:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFilterOptions();
  }, []);

  const handleCategoryChange = (category: string) => {
    const newCategory = category === selectedCategory ? undefined : category;
    onFilterChange({
      category: newCategory,
      tags: selectedTags,
      search: localSearchTerm
    });
  };

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    
    onFilterChange({
      category: selectedCategory,
      tags: newTags,
      search: localSearchTerm
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({
      category: selectedCategory,
      tags: selectedTags,
      search: localSearchTerm
    });
  };

  const clearAllFilters = () => {
    setLocalSearchTerm('');
    onFilterChange({
      category: undefined,
      tags: [],
      search: ''
    });
  };

  const hasActiveFilters = selectedCategory || selectedTags.length > 0 || localSearchTerm;

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-24 mb-4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-700 rounded w-32"></div>
            <div className="h-3 bg-gray-700 rounded w-40"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Search */}
        <div className="flex-1">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={localSearchTerm}
              onChange={handleSearchChange}
              placeholder="Search markets..."
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="absolute right-2 top-2 p-1 text-gray-400 hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
        </div>

        {/* Categories */}
        {availableCategories.length > 0 && (
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {availableCategories.map(category => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {availableTags.length > 0 && (
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
              {availableTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>Active filters:</span>
              {selectedCategory && (
                <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
                  {selectedCategory}
                </span>
              )}
              {selectedTags.map(tag => (
                <span key={tag} className="bg-purple-600 text-white px-2 py-1 rounded text-xs">
                  {tag}
                </span>
              ))}
              {localSearchTerm && (
                <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">
                  "{localSearchTerm}"
                </span>
              )}
            </div>
            <button
              onClick={clearAllFilters}
              className="text-red-400 hover:text-red-300 text-sm font-medium"
            >
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 