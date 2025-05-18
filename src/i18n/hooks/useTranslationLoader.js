import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../lib/cms';

/**
 * Custom hook to load and manage translations for specific namespaces
 * @param {Array<string>} namespaces - Array of namespaces to load
 * @returns {Object} - Object containing loading state and loaded namespaces
 */
export const useTranslationLoader = (namespaces = []) => {
  const { i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(namespaces.length > 0);
  const [loadedNamespaces, setLoadedNamespaces] = useState([]);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const loadNamespaces = async () => {
      if (namespaces.length === 0) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        const language = i18n.language;
        const namespacesToLoad = namespaces.filter(ns => !i18n.hasResourceBundle(language, ns));
        
        if (namespacesToLoad.length === 0) {
          setIsLoading(false);
          setLoadedNamespaces(namespaces);
          return;
        }
        
        // First try to load from static files
        try {
          await Promise.all(
            namespacesToLoad.map(async (namespace) => {
              return new Promise((resolve) => {
                i18n.loadNamespaces(namespace, () => {
                  resolve();
                });
              });
            })
          );
          
          // If we get here, static files loaded successfully
          setLoadedNamespaces(namespaces);
          setIsLoading(false);
          return;
        } catch (staticError) {
          console.warn('Error loading from static files, trying database:', staticError);
          // Continue to database loading
        }
        
        // Try to load translations from database as fallback
        try {
          const { data, error } = await supabase
            .from('cms_translations')
            .select('*')
            .in('category', namespacesToLoad);
          
          if (error) {
            console.warn('Database fetch error:', error);
            throw error;
          }
          
          // Process translations by namespace
          const translationsByNamespace = {};
          
          // Initialize namespaces
          namespacesToLoad.forEach(ns => {
            translationsByNamespace[ns] = {};
          });
          
          // Group translations by namespace
          data?.forEach(item => {
            const { key, category, translations } = item;
            
            if (namespacesToLoad.includes(category)) {
              // Get translation for current language or fallback to English
              const translationValue = translations[language] || translations.en;
              
              if (translationValue) {
                translationsByNamespace[category][key] = translationValue;
              }
            }
          });
          
          // Add translations to i18next
          Object.entries(translationsByNamespace).forEach(([namespace, resources]) => {
            if (Object.keys(resources).length > 0) {
              i18n.addResourceBundle(
                language,
                namespace,
                resources,
                true,
                true
              );
            }
          });
          
          setLoadedNamespaces(namespaces);
        } catch (dbError) {
          console.warn('Error loading translations from database:', dbError);
          setError(dbError);
          
          // If both static and DB loading failed, we'll still mark as loaded
          // but with an error state so the app can continue
          setLoadedNamespaces(namespaces);
        }
      } catch (error) {
        console.error('Error loading translation namespaces:', error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadNamespaces();
  }, [i18n, namespaces, i18n.language]);
  
  return { isLoading, loadedNamespaces, error };
};

/**
 * Custom hook to load translations for a specific page
 * @param {string} pageName - The page name
 * @returns {Object} - Object containing loading state and translated page content
 */
export const usePageTranslations = (pageName) => {
  const { t, i18n } = useTranslation('pages');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const loadPageNamespace = async () => {
      if (!pageName) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // First try to load from static files
        try {
          await new Promise(resolve => {
            i18n.loadNamespaces('pages', () => {
              resolve();
            });
          });
          
          // If we get here, static files loaded successfully
          setIsLoading(false);
          return;
        } catch (staticError) {
          console.warn('Error loading page translations from static files:', staticError);
          // Continue to database loading
        }
        
        // Try to load from database as fallback
        try {
          const { data, error } = await supabase
            .from('cms_translations')
            .select('*')
            .eq('category', 'pages');
          
          if (error) throw error;
          
          // Process translations
          const pageTranslations = {};
          data?.forEach(item => {
            const { key, translations } = item;
            
            // Get translation for current language or fallback to English
            const language = i18n.language;
            const translationValue = translations[language] || translations.en;
            
            if (translationValue) {
              pageTranslations[key] = translationValue;
            }
          });
          
          // Add translations to i18next
          if (Object.keys(pageTranslations).length > 0) {
            i18n.addResourceBundle(
              i18n.language,
              'pages',
              pageTranslations,
              true,
              true
            );
          }
        } catch (dbError) {
          console.warn('Error loading page translations from database:', dbError);
          setError(dbError);
        }
      } catch (error) {
        console.error(`Error loading translations for page ${pageName}:`, error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPageNamespace();
  }, [i18n, pageName, i18n.language]);
  
  // Get the translations for the specific page
  const pageContent = pageName ? t(`${pageName}`, { returnObjects: true }) : {};
  
  return { isLoading, pageContent, error };
};