import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useCountries } from '../../hooks/useData';
import CountryCard from '../../components/CountryCard';
import SEO from '../../components/SEO';
import { useTranslationLoader } from '../../i18n/hooks/useTranslationLoader';

export default function PopularDestinations() {
  const { t } = useTranslation();
  const { countries, loading } = useCountries({ status: 'active', topDestination: true });
  const { isLoading } = useTranslationLoader(['destinations', 'country']);
  
  // Filter top destinations
  const topDestinations = countries.filter(country => country.top_destination);

  // Prepare schema markup for popular destinations
  const destinationsSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": topDestinations.map((country, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "TouristDestination",
        "name": country.name,
        "description": country.description,
        "touristType": ["Mobile Data Users", "International Travelers", "Digital Nomads"],
        "amenityFeature": [
          {
            "@type": "LocationFeatureSpecification",
            "name": "eSIM Coverage",
            "value": true
          },
          {
            "@type": "LocationFeatureSpecification",
            "name": "4G/5G Network",
            "value": true
          }
        ],
        "availableLanguage": country.languages,
        "currencyAccepted": country.currency,
        "priceRange": country.starting_price || "€€",
        "image": country.coverimage,
        "telephone": country.emergency_number
      }
    }))
  };

  if (loading || isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#690d89]"></div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title={t('popular.destinations.seo.title', 'Popular Travel Destinations with eSIM Coverage - KudoSIM')}
        description={t('popular.destinations.seo.description', 'Discover our most popular travel destinations with reliable eSIM coverage. Get instant mobile data access in top countries worldwide. Compare plans, prices, and network coverage to stay connected during your travels.')}
        schema={destinationsSchema}
      />
      
      <div className="min-h-screen bg-gradient-to-b from-[#690d89]/5 to-white pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6"
            >
              {t('popular.destinations.title', 'Popular Destinations')}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-600"
            >
              {t('popular.destinations.subtitle', 'Most visited countries with reliable eSIM coverage. Get instant mobile data access and stay connected during your travels.')}
            </motion.p>
          </div>

          {/* Countries Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {topDestinations.map((country) => (
              <CountryCard key={country.code} country={country} />
            ))}
          </div>

          {/* Empty State */}
          {!loading && topDestinations.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900">{t('popular.destinations.empty.title', 'No destinations found')}</h3>
              <p className="mt-2 text-sm text-gray-500">{t('popular.destinations.empty.description', 'Please check back later for updates')}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}