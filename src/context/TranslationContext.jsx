import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/cms';
import Cookies from 'js-cookie';

// Create context
const TranslationContext = createContext(null);

// Custom hook to use the translation context
const useTranslationContext = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslationContext must be used within a TranslationProvider');
  }
  return context;
};

// Retry configuration
const RETRY_COUNT = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second
const MAX_RETRY_DELAY = 5000; // 5 seconds

// Helper function to delay execution
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Provider component
export const TranslationProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [translations, setTranslations] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [translationsCache, setTranslationsCache] = useState({});

  // Function to fetch translations with retries
  const fetchTranslationsWithRetry = async (retryCount = 0, retryDelay = INITIAL_RETRY_DELAY) => {
    try {
      // Fetch translations
      const { data, error: fetchError } = await supabase
        .from('cms_translations')
        .select('*');

      if (fetchError) {
        throw fetchError;
      }

      return data;
    } catch (error) {
      if (retryCount < RETRY_COUNT) {
        // Calculate next retry delay with exponential backoff
        const nextDelay = Math.min(retryDelay * 2, MAX_RETRY_DELAY);
        console.warn(`Fetch attempt ${retryCount + 1} failed, retrying in ${retryDelay}ms...`);
        
        await delay(retryDelay);
        return fetchTranslationsWithRetry(retryCount + 1, nextDelay);
      }
      throw error;
    }
  };

  // Load translations from database
  const loadTranslations = useCallback(async () => {
    // Get current language before try/catch block
    const currentLang = i18n.language || 'en';

    try {
      setLoading(true);
      setError(null);
      
      // Check if we have cached translations for this language
      if (translationsCache[currentLang]) {
        setTranslations(translationsCache[currentLang]);
        setLoading(false);
        return;
      }

      // Attempt to fetch translations with retry mechanism
      const data = await fetchTranslationsWithRetry();

      if (!data) {
        console.warn('No translation data received, using fallback');
        // Use fallback translations from static files
        setTranslations({});
        return;
      }
      
      // Process translations by category
      const processedTranslations = {};
      data.forEach(item => {
        const { key, category, translations: translationData } = item;
        
        if (!processedTranslations[category]) {
          processedTranslations[category] = {};
        }
        
        // Get translation for current language or fallback to English
        const translationValue = translationData?.[currentLang] || translationData?.en;
        
        if (translationValue) {
          processedTranslations[category][key] = translationValue;
        }
      });
      
      // Add translations to i18next
      Object.entries(processedTranslations).forEach(([namespace, resources]) => {
        i18n.addResourceBundle(
          currentLang,
          namespace,
          resources,
          true,
          true
        );
      });
      
      // Cache the translations
      setTranslationsCache(prev => ({
        ...prev,
        [currentLang]: processedTranslations
      }));
      
      setTranslations(processedTranslations);
    } catch (err) {
      console.error('Error loading translations:', err);
      setError(err.message || 'Failed to load translations');
      
      // Try to load from static files as fallback
      try {
        // Check if namespace is already loaded
        const namespaces = ['common', 'navigation', 'home', 'features'];
        for (const namespace of namespaces) {
          if (!i18n.hasResourceBundle(currentLang, namespace)) {
            await i18n.loadNamespaces(namespace);
          }
        }
      } catch (staticError) {
        console.error('Failed to load static translations:', staticError);
      }
      
      // Set empty translations to prevent complete app failure
      setTranslations({});
    } finally {
      setLoading(false);
    }
  }, [i18n, translationsCache]);

  useEffect(() => {
    loadTranslations();
    
    // Set up a listener for language changes
    const handleLanguageChanged = () => {
      loadTranslations();
    };
    
    i18n.on('languageChanged', handleLanguageChanged);
    
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n, loadTranslations]);

  // Function to get translation for a specific key and namespace
  const getTranslation = (key, namespace = 'common') => {
    if (!translations[namespace]) return key;
    return translations[namespace][key] || key;
  };

  // Function to update a translation with error handling
  const updateTranslation = async (key, namespace, newTranslations) => {
    try {
      const { error: updateError } = await supabase
        .from('cms_translations')
        .update({ translations: newTranslations })
        .eq('key', key)
        .eq('category', namespace);
      
      if (updateError) {
        throw updateError;
      }
      
      // Invalidate cache for this language
      setTranslationsCache(prev => {
        const newCache = { ...prev };
        // Remove all language caches to ensure fresh data
        Object.keys(newCache).forEach(lang => {
          delete newCache[lang];
        });
        return newCache;
      });
      
      return { success: true };
    } catch (err) {
      console.error('Error updating translation:', err);
      return { success: false, error: err.message };
    }
  };

  // Function to add a new translation with error handling
  const addTranslation = async (key, namespace, initialTranslations) => {
    try {
      const { error: insertError } = await supabase
        .from('cms_translations')
        .insert([{
          key,
          category: namespace,
          translations: initialTranslations
        }]);
      
      if (insertError) {
        throw insertError;
      }
      
      // Invalidate cache for this language
      setTranslationsCache(prev => {
        const newCache = { ...prev };
        // Remove all language caches to ensure fresh data
        Object.keys(newCache).forEach(lang => {
          delete newCache[lang];
        });
        return newCache;
      });
      
      return { success: true };
    } catch (err) {
      console.error('Error adding translation:', err);
      return { success: false, error: err.message };
    }
  };

  return (
    <TranslationContext.Provider value={{
      translations,
      loading,
      error,
      getTranslation,
      updateTranslation,
      addTranslation
    }}>
      {children}
    </TranslationContext.Provider>
  );
};