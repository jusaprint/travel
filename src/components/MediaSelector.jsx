import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/cms';
import { storageService } from '../services/StorageService';

/**
 * Media selector component for choosing from existing media library
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onSelect - Callback when media is selected
 * @param {string} props.selectedUrl - Currently selected media URL
 * @param {string} props.type - Media type filter (e.g., "image", "video")
 * @returns {JSX.Element} - Rendered component
 */
const MediaSelector = ({ onSelect, selectedUrl, type = "image" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadingFile, setUploadingFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const modalRef = useRef(null);
  const fileInputRef = useRef(null);

  // Load media when modal opens
  useEffect(() => {
    if (isOpen) {
      loadMedia();
    }
  }, [isOpen]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const loadMedia = async () => {
    try {
      setLoading(true);
      
      // Try to get files from storage service
      const files = await storageService.getFiles({
        type: type
      });
      
      setMedia(files || []);
    } catch (error) {
      console.error('Error loading media:', error);
      
      // Fallback to localStorage
      try {
        const localFiles = JSON.parse(localStorage.getItem('kudosim_media_files') || '[]');
        let filteredFiles = localFiles;
        
        if (type) {
          filteredFiles = filteredFiles.filter(file => file.mime_type?.startsWith(type));
        }
        
        setMedia(filteredFiles);
      } catch (e) {
        console.error('Error loading from localStorage:', e);
        setMedia([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle file upload directly from the selector
  const handleFileUpload = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;
      
      // Validate file type
      if (type && !file.type.startsWith(type)) {
        alert(`Please upload a ${type} file`);
        return;
      }
      
      setUploadingFile(file);
      setUploadProgress(0);
      
      // Upload the file using the storage service
      const fileUrl = await storageService.uploadFile(file, {
        folder: 'uploads',
        onProgress: (percent) => {
          setUploadProgress(percent);
        }
      });
      
      // Call the callback with the new URL
      onSelect(fileUrl);
      setIsOpen(false);
      
      // Refresh the media list
      loadMedia();
    } catch (error) {
      console.error('Error uploading file:', error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setUploadingFile(null);
    }
  };

  // Filter media based on search term
  const filteredMedia = media.filter(item => 
    item.filename?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.alt_text && item.alt_text.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="relative">
      {/* Selected image preview or button */}
      <div 
        onClick={() => setIsOpen(true)}
        className="cursor-pointer"
      >
        {selectedUrl ? (
          <div className="relative group">
            <img 
              src={selectedUrl} 
              alt="Selected media" 
              className="w-32 h-24 object-cover rounded-lg border-2 border-[#690d89]/20 hover:border-[#690d89]"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
              <span className="text-white text-sm font-medium">Change</span>
            </div>
          </div>
        ) : (
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Select from Media Library
          </button>
        )}
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[80vh] flex flex-col"
          >
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-medium">Select Media</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Search and Upload */}
            <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search media..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#690d89] focus:border-[#690d89]"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileUpload}
                  accept={type ? `${type}/*` : undefined}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={!!uploadingFile}
                  className="w-full sm:w-auto px-4 py-2 bg-[#690d89] text-white rounded-md hover:bg-[#8B5CF6] disabled:opacity-50 flex items-center"
                >
                  {uploadingFile ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {uploadProgress}%
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      Upload New
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Media Grid */}
            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#690d89]"></div>
                </div>
              ) : filteredMedia.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {filteredMedia.map((item) => (
                    <div
                      key={item.id || item.url}
                      onClick={() => {
                        onSelect(item.url);
                        setIsOpen(false);
                      }}
                      className={`cursor-pointer group relative border rounded-lg overflow-hidden ${
                        selectedUrl === item.url ? 'ring-2 ring-[#690d89]' : 'hover:shadow-md'
                      }`}
                    >
                      <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                        {item.mime_type?.startsWith('image/') ? (
                          <img 
                            src={item.url} 
                            alt={item.alt_text || item.filename} 
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full bg-gray-200">
                            <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                        )}
                        
                        {/* Overlay with info */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                          <p className="text-white text-xs truncate">{item.filename}</p>
                          <p className="text-white/70 text-xs">{formatFileSize(item.size)}</p>
                          <p className="text-white/50 text-xs">{item.metadata?.storage_provider || 'local'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No media found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm ? 'Try adjusting your search terms.' : 'Upload some media files first.'}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 flex justify-between">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  window.open('/admin/media/upload', '_blank');
                }}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#690d89] hover:bg-[#8B5CF6]"
              >
                Upload New
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MediaSelector;