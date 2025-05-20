// src/pages/CountryPage.jsx
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

// You’ll need to import these or define them elsewhere in your project:
import BenefitCard from '../components/BenefitCard';
import { getBenefits } from '../lib/benefits';

// Network info card component
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
          {badge === t('most.popular', 'Most Popular') && <span>🔥</span>}
          {badge === t('best.value', 'Best Value') && <span>🏆</span>}
          {badge}
        </div>
      </div>
    )}
    <div className="p-4">
      <div className="text-center mt-6">
        <h3 className="text-3xl font-bold text-gray-900 mb-2">
          {pkg.name.match(/\d+/)?.[0] || '0'}GB
        </h3>
        <div className="text-sm text-gray-500 mb-4">
          {t('valid.for', 'Valid for')} {pkg.validity_days} {t('days', 'days')}
        </div>
      </div>
      <div className="text-center border-t pt-4 mt-2">
        <p className="text-2xl font-bold text-gray-900">
          ${Number(pkg.price).toFixed(2)}
        </p>
      </div>
    </div>
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
    {features.map((feature, idx) => (
      <div key={idx} className="flex items-start">
        <svg className="w-5 h-5 text-[#6a0dad] flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <p className="ml-3 text-gray-700">{feature}</p>
      </div>
    ))}
  </div>
);

// Animated QuickCard
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
  { title: 'Support', description: '24/7 help whenever you need it.', icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )
  },
  { title: 'Setup', description: 'Install your eSIM in minutes.', icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  },
  { title: 'Global', description: 'One eSIM works worldwide.', icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  // … add more if needed
];

export default function CountryPage() {
  const { countryCode } = useParams();
  const [activeTab, setActiveTab] = useState('features');
  const [selectedPackage, setSelectedPackage] = useState(null);
  const { t, i18n } = useTranslation(['country', 'package']);
  useTranslationLoader(['country', 'package']);

  const { country, loading: countryLoading, error: countryError } = useCountry(countryCode);
  const { packages, loading: packagesLoading, error: packagesError } = usePackages({ countryCode });

  useEffect(() => { window.scrollTo(0, 0); }, []);

  // Helpers
  const getTranslatedCountryName = () =>
    country?.translations?.[i18n.language]?.name || country?.name || '';
  const getTranslatedCountryDescription = () =>
    country?.translations?.[i18n.language]?.description || country?.description || '';
  const getLowestPrice = () =>
    packages?.length ? Math.min(...packages.map(p => Number(p.price))).toFixed(2) : null;
  const getSubtitleText = () => {
    const name = getTranslatedCountryName();
    switch (i18n.language) {
      case 'sq': return `Downloadable ${name} SIM card with prepaid data`;
      case 'fr': return `Carte SIM téléchargeable ${name} avec données prépayées`;
      case 'de': return `Herunterladbare ${name} SIM-Karte mit vorausbezahlten Daten`;
      case 'tr': return `Ön ödemeli veriye sahip indirilebilir ${name} SIM kartı`;
      default: return `Downloadable ${name} SIM card with prepaid data`;
    }
  };

  if (countryLoading || packagesLoading) {
    return (
      <div className="min-h-screen bg-[#f9f9ff] pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6a0dad]" />
      </div>
    );
  }
  if (countryError || packagesError || !country) {
    return (
      <div className="min-h-screen bg-[#f9f9ff] pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('error', 'Error')}</h2>
          <p className="text-gray-600 mb-4">
            {t('not.found', "The country you're looking for doesn't exist or is not available.")}
          </p>
          <Link to="/destinations" className="inline-flex items-center text-[#6a0dad] hover:text-[#8B5CF6]">
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t('back', 'Back to Destinations')}
          </Link>
        </div>
      </div>
    );
  }

  // Build schema for SEO
  const countrySchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${getTranslatedCountryName()} eSIM Data Plan`,
    "description": getTranslatedCountryDescription(),
    "brand": { "@type": "Brand", "name": "KudoSIM" },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "USD",
      "lowPrice": packages.length ? Math.min(...packages.map(p => Number(p.price))) : 9.99,
      "highPrice": packages.length ? Math.max(...packages.map(p => Number(p.price))) : 29.99,
      "offerCount": packages.length,
      "availability": "https://schema.org/InStock"
    },
    "image": country.coverimage
  };

  return (
    <>
      <SEO
        title={`${getTranslatedCountryName()} eSIM Data Plans - KudoSIM`}
        description={`Get reliable mobile data for ${getTranslatedCountryName()} with KudoSIM eSIM...`}
        schema={countrySchema}
      />

      <div className="flex flex-col min-h
