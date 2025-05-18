import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Flag from 'react-world-flags';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCountries } from '../hooks/useData';
import { useTranslationLoader } from '../i18n/hooks/useTranslationLoader';
import TranslatedText from './TranslatedText';

const ITEMS_PER_LOAD = 12; // Show 12 countries initially and on each load more

export default function LocalCountriesGrid() {
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleItems, setVisibleItems] = useState(ITEMS_PER_LOAD);
  const { countries, loading, error } = useCountries();
  const { t } = useTranslation();
  
  // Load the necessary namespaces
  const { isLoading } = useTranslationLoader(['search', 'button', 'country']);
  
  // Filter only countries that should be shown in local tab
  const localCountries = countries.filter(country => country.show_in_local);

  // Filter countries based on search
  const filteredCountries = localCountries.filter(country => 
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get visible countries
  const visibleCountries = filteredCountries.slice(0, visibleItems);
  const hasMore = visibleItems < filteredCountries.length;

  // Reset visible items when search changes
  useEffect(() => {
    setVisibleItems(ITEMS_PER_LOAD);
  }, [searchTerm]);

  const handleLoadMore = () => {
    setVisibleItems(prev => Math.min(prev + ITEMS_PER_LOAD, filteredCountries.length));
  };

  if (loading || isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#690d89]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder={t('search.countries.placeholder', 'Search Countries...')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border-2 border-[#690d89]/20 focus:border-[#690d89] focus:ring-4 focus:ring-[#690d89]/20 transition-all duration-300"
        />
        <svg 
          className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#690d89]"
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

      {/* Countries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {visibleCountries.map((country) => (
            <motion.div
              key={country.code}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              layout
            >
              <Link 
                to={`/country/${country.code.toLowerCase()}`}
                className="block h-full"
              >
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 h-full"
                >
                  <div className="flex items-center gap-4">
                    {/* Flag */}
                    <div className="w-16 h-12 overflow-hidden rounded-lg shadow-lg">
                      <Flag 
                        code={country.code} 
                        className="w-full h-full object-cover"
                        loading="lazy"
                        width="64"
                        height="48"
                      />
                    </div>

                    {/* Country Info */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900">{country.name}</h3>
                      {country.starting_price && (
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-gray-500">
                            <TranslatedText 
                              textKey="starting.from" 
                              namespace="country" 
                              fallback="Starting from"
                            />
                          </span>
                          <span className="text-lg font-bold text-[#690d89]">{country.starting_price}</span>
                        </div>
                      )}
                    </div>

                    {/* Arrow Icon */}
                    <motion.div 
                      className="text-[#690d89]"
                      whileHover={{ x: 5 }}
                    >
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </motion.div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center mt-8">
          <motion.button
            onClick={handleLoadMore}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-[#690d89] text-white rounded-xl font-medium hover:bg-[#8B5CF6] transition-colors duration-300 shadow-lg flex items-center gap-2"
          >
            <TranslatedText 
              textKey="load.more" 
              namespace="button" 
              fallback="Load More"
            />
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.button>
        </div>
      )}

      {/* Empty State */}
      {filteredCountries.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
          <svg 
            className="w-16 h-16 mx-auto text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900">
            <TranslatedText 
              textKey="no.results" 
              namespace="search" 
              fallback="No countries found"
            />
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            {searchTerm ? (
              <TranslatedText 
                textKey="try.again" 
                namespace="search" 
                fallback="Try adjusting your search terms"
              />
            ) : (
              <TranslatedText 
                textKey="no.results" 
                namespace="search" 
                fallback="No countries found"
              />
            )}
          </p>
        </div>
      )}
    </div>
  );
}