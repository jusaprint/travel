import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import OperatorLogos from './OperatorLogos';
import { cms } from '../lib/cms';
import { useTranslationLoader } from '../i18n/hooks/useTranslationLoader';
import TranslatedText from './TranslatedText';
import { getOptimizedVariants } from './motion-config';
import Container from './Container';

// Optimized animation variants
const fadeInVariants = getOptimizedVariants({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 }
});

// Feature card component with reduced animations
const FeatureCard = ({ title, description, icon, index, bgColor, iconColor }) => {
  const { t } = useTranslation('features');

  return (
    <motion.div
      variants={fadeInVariants}
      initial="initial"
      whileInView="whileInView"
      viewport={{ once: true }}
      whileHover={{ y: -3 }}
      className={`relative backdrop-blur-sm rounded-[32px] p-4 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 group ${bgColor}`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.15] rounded-[32px]" />
      
      {/* Content */}
      <div className="relative">
        {/* Icon */}
        <div className="w-16 h-16 sm:w-24 sm:h-24 mb-4 sm:mb-6 relative">
          {/* Icon Background */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 via-white/5 to-transparent"></div>
          
          {/* Icon */}
          <div className="absolute inset-0 flex items-center justify-center text-[#690d89]">
            <div className="w-8 h-8 sm:w-12 sm:h-12">
              {icon}
            </div>
          </div>
        </div>

        <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#690d89] transition-colors">
          {t(title)}
        </h3>
        <p className="hidden sm:block text-gray-600 group-hover:text-gray-700 transition-colors">
          {t(description)}
        </p>
      </div>
    </motion.div>
  );
};

const PhoneMockup = () => {
  const { t } = useTranslation('features');

  return (
    <motion.div
      variants={fadeInVariants}
      initial="initial"
      whileInView="whileInView"
      viewport={{ once: true }}
      className="relative w-full max-w-[400px] mx-auto"
    >
      {/* Phone Frame */}
      <div className="relative rounded-[48px] overflow-hidden bg-white shadow-2xl">
        {/* Screen Content */}
        <div className="relative">
          {/* Header Image */}
          <div className="relative aspect-[2/1] overflow-hidden">
            <img 
              src="/kudosim-travel.jpeg"
              alt="Europe landscape"
              className="w-full h-full object-cover"
              loading="lazy"
              width="400"
              height="200"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />
            
            {/* Data Circle */}
            <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-white shadow-lg flex flex-col items-center justify-center">
              <div className="text-xl font-bold text-[#690d89]">15 GB</div>
              <div className="text-xs text-gray-500">60 days</div>
            </div>
          </div>

          {/* Quick Purchase Section */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{t('quickPurchase')}</h3>
              <a href="#" className="text-[#690d89] text-sm">{t('seeAllPacks')}</a>
            </div>
            
            <div className="flex gap-4">
              <button className="flex-1 bg-[#690d89] text-white rounded-full py-2 px-4">
                1GB EURO 1.99
              </button>
              <button className="flex-1 bg-[#690d89] text-white rounded-full py-2 px-4">
                3GB EURO 6.50
              </button>
            </div>
          </div>

          {/* Status Section */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium">{t('yourEsim')}</div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-[#690d89]/10 text-[#690d89] text-xs font-medium rounded-full">
                  {t('installed')}
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  {t('esimOn')}
                </span>
              </div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-3 text-sm">
              <div className="flex items-center gap-2 text-green-800">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Keep roaming, KudoSIM
              </div>
              <div className="text-green-600 text-xs mt-1">
                {t('enjoyingServices')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function Features() {
  const { t } = useTranslation('features');
  const [featuresData, setFeaturesData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Load the components namespace
  const { isLoading } = useTranslationLoader(['features']);

  useEffect(() => {
    const loadFeatures = async () => {
      try {
        // Set default features data
        setFeaturesData([
          {
            title: 'coverage.title',
            description: 'coverage.description',
            icon: (
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ),
            bgColor: 'bg-[#e3deff]',
            iconColor: 'text-[#3320a2]'
          },
          {
            title: 'support.title',
            description: 'support.description',
            icon: (
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            ),
            bgColor: 'bg-[#f7fbee]',
            iconColor: 'text-[#309194]'
          },
          {
            title: 'lounge.title',
            description: 'lounge.description',
            icon: (
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            ),
            bgColor: 'bg-[#fef4db]',
            iconColor: 'text-[#f7b613]'
          },
          {
            title: 'bills.title',
            description: 'bills.description',
            icon: (
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ),
            bgColor: 'bg-[#cfd3fe]',
            iconColor: 'text-[#3847ff]'
          }
        ]);
      } catch (error) {
        console.error('Error loading features data:', error);
      }
    };

    loadFeatures();
  }, []);

  return (
    <div className="relative py-24 w-full overflow-hidden content-visibility-auto">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[#ffffff]" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.15]" />
      </div>

      <Container>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Features */}
          <div className="grid grid-cols-2 gap-6">
            {featuresData.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                {...feature}
                index={index}
              />
            ))}
          </div>

          {/* Right Column - Phone Mockup */}
          <div className="lg:pl-12">
            <PhoneMockup />
          </div>
        </div>
      </Container>
    </div>
  );
}