import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCountries } from '../../hooks/useData';
import CountryCard from '../CountryCard';
import { useTranslationLoader } from '../../i18n/hooks/useTranslationLoader';

const NavigationDots = ({ total, current, onChange }) => (
  <div className="flex justify-center items-center space-x-2 mt-8">
    {[...Array(total)].map((_, idx) => (
      <button
        key={idx}
        onClick={() => onChange(idx)}
        className={`w-3 h-3 rounded-full transition-all duration-300 ${
          idx === current 
            ? 'bg-[#690d89] scale-100' 
            : 'bg-[#690d89]/20 scale-75 hover:bg-[#690d89]/40'
        }`}
        aria-label={`Go to page ${idx + 1}`}
      />
    ))}
  </div>
);

export default function TopDestinations() {
  const { i18n } = useTranslation();
  const { countries, loading } = useCountries({ status: 'active', topDestination: true });
  const [currentPage, setCurrentPage] = useState(0);
  const { isLoading } = useTranslationLoader(['destinations']);

  // Filter top destinations
  const topDestinations = countries.filter(country => country.top_destination);
  const itemsPerPage = 4; // Always show 4 items
  const totalPages = Math.ceil(topDestinations.length / itemsPerPage);

  const getCurrentPageItems = () => {
    const start = currentPage * itemsPerPage;
    return topDestinations.slice(start, start + itemsPerPage);
  };

  // Get the appropriate title text based on the current language
  const getTitleText = () => {
    switch(i18n.language) {
      case 'sq':
        return (
          <>
            <span>Destinacionet </span>
            <span className="text-[#690d89]">kryesore </span>
            <span>për ju</span>
          </>
        );
      case 'fr':
        return (
          <>
            <span>Meilleures </span>
            <span className="text-[#690d89]">destinations </span>
            <span>pour vous</span>
          </>
        );
      case 'de':
        return (
          <>
            <span>Top </span>
            <span className="text-[#690d89]">Reiseziele </span>
            <span>für Sie</span>
          </>
        );
      case 'tr':
        return (
          <>
            <span>En iyi </span>
            <span className="text-[#690d89]">destinasyonlar </span>
            <span>sizin için</span>
          </>
        );
      default: // English and fallback
        return (
          <>
            <span>Top </span>
            <span className="text-[#690d89]">destinations </span>
            <span>for you</span>
          </>
        );
    }
  };

  // Get the appropriate "Starting from" text based on the current language
  const getStartingFromText = () => {
    switch(i18n.language) {
      case 'sq':
        return "Duke filluar nga";
      case 'fr':
        return "À partir de";
      case 'de':
        return "Ab";
      case 'tr':
        return "Başlangıç fiyatı";
      default: // English and fallback
        return "Starting from";
    }
  };

  if (loading || isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#690d89]"></div>
      </div>
    );
  }

  if (topDestinations.length === 0) {
    return null;
  }

  return (
    <div className="mt-16">
      {/* Section Header */}
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-3xl sm:text-[48px] font-bold">
          {getTitleText()}
        </h2>
      </div>

      {/* Destination Cards Grid */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8"
          >
            {getCurrentPageItems().map((country, index) => (
              <motion.div
                key={country.code}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/country/${country.code.toLowerCase()}`}>
                  <div className="group relative overflow-hidden rounded-2xl bg-white p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                    <div className="relative h-48 overflow-hidden rounded-xl mb-4">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                      <img
                        src={country.coverimage || `https://source.unsplash.com/800x600/?${country.name},landmarks`}
                        alt={country.translations?.[i18n.language]?.name || country.name}
                        className="w-full h-full object-cover"
                        loading="eager"
                        fetchpriority="high"
                        decoding="sync"
                        width="400"
                        height="300"
                      />
                      
                      <div className="absolute top-4 right-4 z-20">
                        <div className="w-16 h-16 rounded-full overflow-hidden shadow-lg ring-2 ring-white/20">
                          <img 
                            src={`https://flagcdn.com/${country.code.toLowerCase()}.svg`}
                            alt={country.code}
                            className="w-full h-full object-cover"
                            loading="eager"
                            fetchpriority="high"
                          />
                        </div>
                      </div>

                      <div className="absolute bottom-4 left-4 right-4 z-20">
                        <h3 className="text-2xl font-bold text-white mb-2">
                          {country.translations?.[i18n.language]?.name || country.name}
                        </h3>
                      </div>
                    </div>

                    {country.starting_price && (
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-sm text-gray-500">{getStartingFromText()}</span>
                        <span className="text-lg font-bold text-[#690d89]">{country.starting_price}</span>
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Dots */}
        {totalPages > 1 && (
          <NavigationDots 
            total={totalPages}
            current={currentPage}
            onChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}