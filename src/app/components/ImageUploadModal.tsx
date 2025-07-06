'use client';

import React, { useState, useRef } from 'react';
import { X, Upload, Image as ImageIcon, Save, Trash2 } from 'lucide-react';

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentImageUrl?: string;
  onImageUpload: (imageUrl: string) => Promise<void>;
}

const ImageUploadModal: React.FC<ImageUploadModalProps> = ({
  isOpen,
  onClose,
  currentImageUrl,
  onImageUpload
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }

      setSelectedFile(file);
      setError(null);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // For now, we'll use a mock upload to Cloudinary
      // In a real implementation, you would upload to your server or directly to Cloudinary
      const mockImageUrl = `https://res.cloudinary.com/storagemanagementcontainer/image/upload/v1751747169/uploaded-${Date.now()}.jpg`;
      
      await onImageUpload(mockImageUrl);
      setSuccess('Image uploaded successfully! 🎉');
      
      setTimeout(() => {
        onClose();
        // Reset state
        setSelectedFile(null);
        setPreviewUrl(null);
        setSuccess(null);
      }, 2000);
    } catch (error) {
      setError('Failed to upload image. Please try again.');
      console.error('Image upload error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      // Reset state
      setSelectedFile(null);
      setPreviewUrl(null);
      setError(null);
      setSuccess(null);
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
              <ImageIcon size={20} />
              Upload Profile Image
            </h2>
            <button
              onClick={handleClose}
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

          {/* Current Image Preview */}
          {currentImageUrl && (
            <div className="text-center">
              <p className="text-sm font-bold text-black mb-2">Current Image:</p>
              <img 
                src={currentImageUrl} 
                alt="Current profile" 
                className="w-20 h-20 rounded-full border-4 border-black mx-auto"
              />
            </div>
          )}

          {/* File Upload Area */}
          <div className="border-2 border-dashed border-black bg-white p-6 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              disabled={isLoading}
            />
            
            {!previewUrl ? (
              <div className="space-y-3">
                <Upload size={48} className="mx-auto text-purple-600" />
                <div>
                  <p className="text-sm font-bold text-black mb-1">
                    Click to select an image
                  </p>
                  <p className="text-xs text-purple-600">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                  className="bg-purple-600 hover:bg-purple-700 text-yellow-50 px-4 py-2 border-2 border-black rounded-none font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Choose File
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="w-32 h-32 rounded-full border-4 border-black mx-auto object-cover"
                />
                <div>
                  <p className="text-sm font-bold text-black">
                    {selectedFile?.name}
                  </p>
                  <p className="text-xs text-purple-600">
                    {selectedFile?.size ? (selectedFile.size / 1024 / 1024).toFixed(2) : '0'} MB
                  </p>
                </div>
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-yellow-50 px-3 py-1 border-2 border-black rounded-none font-bold text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Change
                  </button>
                  <button
                    onClick={handleRemoveImage}
                    disabled={isLoading}
                    className="bg-red-600 hover:bg-red-700 text-yellow-50 px-3 py-1 border-2 border-black rounded-none font-bold text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    <Trash2 size={12} />
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Upload Button */}
          {selectedFile && (
            <button
              onClick={handleUpload}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-yellow-50 font-bold py-3 px-4 border-2 border-black rounded-none transition-all duration-200 flex items-center justify-center uppercase text-sm"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-yellow-50 border-t-transparent rounded-full animate-spin mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  Upload Image
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUploadModal; 