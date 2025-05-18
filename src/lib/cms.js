import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate required environment variables
if (!supabaseUrl) {
  throw new Error(
    'VITE_SUPABASE_URL is not defined. Please connect to Supabase by clicking the "Connect to Supabase" button in the top right.'
  );
}

if (!supabaseAnonKey) {
  throw new Error(
    'VITE_SUPABASE_ANON_KEY is not defined. Please connect to Supabase by clicking the "Connect to Supabase" button in the top right.'
  );
}

// Create Supabase client with proper configuration and error handling
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey, 
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    },
    global: {
      headers: {
        'x-client-info': 'kudosim-website',
        'Content-Type': 'application/json'
      }
    },
    realtime: {
      params: {
        eventsPerSecond: 5
      }
    },
    // Add fetch options for better performance
    fetch: {
      cache: 'no-store' // Changed from 'force-cache' to 'no-store' to prevent stale data
    }
  }
);

// Add error handling for failed requests
const handleError = (error) => {
  console.error('Supabase request failed:', error);
};

// Create a cache for frequently accessed data
const cache = new Map();
const CACHE_TTL = 60 * 1000; // 1 minute - reduced from 5 minutes

// Add browser storage cache for persistence between page loads
const storageCache = {
  get: (key) => {
    try {
      const item = sessionStorage.getItem(`kudosim_${key}`);
      if (!item) return null;
      
      const { data, timestamp } = JSON.parse(item);
      if (Date.now() - timestamp < CACHE_TTL) {
        return { data, timestamp };
      }
      
      // Clear expired cache
      sessionStorage.removeItem(`kudosim_${key}`);
      return null;
    } catch (e) {
      return null;
    }
  },
  set: (key, data) => {
    try {
      const cacheItem = {
        data,
        timestamp: Date.now()
      };
      sessionStorage.setItem(`kudosim_${key}`, JSON.stringify(cacheItem));
    } catch (e) {
      // Ignore storage errors
    }
  }
};

export const cms = {
  // Wrap database calls with error handling and caching
  async query(table, query) {
    const cacheKey = `${table}-${JSON.stringify(query)}`;
    
    // Check memory cache first
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }
    
    // Check storage cache
    const storedCache = storageCache.get(cacheKey);
    if (storedCache) {
      // Also update memory cache
      cache.set(cacheKey, storedCache);
      return storedCache.data;
    }
    
    try {
      const { data, error } = await query(supabase.from(table));
      if (error) throw error;
      
      // Cache the result in both memory and storage
      cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });
      
      storageCache.set(cacheKey, data);
      
      return data;
    } catch (error) {
      handleError(error);
      return null;
    }
  },

  // Helper method for safe data fetching with caching
  async safeQuery(table, queryFn) {
    const cacheKey = `${table}-${queryFn.toString()}`;
    
    // Check memory cache first
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }
    
    // Check storage cache
    const storedCache = storageCache.get(cacheKey);
    if (storedCache) {
      // Also update memory cache
      cache.set(cacheKey, storedCache);
      return storedCache.data;
    }
    
    try {
      const { data, error } = await queryFn(supabase.from(table));
      if (error) throw error;
      
      // Cache the result in both memory and storage
      cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });
      
      storageCache.set(cacheKey, data);
      
      return data || [];
    } catch (error) {
      handleError(error);
      return [];
    }
  },
  
  // Safely get menu items with fallback and caching
  async getMenuItems() {
    const cacheKey = 'menu-items';
    
    // Check memory cache first
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }
    
    // Check storage cache
    const storedCache = storageCache.get(cacheKey);
    if (storedCache) {
      // Also update memory cache
      cache.set(cacheKey, storedCache);
      return storedCache.data;
    }
    
    try {
      const { data, error } = await supabase
        .from('cms_menu_items')
        .select('*')
        .is('parent_id', null) // Get only top-level items
        .eq('status', 'active')
        .order('order', { ascending: true });
        
      if (error) throw error;
      
      // Get submenu items for each main menu item
      const menuWithSubmenu = [];
      for (const item of data || []) {
        try {
          const { data: submenu } = await supabase
            .from('cms_menu_items')
            .select('*')
            .eq('parent_id', item.id)
            .eq('status', 'active')
            .order('order', { ascending: true });
            
          menuWithSubmenu.push({
            ...item,
            submenu: submenu || []
          });
        } catch (error) {
          console.warn(`Error fetching submenu for item ${item.id}:`, error);
          menuWithSubmenu.push({
            ...item,
            submenu: []
          });
        }
      }
      
      // Cache the result in both memory and storage
      cache.set(cacheKey, {
        data: menuWithSubmenu,
        timestamp: Date.now()
      });
      
      storageCache.set(cacheKey, menuWithSubmenu);
      
      return menuWithSubmenu;
    } catch (error) {
      console.warn('Error fetching menu items:', error);
      // Return default menu items as fallback
      return [
        { 
          id: '1',
          name: 'Destinations', 
          href: '/destinations', 
          icon: 'globe',
          order: 1,
          submenu: []
        },
        { 
          id: '2',
          name: 'For Business', 
          href: '/business', 
          icon: 'briefcase',
          order: 2,
          submenu: []
        },
        { 
          id: '3',
          name: 'Support', 
          href: '/support', 
          icon: 'support',
          order: 3,
          submenu: []
        },
        { 
          id: '4',
          name: 'My eSIMs', 
          href: '/my-esims', 
          icon: 'sim',
          order: 4,
          submenu: []
        }
      ];
    }
  },
  
  // Get translations from database with caching
  async getTranslations(category = null, language = null) {
    const cacheKey = `translations-${category}-${language}`;
    
    // Check memory cache first
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }
    
    // Check storage cache
    const storedCache = storageCache.get(cacheKey);
    if (storedCache) {
      // Also update memory cache
      cache.set(cacheKey, storedCache);
      return storedCache.data;
    }
    
    try {
      let query = supabase.from('cms_translations').select('*');
      
      if (category) {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Cache the result in both memory and storage
      cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });
      
      storageCache.set(cacheKey, data);
      
      // Process translations
      if (language) {
        return data.map(item => ({
          ...item,
          translation: item.translations[language] || item.translations.en || null
        }));
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching translations:', error);
      return [];
    }
  },
  
  // Update a translation
  async updateTranslation(key, translations) {
    try {
      const { data, error } = await supabase
        .from('cms_translations')
        .update({ translations })
        .eq('key', key);
      
      if (error) {
        throw error;
      }
      
      // Invalidate cache for translations
      for (const cacheKey of Array.from(cache.keys())) {
        if (cacheKey.startsWith('translations-')) {
          cache.delete(cacheKey);
        }
      }
      
      // Clear storage cache for translations
      for (const key of Object.keys(sessionStorage)) {
        if (key.startsWith('kudosim_translations-')) {
          sessionStorage.removeItem(key);
        }
      }
      
      return { success: true, data };
    } catch (error) {
      console.error('Error updating translation:', error);
      return { success: false, error };
    }
  },
  
  // Add a new translation
  async addTranslation(key, category, translations) {
    try {
      const { data, error } = await supabase
        .from('cms_translations')
        .insert([{
          key,
          category,
          translations
        }]);
      
      if (error) {
        throw error;
      }
      
      // Invalidate cache for translations
      for (const cacheKey of Array.from(cache.keys())) {
        if (cacheKey.startsWith('translations-')) {
          cache.delete(cacheKey);
        }
      }
      
      // Clear storage cache for translations
      for (const key of Object.keys(sessionStorage)) {
        if (key.startsWith('kudosim_translations-')) {
          sessionStorage.removeItem(key);
        }
      }
      
      return { success: true, data };
    } catch (error) {
      console.error('Error adding translation:', error);
      return { success: false, error };
    }
  },
  
  // Delete a translation
  async deleteTranslation(key) {
    try {
      const { error } = await supabase
        .from('cms_translations')
        .delete()
        .eq('key', key);
      
      if (error) {
        throw error;
      }
      
      // Invalidate cache for translations
      for (const cacheKey of Array.from(cache.keys())) {
        if (cacheKey.startsWith('translations-')) {
          cache.delete(cacheKey);
        }
      }
      
      // Clear storage cache for translations
      for (const key of Object.keys(sessionStorage)) {
        if (key.startsWith('kudosim_translations-')) {
          sessionStorage.removeItem(key);
        }
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting translation:', error);
      return { success: false, error };
    }
  },
  
  // Clear cache
  clearCache() {
    cache.clear();
    
    // Clear storage cache
    for (const key of Object.keys(sessionStorage)) {
      if (key.startsWith('kudosim_')) {
        sessionStorage.removeItem(key);
      }
    }
  }
};