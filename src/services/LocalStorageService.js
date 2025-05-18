/**
 * Service for handling file uploads to local storage
 * This is a browser-based solution that stores files in IndexedDB
 */
class LocalStorageService {
  constructor() {
    this.dbName = 'kudosim-media-storage';
    this.dbVersion = 1;
    this.storeName = 'files';
    this.db = null;
    this.initDatabase();
  }

  /**
   * Initialize the IndexedDB database
   * @private
   */
  async initDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = (event) => {
        console.error('Error opening IndexedDB:', event.target.error);
        reject(event.target.error);
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        console.log('IndexedDB initialized successfully');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Create object store for files if it doesn't exist
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
          store.createIndex('filename', 'filename', { unique: false });
          store.createIndex('folder', 'folder', { unique: false });
          store.createIndex('createdAt', 'createdAt', { unique: false });
          console.log('Created files object store');
        }
      };
    });
  }

  /**
   * Ensure database is initialized
   * @private
   */
  async ensureDbReady() {
    if (!this.db) {
      await this.initDatabase();
    }
  }

  /**
   * Upload a file to local storage (IndexedDB)
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
    
    console.log(`Uploading file to local storage:`, finalFileName);
    
    try {
      await this.ensureDbReady();
      
      // Start with 10% progress indication
      if (onProgress) onProgress(10);
      
      // Read the file as an ArrayBuffer
      const arrayBuffer = await this.readFileAsArrayBuffer(file, onProgress);
      
      // Update progress to 70%
      if (onProgress) onProgress(70);
      
      // Generate a unique ID for the file
      const id = `${folder}/${finalFileName}`;
      
      // Create a blob URL for the file
      const blob = new Blob([arrayBuffer], { type: file.type });
      const url = URL.createObjectURL(blob);
      
      // Store file metadata and blob URL in IndexedDB
      const fileData = {
        id,
        filename: finalFileName,
        folder,
        url,
        blobUrl: url,
        mime_type: file.type,
        size: file.size,
        createdAt: new Date().toISOString(),
        metadata: {
          storage_provider: 'local',
          folder
        }
      };
      
      await this.saveToIndexedDB(fileData);
      
      // Update progress to 90%
      if (onProgress) onProgress(90);
      
      // Record the file in the database for tracking
      await this.recordFileInDatabase(fileData);
      
      // Complete progress
      if (onProgress) onProgress(100);
      
      console.log('Successfully uploaded to local storage:', url);
      return url;
    } catch (error) {
      console.error('Error uploading to local storage:', error);
      throw error;
    }
  }

  /**
   * Read a file as ArrayBuffer with progress tracking
   * @private
   * @param {File} file - The file to read
   * @param {Function} onProgress - Progress callback
   * @returns {Promise<ArrayBuffer>} - The file as ArrayBuffer
   */
  readFileAsArrayBuffer(file, onProgress) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        resolve(event.target.result);
      };
      
      reader.onerror = (event) => {
        reject(event.target.error);
      };
      
      reader.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          // Calculate progress between 10% and 70%
          const progressPercent = 10 + (event.loaded / event.total) * 60;
          onProgress(Math.round(progressPercent));
        }
      };
      
      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Save file data to IndexedDB
   * @private
   * @param {Object} fileData - The file data to save
   * @returns {Promise<void>}
   */
  async saveToIndexedDB(fileData) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      
      const request = store.put(fileData);
      
      request.onsuccess = () => {
        resolve();
      };
      
      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  }

  /**
   * Record file metadata in the database
   * @private
   * @param {Object} fileData - The file data to record
   */
  async recordFileInDatabase(fileData) {
    try {
      console.log('Recording file in local database:', fileData);
      
      // Store in localStorage for persistence
      const existingFiles = JSON.parse(localStorage.getItem('kudosim_media_files') || '[]');
      
      // Create a database-compatible record
      const dbRecord = {
        id: fileData.id,
        filename: fileData.filename,
        url: fileData.url,
        mime_type: fileData.mime_type,
        size: fileData.size,
        created_at: fileData.createdAt,
        alt_text: fileData.filename.split('.')[0], // Use filename without extension as alt text
        metadata: fileData.metadata
      };
      
      // Check if file already exists
      const existingIndex = existingFiles.findIndex(file => file.id === dbRecord.id);
      if (existingIndex >= 0) {
        // Update existing record
        existingFiles[existingIndex] = dbRecord;
      } else {
        // Add new record
        existingFiles.push(dbRecord);
      }
      
      localStorage.setItem('kudosim_media_files', JSON.stringify(existingFiles));
      console.log('File recorded in local database successfully');
      
      // Also try to save to Supabase if available
      try {
        const { supabase } = await import('../lib/cms');
        if (supabase) {
          const { data, error } = await supabase
            .from('cms_media')
            .upsert([dbRecord]);
            
          if (error) {
            console.warn('Error recording file in Supabase:', error);
          } else {
            console.log('File recorded in Supabase successfully:', data);
          }
        }
      } catch (e) {
        console.log('Supabase not available, skipping database record');
      }
    } catch (error) {
      console.warn('Error recording file in local database:', error);
    }
  }

  /**
   * Delete a file from local storage
   * @param {string} url - The URL of the file to delete
   * @returns {Promise<boolean>} - Whether the deletion was successful
   */
  async deleteFile(url) {
    try {
      await this.ensureDbReady();
      
      // Find the file in IndexedDB
      const fileData = await this.getFileByUrl(url);
      
      if (!fileData) {
        throw new Error('File not found in local storage');
      }
      
      // Revoke the blob URL
      URL.revokeObjectURL(fileData.blobUrl);
      
      // Delete from IndexedDB
      await this.deleteFromIndexedDB(fileData.id);
      
      // Delete from localStorage
      const existingFiles = JSON.parse(localStorage.getItem('kudosim_media_files') || '[]');
      const updatedFiles = existingFiles.filter(file => file.url !== url);
      localStorage.setItem('kudosim_media_files', JSON.stringify(updatedFiles));
      
      return true;
    } catch (error) {
      console.error('Error deleting file from local storage:', error);
      throw error;
    }
  }

  /**
   * Get a file by URL
   * @private
   * @param {string} url - The URL of the file
   * @returns {Promise<Object|null>} - The file data or null if not found
   */
  async getFileByUrl(url) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.openCursor();
      
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          if (cursor.value.url === url) {
            resolve(cursor.value);
            return;
          }
          cursor.continue();
        } else {
          resolve(null);
        }
      };
      
      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  }

  /**
   * Delete a file from IndexedDB
   * @private
   * @param {string} id - The ID of the file to delete
   * @returns {Promise<void>}
   */
  async deleteFromIndexedDB(id) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      
      const request = store.delete(id);
      
      request.onsuccess = () => {
        resolve();
      };
      
      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  }

  /**
   * Get a list of files from local storage
   * @param {Object} options - Query options
   * @param {string} options.folder - Filter by folder
   * @param {string} options.type - Filter by MIME type
   * @param {number} options.limit - Limit the number of results
   * @returns {Promise<Array>} - Array of file objects
   */
  async getFiles(options = {}) {
    try {
      await this.ensureDbReady();
      
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([this.storeName], 'readonly');
        const store = transaction.objectStore(this.storeName);
        const request = store.getAll();
        
        request.onsuccess = (event) => {
          let files = event.target.result || [];
          
          // Apply filters
          if (options.folder) {
            files = files.filter(file => file.folder === options.folder);
          }
          
          if (options.type) {
            files = files.filter(file => file.mime_type.startsWith(options.type));
          }
          
          // Sort by creation date (newest first)
          files.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          
          // Apply limit
          if (options.limit && options.limit > 0) {
            files = files.slice(0, options.limit);
          }
          
          resolve(files);
        };
        
        request.onerror = (event) => {
          reject(event.target.error);
        };
      });
    } catch (error) {
      console.error('Error getting files from local storage:', error);
      
      // Fallback to localStorage if IndexedDB fails
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
  }

  /**
   * Clear all files from local storage
   * @returns {Promise<void>}
   */
  async clearStorage() {
    try {
      await this.ensureDbReady();
      
      // Get all files to revoke blob URLs
      const files = await this.getFiles();
      
      // Revoke all blob URLs
      for (const file of files) {
        if (file.blobUrl) {
          URL.revokeObjectURL(file.blobUrl);
        }
      }
      
      // Clear IndexedDB
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        
        const request = store.clear();
        
        request.onsuccess = () => {
          // Clear localStorage
          localStorage.removeItem('kudosim_media_files');
          resolve();
        };
        
        request.onerror = (event) => {
          reject(event.target.error);
        };
      });
    } catch (error) {
      console.error('Error clearing local storage:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const localStorageService = new LocalStorageService();