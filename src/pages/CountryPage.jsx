import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Flag from 'react-world-flags';
import { useCountry, usePackages } from '../hooks/useData';
import { useTranslation } from 'react-i18next';
import { useTranslationLoader } from '../i18n/hooks/useTranslationLoader';
import SEO from '../components/SEO';
import Container from '../components/Container';
import AppDownloadCTA from '../components/AppDownloadCTA';

// Network info card component with improved styling to match the screenshot
const NetworkInfoCard = ({ icon, label, value }) => (
  <div className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm">
    <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-[#f3e9ff] text-[#6a0dad]">
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium text-gray-900">{value}</p>
    </div>
  </div>
);

// Tab button component
const TabButton = ({ active, children, onClick }) => (
  <button
    onClick={onClick}
    className={`px-6 py-4 text-base font-medium transition-all duration-300 border-b-2 ${
      active 
        ? 'text-[#6a0dad] border-[#6a0dad]' 
        : 'text-gray-500 border-transparent hover:text-[#6a0dad] hover:border-gray-200'
    }`}
  >
    {children}
  </button>
);

// Package card component
const PackageCard = ({ pkg, badge, t, isSelected, onSelect }) => (
  <div 
    className={`relative bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer ${
      isSelected ? 'ring-2 ring-[#6a0dad] shadow-lg' : 'border border-gray-200'
    }`}
    onClick={() => onSelect(pkg)}
  >
    {badge && (
      <div className={`absolute top-0 left-0 right-0 py-2 px-4 ${
        badge === t('most.popular', 'Most Popular') 
          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' 
          : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
      }`}>
        <div className="flex items-center justify-center gap-2 text-sm font-medium">
          {badge === t('most.popular', 'Most Popular') && (
            <span className="text-white">🔥</span>
          )}
          {badge === t('best.value', 'Best Value') && (
            <span className="text-white">🏆</span>
          )}
          {badge}
        </div>
      </div>
    )}

    <div className="p-4">
      {/* Data amount with more spacing */}
      <div className="text-center mt-6">
        <h3 className="text-3xl font-bold text-gray-900 mb-2">
          {pkg.name.match(/\d+/)?.[0] || '0'}GB
        </h3>
        <div className="text-sm text-gray-500 mb-4">
          {t('valid.for', 'Valid for')} {pkg.validity_days} {t('days', 'days')}
        </div>
      </div>

      {/* Price */}
      <div className="text-center border-t pt-4 mt-2">
        <p className="text-2xl font-bold text-gray-900">
          ${Number(pkg.price).toFixed(2)}
        </p>
      </div>
    </div>

    {/* Selected checkmark */}
    {isSelected && (
      <div className="absolute top-2 right-2 w-6 h-6 bg-[#6a0dad] rounded-full flex items-center justify-center">
        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
    )}
  </div>
);

// Features list component
const FeaturesList = ({ features }) => (
  <div className="space-y-4">
    {features.map((feature, index) => (
      <div key={index} className="flex items-start">
        <div className="flex-shrink-0 mt-1">
          <svg className="w-5 h-5 text-[#6a0dad]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-gray-700">{feature}</p>
        </div>
      </div>
    ))}
  </div>
);


// Animated card component for quick highlights
const QuickCard = ({ icon, title, description }) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300"
  >
    <motion.div
      className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center text-white bg-gradient-to-br from-[#690d89] to-[#8B5CF6] shadow"
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
    >
      {icon}
    </motion.div>
    <h4 className="text-lg font-bold text-gray-900 mb-1">{title}</h4>
    <p className="text-sm text-gray-600">{description}</p>
  </motion.div>
);

const quickFeatures = [
  {
    title: 'Support',
    description: '24/7 help whenever you need it.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )
  },
  {
    title: 'Setup',
    description: 'Install your eSIM in minutes.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  },
  {
    title: 'Global',
    description: 'One eSIM works worldwide.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    title: 'Alerts',
    description: 'Usage notifications keep you informed.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  },
  {
    title: 'Secure',
    description: 'Privacy protected with encryption.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    )
  },
  {
    title: 'Plans',
    description: 'Local or global options available.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    )
  }
];

export default function CountryPage() {
  const { countryCode } = useParams();
  const [activeTab, setActiveTab] = useState('features');
  const [selectedPackage, setSelectedPackage] = useState(null);
  const { t, i18n } = useTranslation(['country', 'package']);
  
  // Load the necessary translation namespaces
  const { isLoading: translationsLoading } = useTranslationLoader(['country', 'package']);
  
  const { country, loading: countryLoading, error: countryError } = useCountry(countryCode);
  const { packages, loading: packagesLoading, error: packagesError } = usePackages({ 
    countryCode: countryCode 
  });

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Get translated country name and description
  const getTranslatedCountryName = () => {
    if (!country) return '';
    return country.translations?.[i18n.language]?.name || country.name;
  };

  const getTranslatedCountryDescription = () => {
    if (!country) return '';
    return country.translations?.[i18n.language]?.description || country.description;
  };

  // Get the lowest price from packages
  const getLowestPrice = () => {
    if (!packages || packages.length === 0) return null;
    const prices = packages.map(pkg => Number(pkg.price));
    return Math.min(...prices).toFixed(2);
  };

  // Get multilingual subtitle text
  const getSubtitleText = () => {
    const countryName = getTranslatedCountryName();
    
    switch(i18n.language) {
      case 'sq':
        return `Downloadable ${countryName} SIM card with prepaid data`;
      case 'fr':
        return `Carte SIM téléchargeable ${countryName} avec données prépayées`;
      case 'de':
        return `Herunterladbare ${countryName} SIM-Karte mit vorausbezahlten Daten`;
      case 'tr':
        return `Ön ödemeli veriye sahip indirilebilir ${countryName} SIM kartı`;
      default: // English and fallback
        return `Downloadable ${countryName} SIM card with prepaid data`;
    }
  };

  // Handle package selection
  const handleSelectPackage = (pkg) => {
    setSelectedPackage(pkg);
  };


  // Prepare schema markup for SEO
  const countrySchema = country ? {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${getTranslatedCountryName()} eSIM Data Plan`,
    "description": getTranslatedCountryDescription(),
    "brand": {
      "@type": "Brand",
      "name": "KudoSIM"
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "USD",
      "lowPrice": packages.length > 0 ? Math.min(...packages.map(p => Number(p.price))) : 9.99,
      "highPrice": packages.length > 0 ? Math.max(...packages.map(p => Number(p.price))) : 29.99,
      "offerCount": packages.length,
      "availability": "https://schema.org/InStock"
    },
    "image": country.coverimage
  } : null;

  if (countryLoading || packagesLoading || translationsLoading) {
    return (
      <div className="min-h-screen bg-[#f9f9ff] pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6a0dad]"></div>
      </div>
    );
  }

  if (countryError || packagesError || !country) {
    return (
      <div className="min-h-screen bg-[#f9f9ff] pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('error', 'Error')}</h2>
          <p className="text-gray-600 mb-4">{t('not.found', 'The country you\'re looking for doesn\'t exist or is not available.')}</p>
          <Link 
            to="/destinations" 
            className="inline-flex items-center text-[#6a0dad] hover:text-[#8B5CF6]"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t('back', 'Back to Destinations')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title={`${getTranslatedCountryName()} eSIM Data Plans - KudoSIM`}
        description={`Get reliable mobile data for ${getTranslatedCountryName()} with KudoSIM eSIM. Choose from multiple data plans, enjoy fast 4G/5G speeds, and stay connected during your travels.`}
        schema={countrySchema}
      />
      
      <div className="flex flex-col min-h-screen bg-[#f9f9ff]">
        {/* Breadcrumb navigation */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-[#6a0dad]">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </Link>
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link to="/countries" className="text-gray-500 hover:text-[#6a0dad]">
              Countries
            </Link>
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900">{getTranslatedCountryName()}</span>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-grow">
          <div className="max-w-7xl mx-auto px-4 py-8 space-y-10 md:space-y-16">
            {/* Country header */}
            <div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <Flag 
                    code={country.code} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">
                    <span>Get a local </span>
                    <span className="text-[#6a0dad]">{getTranslatedCountryName()}</span>
                    <span> eSIM </span>
                    <Flag 
                      code={country.code} 
                      className="inline-block w-8 h-8 rounded-full ml-2 align-middle"
                    />
                  </h1>
                  <p className="text-gray-700 mt-1">{getSubtitleText()}</p>
                </div>
              </div>
            </div>


            {/* Packages grid - Updated to 4-per-row on desktop */}
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {t('select.data.package', 'Select Your Data Package')}
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {packages.map((pkg) => (
                <PackageCard
                  key={pkg.id}
                  pkg={pkg}
                  t={t}
                  isSelected={selectedPackage?.id === pkg.id}
                  onSelect={handleSelectPackage}
                  badge={
                    pkg.popular ? t('most.popular', 'Most Popular') :
                    pkg.best_value ? t('best.value', 'Best Value') :
                    null
                  }
                />
              ))}
            </div>

            <div className="space-y-10 md:space-y-16">
            {/* Features and Description Section */}
            <div>
              <div className="border-b border-gray-200 mb-6">
                <div className="flex space-x-8">
                  <TabButton 
                    active={activeTab === 'features'} 
                    onClick={() => setActiveTab('features')}
                  >
                    {t('features', 'Features')}
                  </TabButton>
                  <TabButton 
                    active={activeTab === 'description'} 
                    onClick={() => setActiveTab('description')}
                  >
                    {t('description', 'Description')}
                  </TabButton>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md">
                {activeTab === 'features' && (
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <svg className="w-5 h-5 text-[#6a0dad]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-gray-700">Prepaid data starting at just <strong>${getLowestPrice()}</strong></p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <svg className="w-5 h-5 text-[#6a0dad]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-gray-700">Includes a free international phone number. <a href="#" className="text-[#6a0dad] font-medium">Learn more</a>.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <svg className="w-5 h-5 text-[#6a0dad]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-gray-700">No surprise fees or roaming charges</p>
                      </div>
                    </div>
                    <FeaturesList features={country.features || [
                      "Unlimited data at high speeds",
                      "Tethering and hotspot included",
                      "Works with all eSIM compatible devices",
                      "Instant delivery via email",
                      "24/7 customer support"
                    ]} />
                  </div>
                )}

                {activeTab === 'description' && (
                  <div className="prose max-w-none">
                    <p className="text-gray-700">{getTranslatedCountryDescription() || `Stay connected in ${getTranslatedCountryName()} with our reliable eSIM service. Our ${getTranslatedCountryName()} eSIM provides fast and stable internet connectivity throughout your trip, with coverage across all major cities and tourist areas. Enjoy seamless data access for all your travel needs, from navigation and social media to video calls and streaming.`}</p>
                  </div>
                )}
              </div>
            </div>

            {/* App download call to action */}
            <div>
              <AppDownloadCTA />
            </div>

            {/* Quick feature highlights */}
            <div className="py-16">
              <Container>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {quickFeatures.map((item, idx) => (
                    <QuickCard
                      key={idx}
                      icon={item.icon}
                      title={item.title}
                      description={item.description}
                    />
                  ))}
                </div>
              </Container>
            </div>

          </div>
        </div>

        {/* Fixed Buy Now Button */}
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-4 z-50">
          <div className="max-w-7xl mx-auto">
            <button 
              className={`w-full py-4 rounded-xl font-medium text-lg transition-all duration-300 ${
                selectedPackage 
                  ? 'bg-gradient-to-r from-[#6a0dad] to-[#8B5CF6] hover:from-[#5a0c9d] hover:to-[#7B4CE6] text-white cursor-pointer shadow-lg' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!selectedPackage}
              onClick={() => selectedPackage && alert(`Processing purchase for ${selectedPackage.name} at $${selectedPackage.price}`)}
            >
              {selectedPackage 
                ? `Buy now – $${Number(selectedPackage.price).toFixed(2)}` 
                : 'Select a package above'}
            </button>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
