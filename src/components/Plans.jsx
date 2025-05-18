import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useComboPackages } from '../hooks/useData';
import ComboPackageCard from './ComboPackageCard';
import Container from './Container';

export default function Plans() {
  const { t, i18n } = useTranslation(['button', 'plans']);
  const [selectedPlan, setSelectedPlan] = useState('europe');
  const { packages, loading } = useComboPackages();
  const [visiblePackages, setVisiblePackages] = useState(3); // Initially show 3 packages
  
  // Filter packages by region
  const filteredPackages = packages.filter(pkg => 
    pkg.region.toLowerCase() === selectedPlan.toLowerCase()
  );

  // Get the packages to display based on the current visibility limit
  const packagesToShow = filteredPackages.slice(0, visiblePackages);
  
  // Check if there are more packages to load
  const hasMorePackages = visiblePackages < filteredPackages.length;

  // Function to load more packages
  const handleLoadMore = () => {
    setVisiblePackages(prev => prev + 3); // Load 3 more packages
  };

  // Get the appropriate "Load More" text based on the current language
  const getLoadMoreText = () => {
    switch(i18n.language) {
      case 'sq':
        return "Ngarko më Shumë";
      case 'fr':
        return "Charger Plus";
      case 'de':
        return "Mehr laden";
      case 'tr':
        return "Daha Fazla Yükle";
      default: // English and fallback
        return "Load More";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#690d89]"></div>
      </div>
    );
  }

  return (
    <Container>
      {/* Plans Grid - Show 3 items per row on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
        {packagesToShow.map((pkg) => (
          <ComboPackageCard
            key={pkg.id}
            plan={selectedPlan}
            package={pkg}
          />
        ))}
        
        {/* Empty State */}
        {filteredPackages.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white rounded-2xl shadow-lg">
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
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900">No packages found</h3>
            <p className="mt-2 text-sm text-gray-500">
              Please check back later for new packages
            </p>
          </div>
        )}
      </div>

      {/* Load More Button */}
      {hasMorePackages && (
        <div className="flex justify-center mt-8 mb-8">
          <motion.button
            onClick={handleLoadMore}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-[#690d89] text-white rounded-xl font-medium hover:bg-[#8B5CF6] transition-colors duration-300 shadow-lg flex items-center gap-2"
          >
            {t('load.more', getLoadMoreText())}
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.button>
        </div>
      )}
    </Container>
  );
}