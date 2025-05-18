import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Container from './Container';
import TranslatedText from './TranslatedText';

const TabNavigation = ({ tabs }) => {
  const location = useLocation();
  const [hoveredTab, setHoveredTab] = useState(null);
  const { t, i18n } = useTranslation();
  
  // Find active tab based on current path
  const activeTabIndex = tabs.findIndex(tab => 
    location.pathname === tab.path || 
    (tab.path !== '/' && location.pathname.startsWith(tab.path))
  );

  // Function to get translated tab name
  const getTranslatedTabName = (tab) => {
    if (tab.translationKey) {
      // Get translation based on current language
      const translations = {
        en: {
          'tab.europe': 'Europe +',
          'tab.local': 'Local',
          'tab.regions': 'Regions'
        },
        de: {
          'tab.europe': 'Europa +',
          'tab.local': 'Lokal',
          'tab.regions': 'Regionen'
        },
        fr: {
          'tab.europe': 'Europe +',
          'tab.local': 'Local',
          'tab.regions': 'Régions'
        },
        sq: {
          'tab.europe': 'Evropa +',
          'tab.local': 'Lokal',
          'tab.regions': 'Rajonet'
        },
        tr: {
          'tab.europe': 'Avrupa +',
          'tab.local': 'Yerel',
          'tab.regions': 'Bölgeler'
        }
      };
      
      // Return translation for current language or fallback to English
      return translations[i18n.language]?.[tab.translationKey] || 
             translations['en'][tab.translationKey] || 
             tab.name;
    }
    
    return tab.name;
  };

  return (
    <div className="relative bg-gradient-to-b from-white via-gray-50 to-white py-0">
      <Container>
        <div className="flex space-x-2 sm:space-x-4 rounded-xl sm:rounded-2xl bg-white/80 backdrop-blur-sm p-2 sm:p-4 max-w-3xl mx-auto shadow-lg border-2 border-[#690d89]/20">
          {tabs.map((tab, index) => (
            <Link
              key={tab.name}
              to={tab.path}
              className="relative flex-1"
              onMouseEnter={() => setHoveredTab(index)}
              onMouseLeave={() => setHoveredTab(null)}
            >
              <div 
                className={`relative z-10 py-3 px-4 rounded-lg text-center transition-colors duration-300 ${
                  activeTabIndex === index 
                    ? 'text-white' 
                    : 'text-gray-600 hover:text-[#690d89]'
                }`}
              >
                <span className="font-medium">
                  {getTranslatedTabName(tab)}
                </span>
              </div>
              
              {/* Active tab indicator */}
              {activeTabIndex === index && (
                <motion.div
                  layoutId="activeTabBackground"
                  className="absolute inset-0 bg-[#690d89] rounded-lg shadow-md"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  style={{ 
                    background: 'linear-gradient(135deg, #690d89 0%, #8B5CF6 100%)' 
                  }}
                />
              )}
              
              {/* Hover effect for inactive tabs */}
              {hoveredTab === index && activeTabIndex !== index && (
                <motion.div
                  layoutId="hoverBackground"
                  className="absolute inset-0 bg-[#690d89]/5 rounded-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default TabNavigation;