import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { storageService } from '../services/StorageService';

/**
 * Reusable component for uploading images to storage
 * 
 * @param {Object} props - Component props
 * @param {string} props.currentImage - Current image URL
 * @param {Function} props.onImageChange - Callback when image changes
 * @param {string} props.folder - Storage folder path (default: "images")
 * @param {string} props.label - Input label (default: "Image")
 * @param {string} props.className - Additional CSS classes
 * @param {number} props.maxSize - Maximum file size in MB (default: 5)
 * @param {string} props.previewSize - Size of the preview (default: "w-32 h-24")
 * @param {string} props.storageProvider - Storage provider to use (default: "local")
 * @returns {JSX.Element} - Rendered component
 */
const MediaUploader = ({ 
  currentImage, 
  onImageChange, 
  folder = "images", 
  label = "Image",
  className = "",
  maxSize = 5,
  previewSize = "w-32 h-24",
  storageProvider = "local"
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleFileChange = async (e) => {
    try {
      setUploading(true);
      setError(null);
      setProgress(0);
      
      const file = e.target.files[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload an image file');
      }

      // Validate file size (max 5MB by default)
      if (file.size > maxSize * 1024 * 1024) {
        throw new Error(`File size must be less than ${maxSize}MB`);
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;

      // Upload the file using the storage service
      const fileUrl = await storageService.uploadFile(file, {
        folder,
        fileName,
        storageType: storageProvider,
        onProgress: (percent) => {
          setProgress(percent);
        }
      });

      // Call the callback with the new URL
      onImageChange(fileUrl);
    } catch (err) {
      console.error('Error uploading image:', err);
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      
      <div className="flex items-center gap-4">
        {/* Current Image Preview */}
        {currentImage && (
          <div className={`relative ${previewSize} rounded-lg overflow-hidden`}>
            <img 
              src={currentImage} 
              alt="Preview" 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        {/* Upload Button */}
        <div className="flex-1">
          <label className="relative flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-lg hover:bg-gray-50 cursor-pointer">
            <div className="space-y-1 text-center">
              {uploading ? (
                <div className="flex flex-col items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                    <div 
                      className="bg-[#690d89] h-2.5 rounded-full transition-all duration-300" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-500">{progress}% Uploading...</span>
                </div>
              ) : (
                <>
                  <svg
                    className="w-8 h-8 mx-auto text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium text-[#690d89] hover:text-[#8B5CF6]">
                      Click to upload
                    </span>
                    <span> or drag and drop</span>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, SVG up to {maxSize}MB</p>
                </>
              )}
            </div>
            <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileChange}
              accept="image/*"
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default MediaUploader;