import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Flag from 'react-world-flags';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCountries } from '../../hooks/useData';
import { useTranslationLoader } from '../../i18n/hooks/useTranslationLoader';

export default function DestinationsCountries() {
  const [searchTerm, setSearchTerm] = useState('');
  const { countries, loading, error } = useCountries({ status: 'active' });
  const { t, i18n } = useTranslation(['search', 'button', 'country']);
  
  // Load the necessary namespaces
  const { isLoading } = useTranslationLoader(['search', 'button', 'country']);
  
  // Filter countries based on search and use translated names
  const filteredCountries = countries.filter(country => {
    const countryName = country.translations?.[i18n.language]?.name || country.name;
    return countryName.toLowerCase().includes(searchTerm.toLowerCase());
  });

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
          placeholder={i18n.language === 'en' ? "Search Countries..." : 
                       i18n.language === 'sq' ? "Kërko Vendet..." :
                       i18n.language === 'fr' ? "Rechercher des Pays..." :
                       i18n.language === 'de' ? "Länder suchen..." :
                       i18n.language === 'tr' ? "Ülkeleri Ara..." :
                       "Search Countries..."}
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

      {/* Countries Grid - Show All Countries */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCountries.map((country) => (
          <motion.div
            key={country.code}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
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
                    <Flag code={country.code} className="w-full h-full object-cover" />
                  </div>

                  {/* Country Info */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">
                      {country.translations?.[i18n.language]?.name || country.name}
                    </h3>
                    {country.starting_price && (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-500">
                          {i18n.language === 'en' ? "Starting from" : 
                           i18n.language === 'sq' ? "Duke filluar nga" :
                           i18n.language === 'fr' ? "À partir de" :
                           i18n.language === 'de' ? "Ab" :
                           i18n.language === 'tr' ? "Başlangıç fiyatı" :
                           "Starting from"}
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
      </div>

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
            {i18n.language === 'en' ? "No countries found" : 
             i18n.language === 'sq' ? "Nuk u gjetën vende" :
             i18n.language === 'fr' ? "Aucun pays trouvé" :
             i18n.language === 'de' ? "Keine Länder gefunden" :
             i18n.language === 'tr' ? "Ülke bulunamadı" :
             "No countries found"}
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            {searchTerm ? (
              i18n.language === 'en' ? "Try adjusting your search terms" : 
              i18n.language === 'sq' ? "Provoni të rregulloni termat e kërkimit" :
              i18n.language === 'fr' ? "Essayez d'ajuster vos termes de recherche" :
              i18n.language === 'de' ? "Versuchen Sie, Ihre Suchbegriffe anzupassen" :
              i18n.language === 'tr' ? "Arama terimlerinizi ayarlamayı deneyin" :
              "Try adjusting your search terms"
            ) : (
              i18n.language === 'en' ? "No countries found" : 
              i18n.language === 'sq' ? "Nuk u gjetën vende" :
              i18n.language === 'fr' ? "Aucun pays trouvé" :
              i18n.language === 'de' ? "Keine Länder gefunden" :
              i18n.language === 'tr' ? "Ülke bulunamadı" :
              "No countries found"
            )}
          </p>
        </div>
      )}
    </div>
  );
}