import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../services/supabaseService';

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

// Media item component
const MediaItem = ({ item, onSelect, isSelected, onShowURL }) => {
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
                onShowURL(item.url);
              }}
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </button>
            <button className="p-2 bg-white rounded-full hover:bg-gray-100">
              <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            <button className="p-2 bg-white rounded-full hover:bg-gray-100">
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
      </div>
    </div>
  );
};

export default function MediaLibrary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedItems, setSelectedItems] = useState([]);
  const [mediaItems, setMediaItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [selectedURL, setSelectedURL] = useState(null);
  
  // Load media items
  useEffect(() => {
    const loadMedia = async () => {
      try {
        const { data, error } = await supabase
          .from('cms_media')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setMediaItems(data || []);
      } catch (error) {
        console.error('Error loading media:', error);
        setMessage({
          type: 'error',
          text: 'Failed to load media. Please try again.'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMedia();
  }, []);

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

  const handleDeleteMedia = async (ids) => {
    if (window.confirm(`Are you sure you want to delete ${ids.length > 1 ? 'these items' : 'this item'}? This action cannot be undone.`)) {
      try {
        for (const id of ids) {
          await supabase
            .from('cms_media')
            .delete()
            .eq('id', id);
        }
        
        setMediaItems(mediaItems.filter(item => !ids.includes(item.id)));
        setSelectedItems([]);
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

  // Filter media items based on search term and type filter
  const filteredItems = mediaItems.filter(item => {
    const matchesSearch = !searchTerm || (item.filename && item.filename.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === 'all' || (item.mime_type && item.mime_type.startsWith(typeFilter));
    return matchesSearch && matchesType;
  });

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your images and files
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-4">
          <Link
            to="/admin/media/operator-logos"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-[#690d89] bg-[#690d89]/10 border border-transparent rounded-md hover:bg-[#690d89]/20"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Operator Logos
          </Link>
          <Link
            to="/admin/media/upload"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#690d89] border border-transparent rounded-md shadow-sm hover:bg-[#8B5CF6]"
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
              onClick={() => handleDeleteMedia(selectedItems.map(item => item.id))}
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
                key={item.id}
                item={item}
                onSelect={toggleItemSelection}
                isSelected={selectedItems.some(selected => selected.id === item.id)}
                onShowURL={(url) => setSelectedURL(url)}
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
    </div>
  );
}