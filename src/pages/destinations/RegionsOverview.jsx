import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../lib/cms';
import SEO from '../../components/SEO';
import { useTranslationLoader } from '../../i18n/hooks/useTranslationLoader';

const RegionCard = ({ region }) => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="relative overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-xl transition-all duration-300"
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
        <img 
          src={region.coverimage || `https://source.unsplash.com/800x600/?${region.name},landscape`}
          alt={`${region.name} travel destinations`}
          className="w-full h-full object-cover"
        />
        
        {/* Region Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-6">
          <h3 className="text-2xl font-bold text-white mb-2">{region.name}</h3>
          <div className="flex items-center gap-2 text-white/90">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{t('region.countries.count', { count: region.countries?.length || 0 })}</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        <p className="text-gray-600 mb-6 line-clamp-2">{region.description}</p>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-[#690d89]/5 rounded-xl p-3">
            <div className="text-sm text-gray-500">{t('region.coverage')}</div>
            <div className="text-xl font-bold text-[#690d89]">
              {region.countries?.length || 0} {t('region.countries')}
            </div>
          </div>
          {region.starting_price && (
            <div className="bg-[#690d89]/5 rounded-xl p-3">
              <div className="text-sm text-gray-500">{t('region.starting.from')}</div>
              <div className="text-xl font-bold text-[#690d89]">
                {region.starting_price}
              </div>
            </div>
          )}
        </div>

        {/* CTA Button */}
        <motion.a
          href={region.explore_packages_url || '#'}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="block w-full text-center bg-[#690d89] text-white py-3 rounded-xl font-medium hover:bg-[#8B5CF6] transition-colors duration-300"
        >
          {t('region.explore.packages')}
        </motion.a>
      </div>
    </motion.div>
  );
};

export default function RegionsOverview() {
  const { t } = useTranslation();
  const [regions, setRegions] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const { isLoading } = useTranslationLoader(['regions', 'region']);

  React.useEffect(() => {
    const loadRegions = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('cms_regions')
          .select('*')
          .order('name');

        if (error) throw error;
        setRegions(data || []);
      } catch (error) {
        console.error('Error loading regions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRegions();
  }, []);

  // Prepare schema markup for regions
  const regionsSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": regions.map((region, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "TouristDestination",
        "name": region.name,
        "description": region.description,
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
        "numberOfCountries": region.countries?.length || 0,
        "priceRange": region.starting_price || "€€",
        "image": region.coverimage
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
        title={t('regions.seo.title', 'Global eSIM Coverage Regions - KudoSIM Travel Data')}
        description={t('regions.seo.description', 'Explore our comprehensive eSIM coverage across major global regions. Find reliable mobile data plans for Europe, Asia, Americas, and more. Compare prices, features, and network coverage to stay connected worldwide with KudoSIM.')}
        schema={regionsSchema}
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
              {t('regions.title', 'Global Coverage Regions')}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-600"
            >
              {t('regions.subtitle', 'Find the perfect data plan for your destination with comprehensive regional coverage. Access reliable mobile data across entire regions with a single eSIM.')}
            </motion.p>
          </div>

          {/* Regions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regions.map((region) => (
              <RegionCard key={region.id} region={region} />
            ))}
          </div>

          {/* Empty State */}
          {!loading && regions.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900">{t('regions.empty.title', 'No regions found')}</h3>
              <p className="mt-2 text-sm text-gray-500">{t('regions.empty.description', 'Please check back later for updates')}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}