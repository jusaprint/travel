import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../services/supabaseService';
import MediaUploader from '../../components/MediaUploader';
import { storageService } from '../../services/StorageService';

// Media item component
const MediaItem = ({ item, onSelect, isSelected, onDelete, onCopyUrl, onEdit }) => {
  const isImage = item.mime_type?.startsWith('image/');
  const fileSize = (item.size / 1024 / 1024).toFixed(2); // Convert to MB

  return (
    <div 
      className={`relative group cursor-pointer border rounded-lg overflow-hidden ${
        isSelected ? 'ring-2 ring-[#690d89]' : 'hover:shadow-md'
      }`}
      onClick={() => onSelect(item)}
    >
      <div className="aspect-w-16 aspect-h-9 bg-gray-100">
        {isImage ? (
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
        
        {/* Overlay with actions */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex space-x-2">
            <button 
              className="p-2 bg-white rounded-full hover:bg-gray-100"
              onClick={(e) => {
                e.stopPropagation();
                onCopyUrl(item.url);
              }}
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </button>
            <button 
              className="p-2 bg-white rounded-full hover:bg-gray-100"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(item);
              }}
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button 
              className="p-2 bg-white rounded-full hover:bg-gray-100"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item.id, item.url);
              }}
            >
              <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Selected indicator */}
        {isSelected && (
          <div className="absolute top-2 right-2 z-20 bg-[#690d89] rounded-full p-1">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>
      
      <div className="p-2">
        <p className="text-sm font-medium text-gray-900 truncate">{item.filename}</p>
        <p className="text-xs text-gray-500">{fileSize} MB</p>
        <p className="text-xs text-gray-400">{item.metadata?.storage_provider || 'local'}</p>
      </div>
    </div>
  );
};

// Edit media modal
const EditMediaModal = ({ media, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    filename: media.filename,
    alt_text: media.alt_text || '',
    metadata: media.metadata || {}
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(media.id, formData);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl max-w-lg w-full"
      >
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium">Edit Media</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Filename</label>
              <input
                type="text"
                value={formData.filename}
                onChange={(e) => setFormData({ ...formData, filename: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#690d89] focus:ring-[#690d89]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Alt Text</label>
              <input
                type="text"
                value={formData.alt_text}
                onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#690d89] focus:ring-[#690d89]"
              />
              <p className="mt-1 text-xs text-gray-500">
                Describe the image for accessibility and SEO
              </p>
            </div>

            {/* Preview */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Preview</label>
              <div className="mt-1">
                {media.mime_type?.startsWith('image/') ? (
                  <img 
                    src={media.url} 
                    alt={formData.alt_text || media.filename} 
                    className="max-h-40 rounded-md"
                  />
                ) : (
                  <div className="h-40 bg-gray-100 rounded-md flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Storage Provider Info */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Storage Provider</label>
              <div className="mt-1 p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-700">
                  {media.metadata?.storage_provider === 'netlify' ? 'Netlify Large Media' : 
                   media.metadata?.storage_provider === 'supabase' ? 'Supabase Storage' : 
                   'Local Storage'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Folder: {media.metadata?.folder || 'uploads'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#690d89] hover:bg-[#8B5CF6]"
            >
              Save Changes
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// URL Copy Modal component
const URLCopyModal = ({ url, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl p-6 max-w-lg w-full shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Media URL</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={url}
            readOnly
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#690d89] focus:border-[#690d89] text-sm"
          />
          <button
            onClick={handleCopy}
            className={`px-4 py-2 rounded-lg text-white font-medium transition-colors ${
              copied 
                ? 'bg-green-500' 
                : 'bg-[#690d89] hover:bg-[#8B5CF6]'
            }`}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function MediaManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedItems, setSelectedItems] = useState([]);
  const [mediaItems, setMediaItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [selectedURL, setSelectedURL] = useState(null);
  const [editingMedia, setEditingMedia] = useState(null);
  const [uploadedMedia, setUploadedMedia] = useState(null);
  const [storageProvider, setStorageProvider] = useState('local');
  
  // Load media items
  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    try {
      setIsLoading(true);
      
      // First try to get files from local storage
      const localFiles = await storageService.getFiles();
      
      // Then try to get files from Supabase
      let supabaseFiles = [];
      try {
        const { data, error } = await supabase
          .from('cms_media')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (!error && data) {
          supabaseFiles = data;
        }
      } catch (e) {
        console.warn('Error loading from Supabase:', e);
      }
      
      // Combine and deduplicate files
      const combinedFiles = [...localFiles];
      
      // Add Supabase files that don't exist in local files
      for (const file of supabaseFiles) {
        if (!combinedFiles.some(f => f.url === file.url)) {
          combinedFiles.push(file);
        }
      }
      
      // Sort by creation date (newest first)
      combinedFiles.sort((a, b) => {
        const dateA = new Date(a.created_at || a.createdAt || 0);
        const dateB = new Date(b.created_at || b.createdAt || 0);
        return dateB - dateA;
      });
      
      setMediaItems(combinedFiles);
    } catch (error) {
      console.error('Error loading media:', error);
      setMessage({
        type: 'error',
        text: 'Failed to load media. Please try again.'
      });
      
      // Fallback to localStorage
      try {
        const existingFiles = JSON.parse(localStorage.getItem('kudosim_media_files') || '[]');
        setMediaItems(existingFiles);
      } catch (e) {
        console.error('Error loading from localStorage:', e);
        setMediaItems([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleItemSelection = (item) => {
    if (selectedItems.some(selected => selected.id === item.id)) {
      setSelectedItems(selectedItems.filter(selected => selected.id !== item.id));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const clearSelection = () => {
    setSelectedItems([]);
  };

  const handleDeleteMedia = async (id, url) => {
    const ids = Array.isArray(id) ? id : [id];
    const urls = Array.isArray(url) ? url : [url];
    
    if (window.confirm(`Are you sure you want to delete ${ids.length > 1 ? 'these items' : 'this item'}? This action cannot be undone.`)) {
      try {
        // For each item, try to delete from storage first
        for (let i = 0; i < ids.length; i++) {
          try {
            // Try to delete from storage service first
            if (urls[i]) {
              await storageService.deleteFile(urls[i]);
            } else {
              // If no URL, just delete the database record
              await supabase
                .from('cms_media')
                .delete()
                .eq('id', ids[i]);
            }
          } catch (error) {
            console.error(`Error deleting file ${ids[i]}:`, error);
            // Continue with other deletions even if one fails
          }
        }
        
        // Update the UI
        setMediaItems(mediaItems.filter(item => !ids.includes(item.id)));
        setSelectedItems(selectedItems.filter(item => !ids.includes(item.id)));
        
        setMessage({ 
          type: 'success', 
          text: `Successfully deleted ${ids.length > 1 ? `${ids.length} items` : '1 item'}.` 
        });
      } catch (error) {
        console.error('Error deleting media:', error);
        setMessage({ type: 'error', text: 'Failed to delete media. Please try again.' });
      }
    }
  };

  const handleUpdateMedia = async (id, formData) => {
    try {
      // First try to update in Supabase
      try {
        const { error } = await supabase
          .from('cms_media')
          .update({
            filename: formData.filename,
            alt_text: formData.alt_text,
            metadata: formData.metadata
          })
          .eq('id', id);
  
        if (error) throw error;
      } catch (e) {
        console.warn('Error updating in Supabase:', e);
      }

      // Then update in localStorage
      const existingFiles = JSON.parse(localStorage.getItem('kudosim_media_files') || '[]');
      const updatedFiles = existingFiles.map(file => 
        file.id === id ? { ...file, ...formData } : file
      );
      localStorage.setItem('kudosim_media_files', JSON.stringify(updatedFiles));

      // Update local state
      setMediaItems(mediaItems.map(item => 
        item.id === id ? { ...item, ...formData } : item
      ));
      
      setEditingMedia(null);
      setMessage({ 
        type: 'success', 
        text: 'Media updated successfully.' 
      });
    } catch (error) {
      console.error('Error updating media:', error);
      setMessage({ 
        type: 'error', 
        text: 'Failed to update media. Please try again.' 
      });
    }
  };

  const handleUploadComplete = (url) => {
    setUploadedMedia(url);
    
    // Add the new file to the media items list
    const newFile = {
      id: `upload-${Date.now()}`,
      filename: url.split('/').pop(),
      url: url,
      mime_type: url.includes('.') ? `image/${url.split('.').pop()}` : 'image/jpeg',
      size: 0,
      created_at: new Date().toISOString(),
      metadata: {
        storage_provider: 'local',
        folder: 'uploads'
      }
    };
    
    setMediaItems([newFile, ...mediaItems]);
    
    setMessage({ 
      type: 'success', 
      text: 'Media uploaded successfully.' 
    });
    
    // Reload media list after a short delay
    setTimeout(() => {
      loadMedia();
    }, 1000);
  };

  // Filter media items based on search term and type filter
  const filteredItems = mediaItems.filter(item => {
    const matchesSearch = !searchTerm || (
      (item.filename && item.filename.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.alt_text && item.alt_text.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    const matchesType = typeFilter === 'all' || (item.mime_type && item.mime_type.startsWith(typeFilter));
    return matchesSearch && matchesType;
  });

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Media Manager</h1>
          <p className="mt-1 text-sm text-gray-500">
            Upload, browse, and manage your media files
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-4">
          <Link
            to="/admin/media/upload"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#690d89] hover:bg-[#8B5CF6]"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Upload Media
          </Link>
        </div>
      </div>

      {/* Message display */}
      {message.text && (
        <div className={`mt-4 p-4 rounded-md ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          <div className="flex">
            <div className="flex-shrink-0">
              {message.type === 'success' ? (
                <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm">{message.text}</p>
            </div>
          </div>
        </div>
      )}

      {/* Storage Provider Selection */}
      <div className="mt-6 bg-white rounded-xl p-6 shadow-lg">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Storage Provider</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <input
              id="local"
              name="storage-provider"
              type="radio"
              checked={storageProvider === 'local'}
              onChange={() => setStorageProvider('local')}
              className="h-4 w-4 text-[#690d89] focus:ring-[#690d89] border-gray-300"
            />
            <label htmlFor="local" className="ml-2 block text-sm font-medium text-gray-700">
              Local Storage (Browser)
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="netlify"
              name="storage-provider"
              type="radio"
              checked={storageProvider === 'netlify'}
              onChange={() => setStorageProvider('netlify')}
              className="h-4 w-4 text-[#690d89] focus:ring-[#690d89] border-gray-300"
            />
            <label htmlFor="netlify" className="ml-2 block text-sm font-medium text-gray-700">
              Netlify Large Media
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="supabase"
              name="storage-provider"
              type="radio"
              checked={storageProvider === 'supabase'}
              onChange={() => setStorageProvider('supabase')}
              className="h-4 w-4 text-[#690d89] focus:ring-[#690d89] border-gray-300"
            />
            <label htmlFor="supabase" className="ml-2 block text-sm font-medium text-gray-700">
              Supabase Storage
            </label>
          </div>
        </div>
      </div>

      {/* Quick Upload */}
      <div className="mt-6 bg-white rounded-xl p-6 shadow-lg">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Upload</h2>
        <MediaUploader
          currentImage={uploadedMedia}
          onImageChange={handleUploadComplete}
          folder="uploads"
          label="Upload New Media"
          storageProvider={storageProvider}
        />
      </div>

      {/* Filters */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700">
            Search
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              name="search"
              id="search"
              className="focus:ring-[#690d89] focus:border-[#690d89] block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              placeholder="Search files"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Type
          </label>
          <select
            id="type"
            name="type"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#690d89] focus:border-[#690d89] sm:text-sm rounded-md"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="image/">Images</option>
            <option value="application/">Documents</option>
            <option value="video/">Videos</option>
          </select>
        </div>
      </div>

      {/* Selection Actions */}
      {selectedItems.length > 0 && (
        <div className="mt-4 bg-gray-50 p-4 rounded-lg flex items-center justify-between">
          <div className="text-sm text-gray-700">
            <span className="font-medium">{selectedItems.length}</span> items selected
          </div>
          <div className="flex space-x-2">
            <button
              type="button"
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#690d89]"
              onClick={clearSelection}
            >
              Clear Selection
            </button>
            <button
              type="button"
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              onClick={() => handleDeleteMedia(
                selectedItems.map(item => item.id),
                selectedItems.map(item => item.url)
              )}
            >
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="mt-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#690d89]"></div>
        </div>
      ) : (
        <>
          {/* Media Grid */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredItems.map((item) => (
              <MediaItem
                key={item.id || item.url}
                item={item}
                onSelect={toggleItemSelection}
                isSelected={selectedItems.some(selected => selected.id === item.id)}
                onDelete={handleDeleteMedia}
                onCopyUrl={(url) => setSelectedURL(url)}
                onEdit={(media) => setEditingMedia(media)}
              />
            ))}
          </div>

          {/* Empty State */}
          {filteredItems.length === 0 && (
            <div className="mt-8 text-center py-12 bg-gray-50 rounded-lg">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No media found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || typeFilter !== 'all' ? 'Try adjusting your search or filters.' : 'Get started by uploading a file.'}
              </p>
              {!searchTerm && typeFilter === 'all' && (
                <div className="mt-6">
                  <Link
                    to="/admin/media/upload"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#690d89] hover:bg-[#8B5CF6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#690d89]"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Upload Media
                  </Link>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* URL Copy Modal */}
      {selectedURL && (
        <URLCopyModal 
          url={selectedURL} 
          onClose={() => setSelectedURL(null)} 
        />
      )}

      {/* Edit Media Modal */}
      {editingMedia && (
        <EditMediaModal
          media={editingMedia}
          onClose={() => setEditingMedia(null)}
          onSave={handleUpdateMedia}
        />
      )}
    </div>
  );
}