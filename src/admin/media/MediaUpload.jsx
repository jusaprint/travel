import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { storageService } from '../../services/StorageService';

export default function MediaUpload() {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });
  const [storageProvider, setStorageProvider] = useState('local');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    addFiles(selectedFiles);
  };

  const addFiles = (selectedFiles) => {
    const newFiles = selectedFiles.map(file => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
      progress: 0,
      status: 'pending' // pending, uploading, success, error
    }));

    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      addFiles(droppedFiles);
    }
  };

  const removeFile = (id) => {
    setFiles(files.filter(file => file.id !== id));
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;
    
    setIsUploading(true);
    setMessage({ type: '', text: '' });
    
    try {
      // Process each file
      for (const fileItem of files) {
        try {
          // Skip already processed files
          if (fileItem.status === 'success') continue;
          
          // Update file status
          setFiles(prev => 
            prev.map(f => 
              f.id === fileItem.id 
                ? { ...f, status: 'uploading' } 
                : f
            )
          );
          
          // Update progress to show upload started
          setUploadProgress(prev => ({
            ...prev,
            [fileItem.id]: 10
          }));
          
          // Upload the file using the storage service
          const fileUrl = await storageService.uploadFile(fileItem.file, {
            folder: 'uploads',
            storageType: storageProvider, // Pass the selected storage provider
            onProgress: (percent) => {
              setUploadProgress(prev => ({
                ...prev,
                [fileItem.id]: percent
              }));
            }
          });
          
          // Update progress to 100%
          setUploadProgress(prev => ({
            ...prev,
            [fileItem.id]: 100
          }));
          
          // Update file status
          setFiles(prev => 
            prev.map(f => 
              f.id === fileItem.id 
                ? { ...f, status: 'success', url: fileUrl } 
                : f
            )
          );
        } catch (error) {
          console.error(`Error uploading file ${fileItem.file.name}:`, error);
          
          // Update file status to error
          setFiles(prev => 
            prev.map(f => 
              f.id === fileItem.id 
                ? { ...f, status: 'error', error: error.message } 
                : f
            )
          );
          
          setMessage({ 
            type: 'error', 
            text: `Failed to upload ${fileItem.file.name}. ${error.message}` 
          });
        }
      }
      
      // Check if all files were uploaded successfully
      const allSuccess = files.every(file => file.status === 'success');
      
      if (allSuccess) {
        setMessage({ 
          type: 'success', 
          text: `Successfully uploaded ${files.length} file${files.length > 1 ? 's' : ''}.` 
        });
        
        // Navigate back to media library after a short delay
        setTimeout(() => {
          navigate('/admin/media');
        }, 1500);
      } else {
        const successCount = files.filter(file => file.status === 'success').length;
        const errorCount = files.filter(file => file.status === 'error').length;
        
        setMessage({ 
          type: 'warning', 
          text: `Uploaded ${successCount} file${successCount !== 1 ? 's' : ''} successfully. ${errorCount} file${errorCount !== 1 ? 's' : ''} failed.` 
        });
      }
    } catch (error) {
      console.error('Error during upload process:', error);
      setMessage({ 
        type: 'error', 
        text: 'An error occurred during the upload process. Please try again.' 
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Upload Media</h1>
          <p className="mt-1 text-sm text-gray-500">
            Add images and files to your media library
          </p>
        </div>
        <Link
          to="/admin/media"
          className="inline-flex items-center px-4 py-2 mt-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 sm:mt-0"
        >
          Back to Library
        </Link>
      </div>

      {/* Message display */}
      {message.text && (
        <div className={`mt-4 p-4 rounded-md ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 
          message.type === 'warning' ? 'bg-yellow-50 text-yellow-800' :
          'bg-red-50 text-red-800'
        }`}>
          <div className="flex">
            <div className="flex-shrink-0">
              {message.type === 'success' ? (
                <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : message.type === 'warning' ? (
                <svg className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
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
        
        {storageProvider === 'local' && (
          <div className="mt-4 bg-yellow-50 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Local Storage Notice</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    Files will be stored in your browser's local storage. These files will:
                  </p>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>Only be available on this device and browser</li>
                    <li>Be lost if you clear your browser data</li>
                    <li>Not be accessible to other users</li>
                  </ul>
                  <p className="mt-2">
                    This is recommended for development and testing only.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Upload Area */}
      <div className="mt-6">
        <div
          className={`border-2 border-dashed rounded-lg p-12 text-center ${
            isDragging ? 'border-[#690d89] bg-[#690d89]/5' : 'border-gray-300 hover:border-[#690d89]/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            multiple
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          <p className="mt-2 text-sm font-medium text-gray-900">
            Drag and drop files here, or click to browse
          </p>
          <p className="mt-1 text-xs text-gray-500">
            PNG, JPG, GIF, PDF up to 10MB
          </p>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900">Selected Files</h2>
          <ul className="mt-3 divide-y divide-gray-200">
            {files.map((file) => (
              <li key={file.id} className="py-4 flex items-center">
                <div className="flex-shrink-0 h-16 w-16 rounded-md overflow-hidden bg-gray-100">
                  {file.preview ? (
                    <img src={file.preview} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{file.file.name}</h3>
                      <p className="text-sm text-gray-500">{(file.file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    {!isUploading && file.status !== 'success' && (
                      <button
                        type="button"
                        onClick={() => removeFile(file.id)}
                        className="ml-4 text-sm font-medium text-red-600 hover:text-red-500"
                      >
                        Remove
                      </button>
                    )}
                    {file.status === 'success' && (
                      <span className="ml-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Uploaded
                      </span>
                    )}
                    {file.status === 'error' && (
                      <span className="ml-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Failed
                      </span>
                    )}
                  </div>
                  
                  {(isUploading || file.status === 'success') && (
                    <div className="mt-2">
                      <div className="bg-gray-200 rounded-full h-2.5 w-full">
                        <div 
                          className={`h-2.5 rounded-full ${file.status === 'error' ? 'bg-red-600' : 'bg-[#690d89]'}`}
                          style={{ width: `${uploadProgress[file.id] || 0}%` }}
                        ></div>
                      </div>
                      <p className="mt-1 text-xs text-gray-500 text-right">
                        {file.status === 'error' ? 'Error' : `${uploadProgress[file.id] || 0}%`}
                      </p>
                    </div>
                  )}
                  
                  {file.status === 'error' && (
                    <p className="mt-1 text-xs text-red-600">{file.error}</p>
                  )}
                  
                  {file.status === 'success' && file.url && (
                    <div className="mt-2 flex items-center">
                      <input
                        type="text"
                        value={file.url}
                        readOnly
                        className="flex-1 text-xs border-gray-300 rounded-md focus:ring-[#690d89] focus:border-[#690d89]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(file.url);
                        }}
                        className="ml-2 inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-[#690d89] bg-[#690d89]/10 hover:bg-[#690d89]/20"
                      >
                        Copy
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
          
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => setFiles([])}
              disabled={isUploading}
              className="mr-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#690d89] disabled:opacity-50"
            >
              Clear All
            </button>
            <button
              type="button"
              onClick={uploadFiles}
              disabled={isUploading || files.length === 0 || files.every(f => f.status === 'success')}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#690d89] hover:bg-[#8B5CF6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#690d89] disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </>
              ) : (
                'Upload Files'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}