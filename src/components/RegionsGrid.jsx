import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Flag from 'react-world-flags';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/cms';
import { useTranslationLoader } from '../i18n/hooks/useTranslationLoader';
import TranslatedText from './TranslatedText';
import { useComboPackages } from '../hooks/useData';

const FlagGroup = ({ countries, maxVisible = 8 }) => {
  const [showAll, setShowAll] = useState(false);
  const visibleCountries = showAll ? countries : countries.slice(0, maxVisible);
  const remainingCount = countries.length - maxVisible;

  return (
    <div className="flex flex-wrap gap-1 sm:gap-2">
      {visibleCountries.map((country) => (
        <motion.div
          key={country.code}
          whileHover={{ scale: 1.1 }}
          className="relative group"
        >
          <div className="w-8 h-6 sm:w-10 sm:h-7 overflow-hidden rounded-lg shadow-sm">
            <Flag 
              code={country.code} 
              className="w-full h-full object-cover"
              loading="lazy"
              width="40"
              height="28"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <span className="text-white text-xs font-medium">{country.name}</span>
            </div>
          </div>
        </motion.div>
      ))}
      {!showAll && remainingCount > 0 && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAll(true)}
          className="w-8 h-6 sm:w-10 sm:h-7 bg-[#FFCC00] text-[#013D91] rounded-lg text-xs sm:text-sm font-bold hover:bg-white transition-colors duration-300 flex items-center justify-center shadow-lg"
        >
          +{remainingCount}
        </motion.button>
      )}
    </div>
  );
};

export default function RegionsGrid() {
  const { t } = useTranslation();
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { packages, loading: packagesLoading } = useComboPackages();
  
  // Load the region namespace
  const { isLoading } = useTranslationLoader(['region']);

  useEffect(() => {
    const loadRegions = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('cms_regions')
          .select('*')
          .order('name');

        if (error) throw error;
        setRegions(data || []);
      } catch (err) {
        console.error('Error loading regions:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadRegions();
  }, []);

  // Group packages by region
  const packagesByRegion = React.useMemo(() => {
    if (packagesLoading || !packages.length) return {};
    
    return packages.reduce((acc, pkg) => {
      if (pkg.region) {
        if (!acc[pkg.region]) {
          acc[pkg.region] = [];
        }
        acc[pkg.region].push(pkg);
      }
      return acc;
    }, {});
  }, [packages, packagesLoading]);

  if (loading || isLoading || packagesLoading) {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {regions.map((region) => {
        // Get packages for this region
        const regionPackages = packagesByRegion[region.name] || [];
        // Get minimum price from packages
        const minPrice = regionPackages.length > 0 
          ? Math.min(...regionPackages.map(p => parseFloat(p.price) || 0)).toFixed(2)
          : null;
        
        return (
          <Link 
            key={region.name}
            to={region.explore_packages_url || `/region/${region.name.toLowerCase()}`}
            className="block h-full"
          >
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">{region.name}</h3>
                <span className="text-sm text-gray-500">
                  <TranslatedText 
                    textKey="region.countries.count" 
                    namespace="region" 
                    fallback={`${region.countries?.length || 0} Countries`}
                    options={{ count: region.countries?.length || 0 }}
                  />
                </span>
              </div>

              <div className="flex-grow mb-4">
                <FlagGroup countries={region.countries || []} maxVisible={8} />
              </div>

              {/* Show packages count if available */}
              {regionPackages.length > 0 && (
                <div className="mt-2 mb-4 bg-[#690d89]/5 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{regionPackages.length} packages available</span>
                    {minPrice && (
                      <span className="font-bold text-[#690d89]">From €{minPrice}</span>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-auto flex items-center text-[#690d89] font-medium">
                <TranslatedText 
                  textKey="region.explore.packages" 
                  namespace="region" 
                  fallback="Explore packages"
                />
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.div>
          </Link>
        );
      })}
    </div>
  );
}