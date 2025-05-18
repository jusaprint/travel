import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/cms';

// Create Language Context
const LanguagesContext = createContext();

const useLanguages = () => {
  const context = useContext(LanguagesContext);
  if (!context) {
    throw new Error('useLanguages must be used within a DataProvider');
  }
  return context;
};

// Language Provider Component
const LanguagesProvider = ({ children }) => {
  const [languages, setLanguages] = useState([
    { code: 'en', name: 'English', flag: 'GB', is_default: true },
    { code: 'sq', name: 'Shqip', flag: 'AL', is_default: false },
    { code: 'fr', name: 'Français', flag: 'FR', is_default: false },
    { code: 'es', name: 'Español', flag: 'ES', is_default: false }
  ]);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadLanguages = async () => {
      try {
        // Get stored language preference
        const storedLang = localStorage.getItem('kudosim_language');
        
        // Get languages from Supabase
        const { data, error } = await supabase
          .from('cms_languages')
          .select('*')
          .order('is_default', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          setLanguages(data);
          
          // Set language preference
          const defaultLang = storedLang || data.find(lang => lang.is_default)?.code || 'en';
          setCurrentLanguage(defaultLang);
        }
      } catch (err) {
        console.error('Error loading languages:', err);
        setError('Failed to load languages');
        
        // Fallback to default language if there's an error
        const defaultLang = localStorage.getItem('kudosim_language') || 'en';
        setCurrentLanguage(defaultLang);
      } finally {
        setLoading(false);
      }
    };

    loadLanguages();
  }, []);

  const changeLanguage = (code) => {
    if (languages.some(lang => lang.code === code)) {
      setCurrentLanguage(code);
      localStorage.setItem('kudosim_language', code);
    }
  };

  return (
    <LanguagesContext.Provider value={{ 
      languages, 
      currentLanguage, 
      changeLanguage, 
      loading, 
      error 
    }}>
      {children}
    </LanguagesContext.Provider>
  );
};

// Main Data Provider
export function DataProvider({ children }) {
  return (
    <LanguagesProvider>
      {children}
    </LanguagesProvider>
  );
}