import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import Flag from 'react-world-flags';
import Fuse from 'fuse.js';
import { useCountries } from '../hooks/useData';

// Debounce function to limit how often a function is called
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
};

const SearchCountries = ({ placeholder }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef(null);
  const resultsRef = useRef(null);
  const { t, i18n } = useTranslation();
  
  // Get countries data
  const { countries, loading } = useCountries();
  
  // Debounce search term to avoid excessive re-renders
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  // Create memoized Fuse instance for fuzzy search
  const fuse = useMemo(() => {
    return new Fuse(countries, {
      keys: [
        { name: 'name', weight: 2 },
        { name: 'code', weight: 1 },
        { name: 'translations.en.name', weight: 2 },
        { name: 'translations.fr.name', weight: 1.5 },
        { name: 'translations.de.name', weight: 1.5 },
        { name: 'translations.sq.name', weight: 1.5 },
        { name: 'translations.tr.name', weight: 1.5 }
      ],
      includeScore: true,
      threshold: 0.4,
      ignoreLocation: true,
      useExtendedSearch: true
    });
  }, [countries]);
  
  // Memoize search results to avoid recalculation on every render
  const searchResults = useMemo(() => {
    if (!debouncedSearchTerm || debouncedSearchTerm.length < 2) return [];
    
    // Limit to 5 results for better performance
    return fuse.search(debouncedSearchTerm).slice(0, 5).map(result => result.item);
  }, [debouncedSearchTerm, fuse]);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < searchResults.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : 0);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && searchResults[selectedIndex]) {
          window.location.href = `/country/${searchResults[selectedIndex].code.toLowerCase()}`;
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
      default:
        break;
    }
  };
  
  // Scroll to selected item
  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const selectedElement = resultsRef.current.children[selectedIndex];
      if (selectedElement) {
        selectedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [selectedIndex]);
  
  // Get translated country name
  const getTranslatedName = (country) => {
    if (country.translations && country.translations[i18n.language]) {
      return country.translations[i18n.language].name;
    }
    return country.name;
  };
  
  return (
    <div className="relative w-full" ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder || t('search.placeholder', 'Search Countries...')}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (e.target.value.length >= 2) {
              setIsOpen(true);
            } else {
              setIsOpen(false);
            }
            setSelectedIndex(-1);
          }}
          onFocus={() => {
            if (searchTerm.length >= 2) {
              setIsOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          className="w-full px-4 py-3 rounded-xl border-2 border-[#690d89]/20 focus:border-[#690d89] focus:ring-4 focus:ring-[#690d89]/20 transition-all duration-300"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <svg 
            className="w-5 h-5 text-[#690d89]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
      
      <AnimatePresence>
        {isOpen && searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-xl max-h-80 overflow-y-auto"
            ref={resultsRef}
          >
            {searchResults.map((country, index) => (
              <Link
                key={country.code}
                to={`/country/${country.code.toLowerCase()}`}
                className={`flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors ${
                  index === selectedIndex ? 'bg-[#690d89]/5' : ''
                }`}
                onClick={() => {
                  setIsOpen(false);
                  setSearchTerm('');
                }}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="w-10 h-8 overflow-hidden rounded-md shadow-sm">
                  <Flag 
                    code={country.code} 
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{getTranslatedName(country)}</h3>
                  {country.starting_price && (
                    <p className="text-sm text-gray-500">
                      {t('starting.from', 'Starting from')} {country.starting_price}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </motion.div>
        )}
        
        {isOpen && debouncedSearchTerm.length >= 2 && searchResults.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-xl p-4 text-center"
          >
            <p className="text-gray-500">{t('search.no.results', 'No countries found')}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchCountries;