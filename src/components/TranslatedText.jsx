import React, { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Component for displaying translated text from the database
 * @param {Object} props - Component props
 * @param {string} props.textKey - The translation key
 * @param {string} props.namespace - The translation namespace
 * @param {Object} props.options - Options for interpolation
 * @param {string} props.fallback - Fallback text if translation is not found
 * @param {string} props.className - CSS class name
 * @param {string} props.tag - HTML tag to use (default: span)
 * @returns {JSX.Element} - Rendered component
 */
const TranslatedText = ({ 
  textKey, 
  namespace = 'common', 
  options = {}, 
  fallback = '', 
  className = '',
  tag = 'span'
}) => {
  const { t, ready, i18n } = useTranslation(namespace);
  
  // Memoized translation function to prevent unnecessary re-renders
  const getTranslation = useCallback(() => {
    // If translations are still loading and no fallback, show loading indicator
    if (!ready && !fallback) {
      return <span className={`opacity-50 ${className}`}>...</span>;
    }
    
    // Try to get the translation
    const translation = t(textKey, options);
    
    // If the translation key is returned (meaning no translation was found), use fallback
    return translation === textKey ? fallback || textKey : translation;
  }, [t, textKey, options, fallback, ready, className]);
  
  // Render with the specified tag
  const Tag = tag;
  return <Tag className={className}>{getTranslation()}</Tag>;
};

// Memoize the component to prevent unnecessary re-renders
export default memo(TranslatedText);