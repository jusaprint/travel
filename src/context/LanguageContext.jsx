import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/cms';
import Cookies from 'js-cookie';

// Create context at the top level
const LanguageContext = createContext();

// Define and export hook at the top level
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Export provider component
export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [languages, setLanguages] = useState([
    { code: 'en', name: 'English', flag: 'GB' },
    { code: 'sq', name: 'Shqip', flag: 'AL' },
    { code: 'fr', name: 'Français', flag: 'FR' },
    { code: 'de', name: 'Deutsch', flag: 'DE' },
    { code: 'tr', name: 'Türkçe', flag: 'TR' }
  ]);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);

  // Load available languages from Supabase with timeout
  useEffect(() => {
    const loadLanguages = async () => {
      try {
        setLoading(true);
        setError(null);

        // First try to get stored language preference
        const storedLang = Cookies.get('kudosim_language');
        
        // Set up timeout for the fetch request
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout')), 5000)
        );
        
        // Fetch languages with timeout
        const fetchPromise = supabase
          .from('cms_languages')
          .select('*')
          .order('is_default', { ascending: false });
        
        try {
          const { data, error } = await Promise.race([fetchPromise, timeoutPromise]);
          
          if (error) throw error;

          if (data && data.length > 0) {
            setLanguages(data);
            
            // Set language preference
            const defaultLang = storedLang || data.find(lang => lang.is_default)?.code || 'en';
            setCurrentLanguage(defaultLang);
            
            // Only change language if it's different from current
            if (defaultLang !== i18n.language) {
              await i18n.changeLanguage(defaultLang);
            }
          }
        } catch (fetchError) {
          console.warn('Error fetching languages from database, using defaults:', fetchError);
          // Continue with default languages
          
          // Set language preference from cookie or default to 'en'
          const defaultLang = storedLang || 'en';
          setCurrentLanguage(defaultLang);
          
          // Only change language if it's different from current
          if (defaultLang !== i18n.language) {
            await i18n.changeLanguage(defaultLang);
          }
        }
      } catch (err) {
        console.error('Error in language loading process:', err);
        setError('Failed to load languages');
        
        // Fallback to default language if there's an error
        const defaultLang = Cookies.get('kudosim_language') || 'en';
        setCurrentLanguage(defaultLang);
        
        // Only change language if it's different from current
        if (defaultLang !== i18n.language) {
          await i18n.changeLanguage(defaultLang);
        }
      } finally {
        setLoading(false);
      }
    };

    loadLanguages();
  }, [i18n]);

  // Change language handler - optimized to prevent UI blocking
  const changeLanguage = useCallback(async (langCode) => {
    try {
      // Don't do anything if it's already the current language or if a change is in progress
      if (langCode === currentLanguage || isChangingLanguage) {
        return Promise.resolve();
      }
      
      // Set changing flag to prevent multiple simultaneous changes
      setIsChangingLanguage(true);
      
      // First update the state to prevent UI blocking
      setCurrentLanguage(langCode);
      
      // Save preference to cookie
      Cookies.set('kudosim_language', langCode, { expires: 365 });
      
      // Return a promise that resolves when the language change is complete
      return new Promise((resolve) => {
        // Use requestAnimationFrame to defer the language change to the next frame
        requestAnimationFrame(() => {
          // Use setTimeout to push the operation to the end of the event queue
          setTimeout(() => {
            i18n.changeLanguage(langCode)
              .then(resolve)
              .catch(error => {
                console.error('Error changing language:', error);
                resolve(); // Resolve anyway to prevent hanging promises
              })
              .finally(() => {
                // Reset the changing flag after a short delay
                setTimeout(() => {
                  setIsChangingLanguage(false);
                }, 300);
              });
          }, 10);
        });
      });
    } catch (error) {
      console.error('Error changing language:', error);
      setIsChangingLanguage(false);
      return Promise.reject(error);
    }
  }, [currentLanguage, i18n, isChangingLanguage]);

  return (
    <LanguageContext.Provider value={{ 
      languages, 
      currentLanguage, 
      changeLanguage,
      loading,
      error,
      isChangingLanguage
    }}>
      {children}
    </LanguageContext.Provider>
  );
};