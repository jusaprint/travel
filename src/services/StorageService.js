import { supabase } from '../lib/cms';
import { localStorageService } from './LocalStorageService';

/**
 * Service for handling file uploads to external storage providers
 * Supports Local Storage, Netlify Large Media and Supabase Storage
 */
class StorageService {
  constructor() {
    this.storageType = import.meta.env.VITE_STORAGE_TYPE || 'local'; // Default to local storage
    this.netlifyLargeMediaEndpoint = import.meta.env.VITE_NETLIFY_LARGE_MEDIA_ENDPOINT || 'https://api.netlify.com/api/v1/sites/{site_id}/large-media';
    this.netlifyToken = import.meta.env.VITE_NETLIFY_TOKEN;
    this.netlifyApiUrl = import.meta.env.VITE_NETLIFY_API_URL || 'https://api.netlify.com/api/v1';
    this.siteId = import.meta.env.VITE_NETLIFY_SITE_ID;
    
    console.log('StorageService initialized with type:', this.storageType);
  }

  /**
   * Upload a file to the configured storage provider
   * @param {File} file - The file to upload
   * @param {Object} options - Upload options
   * @param {string} options.folder - The folder to upload to
   * @param {string} options.fileName - Optional custom filename
   * @param {Function} options.onProgress - Progress callback
   * @returns {Promise<string>} - The URL of the uploaded file
   */
  async uploadFile(file, options = {}) {
    const { folder = 'uploads', fileName, onProgress } = options;
    
    // Generate a unique filename if not provided
    const finalFileName = fileName || `${Date.now()}-${Math.random().toString(36).substring(2)}-${file.name}`;
    
    // Force storage type from options if provided
    const storageType = options.storageType || this.storageType;
    
    console.log(`Uploading file to ${storageType} storage:`, finalFileName);
    
    // Determine which storage provider to use
    if (storageType === 'local') {
      return localStorageService.uploadFile(file, { folder, fileName: finalFileName, onProgress });
    } else if (storageType === 'netlify') {
      return this.uploadToNetlify(file, folder, finalFileName, onProgress);
    } else {
      return this.uploadToSupabase(file, folder, finalFileName, onProgress);
    }
  }

  /**
   * Upload a file to Netlify Large Media
   * @private
   */
  async uploadToNetlify(file, folder, fileName, onProgress) {
    try {
      console.log('Attempting Netlify upload with credentials:', {
        tokenExists: !!this.netlifyToken,
        siteId: this.siteId,
        apiUrl: this.netlifyApiUrl
      });
      
      if (!this.netlifyToken || !this.siteId) {
        console.warn('Netlify credentials not configured, falling back to local storage');
        return localStorageService.uploadFile(file, { folder, fileName, onProgress });
      }

      // Start with 10% progress indication
      if (onProgress) onProgress(10);

      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append('file', file);
      formData.append('path', `${folder}/${fileName}`);

      console.log('Uploading to Netlify URL:', `${this.netlifyApiUrl}/sites/${this.siteId}/files`);
      
      // Use fetch API with manual progress tracking
      const response = await fetch(`${this.netlifyApiUrl}/sites/${this.siteId}/files`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.netlifyToken}`
        },
        body: formData
      });
      
      // Update progress to 70%
      if (onProgress) onProgress(70);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Netlify upload failed:', response.status, errorText);
        throw new Error(`Netlify upload failed: ${response.status} ${response.statusText}`);
      }
      
      const responseData = await response.json();
      console.log('Netlify upload response:', responseData);
      
      if (!responseData.url) {
        throw new Error('No URL returned from Netlify');
      }
      
      const fileUrl = responseData.url;
      
      // Update progress to 90%
      if (onProgress) onProgress(90);
      
      // Record the file in the database for tracking
      await this.recordFileInDatabase({
        filename: fileName,
        url: fileUrl,
        mime_type: file.type,
        size: file.size,
        storage_provider: 'netlify',
        folder: folder
      });
      
      // Complete progress
      if (onProgress) onProgress(100);
      
      console.log('Successfully uploaded to Netlify:', fileUrl);
      return fileUrl;
    } catch (error) {
      console.error('Error uploading to Netlify:', error);
      console.log('Falling back to local storage');
      return localStorageService.uploadFile(file, { folder, fileName, onProgress });
    }
  }

  /**
   * Upload a file to Supabase Storage
   * @private
   */
  async uploadToSupabase(file, folder, fileName, onProgress) {
    try {
      console.log('Uploading to Supabase Storage');
      
      // Start with 10% progress indication
      if (onProgress) onProgress(10);
      
      const filePath = `${folder}/${fileName}`;
      
      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Supabase upload error:', uploadError);
        throw uploadError;
      }
      
      console.log('Supabase upload successful:', data);
      
      // Update progress to 70%
      if (onProgress) onProgress(70);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);
      
      console.log('Supabase public URL:', publicUrl);
      
      // Update progress to 90%
      if (onProgress) onProgress(90);

      // Record the file in the database for tracking
      await this.recordFileInDatabase({
        filename: fileName,
        url: publicUrl,
        mime_type: file.type,
        size: file.size,
        storage_provider: 'supabase',
        folder: folder
      });
      
      // Complete progress
      if (onProgress) onProgress(100);
      
      return publicUrl;
    } catch (error) {
      console.error('Error uploading to Supabase:', error);
      console.log('Falling back to local storage');
      return localStorageService.uploadFile(file, { folder, fileName, onProgress });
    }
  }

  /**
   * Record file metadata in the database
   * @private
   */
  async recordFileInDatabase(fileData) {
    try {
      console.log('Recording file in database:', fileData);
      
      // Create a database-compatible record
      const dbRecord = {
        filename: fileData.filename,
        url: fileData.url,
        mime_type: fileData.mime_type,
        size: fileData.size,
        alt_text: fileData.filename.split('.')[0], // Use filename without extension as alt text
        metadata: {
          storage_provider: fileData.storage_provider,
          folder: fileData.folder
        }
      };
      
      // For local development without Supabase, store in localStorage
      if (this.storageType === 'local') {
        const existingFiles = JSON.parse(localStorage.getItem('kudosim_media_files') || '[]');
        
        // Check if file already exists by URL
        const existingIndex = existingFiles.findIndex(file => file.url === fileData.url);
        if (existingIndex >= 0) {
          // Update existing record
          existingFiles[existingIndex] = {
            ...existingFiles[existingIndex],
            ...dbRecord,
            updated_at: new Date().toISOString()
          };
        } else {
          // Add new record
          existingFiles.push({
            id: `${fileData.folder}/${fileData.filename}`,
            ...dbRecord,
            created_at: new Date().toISOString()
          });
        }
        
        localStorage.setItem('kudosim_media_files', JSON.stringify(existingFiles));
        console.log('File recorded in local storage successfully');
        return;
      }
      
      // Otherwise, store in Supabase
      const { data, error } = await supabase
        .from('cms_media')
        .insert([dbRecord])
        .select();

      if (error) {
        console.warn('Error recording file in database:', error);
      } else {
        console.log('File recorded in database successfully:', data);
      }
    } catch (error) {
      console.warn('Error recording file in database:', error);
    }
  }

  /**
   * Delete a file from storage
   * @param {string} url - The URL of the file to delete
   * @returns {Promise<boolean>} - Whether the deletion was successful
   */
  async deleteFile(url) {
    try {
      // Check if this is a local blob URL
      if (url.startsWith('blob:')) {
        return localStorageService.deleteFile(url);
      }
      
      // For local development without Supabase, check localStorage
      const existingFiles = JSON.parse(localStorage.getItem('kudosim_media_files') || '[]');
      const fileData = existingFiles.find(file => file.url === url);
      
      if (fileData) {
        // Remove from localStorage
        const updatedFiles = existingFiles.filter(file => file.url !== url);
        localStorage.setItem('kudosim_media_files', JSON.stringify(updatedFiles));
        return true;
      }
      
      // Otherwise, try to delete from Supabase
      const { data, error } = await supabase
        .from('cms_media')
        .select('*')
        .eq('url', url)
        .single();
      
      if (error) throw error;
      
      if (!data) {
        throw new Error('File not found in database');
      }
      
      const storageProvider = data.metadata?.storage_provider || 'supabase';
      
      if (storageProvider === 'netlify') {
        return this.deleteFromNetlify(url, data);
      } else {
        return this.deleteFromSupabase(url, data);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }

  /**
   * Delete a file from Netlify Large Media
   * @private
   */
  async deleteFromNetlify(url, fileData) {
    try {
      if (!this.netlifyToken || !this.siteId) {
        throw new Error('Netlify credentials not configured');
      }
      
      // Extract the file path from the URL
      const urlObj = new URL(url);
      const filePath = urlObj.pathname;
      
      // Delete the file from Netlify
      const response = await fetch(`${this.netlifyApiUrl}/sites/${this.siteId}/files${filePath}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.netlifyToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete file from Netlify: ${response.statusText}`);
      }
      
      // Delete the record from the database
      const { error } = await supabase
        .from('cms_media')
        .delete()
        .eq('id', fileData.id);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error deleting from Netlify:', error);
      throw error;
    }
  }

  /**
   * Delete a file from Supabase Storage
   * @private
   */
  async deleteFromSupabase(url, fileData) {
    try {
      // Extract the path from the URL
      const urlObj = new URL(url);
      const path = urlObj.pathname.split('/').slice(2).join('/');
      
      if (!path) {
        throw new Error('Invalid file path');
      }
      
      // Delete from Supabase Storage
      const { error: storageError } = await supabase.storage
        .from('media')
        .remove([path]);
        
      if (storageError) {
        console.warn(`Error deleting file from storage: ${storageError.message}`);
      }
      
      // Delete the record from the database
      const { error } = await supabase
        .from('cms_media')
        .delete()
        .eq('id', fileData.id);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error deleting from Supabase:', error);
      throw error;
    }
  }

  /**
   * Get a list of files from the database
   * @param {Object} options - Query options
   * @param {string} options.folder - Filter by folder
   * @param {string} options.type - Filter by MIME type
   * @param {number} options.limit - Limit the number of results
   * @returns {Promise<Array>} - Array of file objects
   */
  async getFiles(options = {}) {
    try {
      // For local development without Supabase, use localStorage and IndexedDB
      if (this.storageType === 'local') {
        // First try to get files from IndexedDB via LocalStorageService
        try {
          const files = await localStorageService.getFiles(options);
          if (files && files.length > 0) {
            return files;
          }
        } catch (e) {
          console.warn('Error getting files from IndexedDB:', e);
        }
        
        // Fallback to localStorage
        const existingFiles = JSON.parse(localStorage.getItem('kudosim_media_files') || '[]');
        let files = existingFiles;
        
        // Apply filters
        if (options.folder) {
          files = files.filter(file => file.metadata?.folder === options.folder);
        }
        
        if (options.type) {
          files = files.filter(file => file.mime_type?.startsWith(options.type));
        }
        
        // Sort by creation date (newest first)
        files.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
        
        // Apply limit
        if (options.limit && options.limit > 0) {
          files = files.slice(0, options.limit);
        }
        
        return files;
      }
      
      // Otherwise, use Supabase
      let query = supabase
        .from('cms_media')
        .select('*');
      
      if (options.folder) {
        query = query.eq('metadata->folder', options.folder);
      }
      
      if (options.type) {
        query = query.like('mime_type', `${options.type}%`);
      }
      
      if (options.limit) {
        query = query.limit(options.limit);
      }
      
      query = query.order('created_at', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error getting files:', error);
      
      // Fallback to localStorage if Supabase fails
      const existingFiles = JSON.parse(localStorage.getItem('kudosim_media_files') || '[]');
      return existingFiles;
    }
  }
}

// Export a singleton instance
export const storageService = new StorageService();