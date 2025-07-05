// Cloudinary Configuration and Permissions
// This file handles Cloudinary image permissions and configuration

export const CLOUDINARY_CONFIG = {
  // Cloudinary cloud name
  cloudName: 'storagemanagementcontainer',
  
  // Base URL for Cloudinary transformations
  baseUrl: 'https://res.cloudinary.com/storagemanagementcontainer/image/upload',
  
  // Default transformations
  defaultTransformations: {
    quality: 'auto',
    format: 'auto',
    fetch_format: 'auto'
  },
  
  // Permissions for using Cloudinary images
  permissions: {
    // Allow public access to images
    publicAccess: true,
    
    // Allowed domains for image usage
    allowedDomains: [
      'localhost',
      '127.0.0.1',
      'livestakes.fun',
      '*.vercel.app',
      '*.netlify.app'
    ],
    
    // Image formats allowed
    allowedFormats: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'],
    
    // Maximum file size (in bytes)
    maxFileSize: 10 * 1024 * 1024, // 10MB
  }
};

// Helper function to build Cloudinary URLs with transformations
export const buildCloudinaryUrl = (
  publicId: string,
  transformations: Record<string, any> = {}
) => {
  const baseUrl = CLOUDINARY_CONFIG.baseUrl;
  const defaultTransforms = CLOUDINARY_CONFIG.defaultTransformations;
  const allTransforms = { ...defaultTransforms, ...transformations };
  
  const transformString = Object.entries(allTransforms)
    .map(([key, value]) => `${key}_${value}`)
    .join(',');
  
  return `${baseUrl}/${transformString}/${publicId}`;
};

// Helper function to get the LiveStakes logo URL
export const getLiveStakesLogoUrl = (transformations: Record<string, any> = {}) => {
  return buildCloudinaryUrl('v1751729735/live-stakes-icon_cfc7t8', transformations);
};

// Permission check function
export const checkCloudinaryPermission = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    const isCloudinary = urlObj.hostname.includes('cloudinary.com');
    const isAllowedDomain = CLOUDINARY_CONFIG.permissions.allowedDomains.some(domain => {
      if (domain.startsWith('*.')) {
        return urlObj.hostname.endsWith(domain.slice(2));
      }
      return urlObj.hostname === domain;
    });
    
    return isCloudinary && isAllowedDomain;
  } catch {
    return false;
  }
};

// Export the logo URL for easy access
export const LIVE_STAKES_LOGO_URL = 'https://res.cloudinary.com/storagemanagementcontainer/image/upload/v1751729735/live-stakes-icon_cfc7t8.png'; 