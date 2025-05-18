import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../services/supabaseService';

export default function OperatorLogoUpload() {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });
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
      status: 'pending'
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
      for (const fileItem of files) {
        try {
          setUploadProgress(prev => ({
            ...prev,
            [fileItem.id]: 10
          }));
          
          const progressInterval = setInterval(() => {
            setUploadProgress(prev => {
              const currentProgress = prev[fileItem.id] || 0;
              if (currentProgress >= 90) {
                clearInterval(progressInterval);
                return prev;
              }
              return {
                ...prev,
                [fileItem.id]: Math.min(90, currentProgress + Math.floor(Math.random() * 10) + 5)
              };
            });
          }, 300);

          // Generate unique filename
          const fileExt = fileItem.file.name.split('.').pop();
          const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
          const filePath = `operator-logos/${fileName}`;

          // Upload to Supabase Storage
          const { error: uploadError, data } = await supabase.storage
            .from('media')
            .upload(filePath, fileItem.file);

          if (uploadError) throw uploadError;

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('media')
            .getPublicUrl(filePath);

          // Create media record
          const { error: dbError } = await supabase
            .from('cms_media')
            .insert([{
              filename: fileName,
              url: publicUrl,
              mime_type: fileItem.file.type,
              size: fileItem.file.size,
              alt_text: fileItem.file.name.split('.')[0],
              metadata: {
                type: 'operator_logo'
              }
            }]);

          if (dbError) throw dbError;
          
          clearInterval(progressInterval);
          setUploadProgress(prev => ({
            ...prev,
            [fileItem.id]: 100
          }));
        } catch (error) {
          console.error(`Error uploading file ${fileItem.file.name}:`, error);
          setMessage({ 
            type: 'error', 
            text: `Failed to upload ${fileItem.file.name}. Please try again.` 
          });
        }
      }
      
      setMessage({ 
        type: 'success', 
        text: `Successfully uploaded ${files.length} file${files.length > 1 ? 's' : ''}.` 
      });
      
      setTimeout(() => {
        navigate('/admin/media');
      }, 1500);
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
          <h1 className="text-2xl font-bold text-gray-900">Upload Operator Logos</h1>
          <p className="mt-1 text-sm text-gray-500">
            Add network operator logos to display in the carousel
          </p>
        </div>
      </div>

      {/* Message display */}
      {message.text && (
        <div className={`mt-4 p-4 rounded-md ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {/* Upload Area */}
      <div className="mt-8">
        <div
          className={`border-2 border-dashed rounded-lg p-12 text-center ${
            isDragging ? 'border-[#690d89] bg-[#690d89]/5' : 'border-gray-300 hover:border-[#690d89]/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.querySelector('input[type="file"]').click()}
        >
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          <p className="mt-2 text-sm font-medium text-gray-900">
            Drag and drop operator logos here, or click to browse
          </p>
          <p className="mt-1 text-xs text-gray-500">
            PNG, JPG up to 2MB
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
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
                    {!isUploading && (
                      <button
                        type="button"
                        onClick={() => removeFile(file.id)}
                        className="ml-4 text-sm font-medium text-red-600 hover:text-red-500"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  
                  {isUploading && (
                    <div className="mt-2">
                      <div className="bg-gray-200 rounded-full h-2.5 w-full">
                        <div 
                          className="bg-[#690d89] h-2.5 rounded-full" 
                          style={{ width: `${uploadProgress[file.id] || 0}%` }}
                        ></div>
                      </div>
                      <p className="mt-1 text-xs text-gray-500 text-right">
                        {uploadProgress[file.id] || 0}%
                      </p>
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
              disabled={isUploading || files.length === 0}
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