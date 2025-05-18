import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import Flag from 'react-world-flags';
import { cms } from '../lib/cms';
import { useTranslationLoader } from '../i18n/hooks/useTranslationLoader';
import TranslatedText from './TranslatedText';
import { getOptimizedVariants } from './motion-config';
import Container from './Container';

// Optimized animation variants
const fadeInVariants = getOptimizedVariants({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
});

const slideInVariants = getOptimizedVariants({
  initial: { x: '100%' },
  animate: { x: 0 },
  exit: { x: '100%' }
});

// Language Switcher Component
const LanguageSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { languages, currentLanguage, changeLanguage, isChangingLanguage } = useLanguage();
  const dropdownRef = useRef(null);
  
  const currentLang = languages.find(lang => lang.code === currentLanguage);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (langCode) => {
    if (isChangingLanguage || langCode === currentLanguage) return;
    
    setIsOpen(false);
    
    // Use requestAnimationFrame to defer the language change to the next frame
    // This prevents UI blocking during the language change
    requestAnimationFrame(() => {
      // Use setTimeout with 0ms delay to push the operation to the end of the event queue
      setTimeout(() => {
        changeLanguage(langCode);
      }, 0);
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        onClick={() => !isChangingLanguage && setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100/50 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={isChangingLanguage}
      >
        <div className="relative w-5 h-4 overflow-hidden rounded-sm shadow-sm">
          <Flag
            code={currentLang?.flag}
            className="w-full h-full object-cover"
            loading="lazy"
            width="20"
            height="16"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/5 to-transparent"></div>
        </div>
        <span className="text-sm font-medium text-gray-700">
          {currentLang?.code.toUpperCase()}
        </span>
        <motion.svg
          className="w-4 h-4 text-gray-400"
          animate={{ rotate: isOpen ? 180 : 0 }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </motion.svg>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={fadeInVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: "spring", duration: 0.3 }}
            className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-black/5 z-50"
          >
            <div className="py-1">
              {languages.map((language) => (
                <motion.button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  whileHover={{ x: 4 }}
                  disabled={isChangingLanguage}
                >
                  <div className="relative w-5 h-4 overflow-hidden rounded-sm shadow-sm">
                    <Flag
                      code={language.flag}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      width="20"
                      height="16"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/5 to-transparent"></div>
                  </div>
                  <span>{language.name}</span>
                  {currentLanguage === language.code && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto"
                    >
                      <svg className="w-4 h-4 text-[#690d89]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuItems, setMenuItems] = useState([
    { 
      id: '1',
      name: 'Destinations', 
      href: '/destinations', 
      icon: 'globe',
      order: 1,
      submenu: []
    },
    { 
      id: '2',
      name: 'For Business', 
      href: '/business', 
      icon: 'briefcase',
      order: 2,
      submenu: []
    },
    { 
      id: '3',
      name: 'Support', 
      href: '/support', 
      icon: 'support',
      order: 3,
      submenu: []
    },
    { 
      id: '4',
      name: 'My eSIMs', 
      href: '/my-esims', 
      icon: 'sim',
      order: 4,
      submenu: []
    }
  ]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const { settings } = useSettings();
  const { t, i18n } = useTranslation();
  const { languages, currentLanguage, changeLanguage, isChangingLanguage } = useLanguage();
  const menuItemsCache = useRef(null);
  
  // Load the necessary namespaces
  const { isLoading } = useTranslationLoader(['common']);

  // Load menu items from database
  useEffect(() => {
    const loadMenuItems = async () => {
      try {
        // Check if we have cached data
        if (menuItemsCache.current) {
          setMenuItems(menuItemsCache.current);
          return;
        }
        
        setLoading(true);
        const items = await cms.getMenuItems();
        if (items && items.length > 0) {
          // Cache the data
          menuItemsCache.current = items;
          setMenuItems(items);
        }
      } catch (error) {
        console.error('Error loading menu items:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadMenuItems();
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  // Get icon component based on icon name
  const getIcon = (iconName) => {
    const icons = {
      'globe': (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      'briefcase': (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      'support': (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      'sim': (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    };

    return icons[iconName] || icons.globe;
  };

  // Get translated menu item name based on current language
  const getTranslatedMenuName = (item) => {
    if (item.translations && item.translations[i18n.language]) {
      return item.translations[i18n.language].name;
    }
    
    // Fallback to English translation
    if (item.translations && item.translations.en) {
      return item.translations.en.name;
    }
    
    // Fallback to item name if no translations available
    return item.name;
  };

  return (
    <header 
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg' 
          : 'bg-white/80 backdrop-blur-sm'
      }`}
    >
      {/* Animated gradient border */}
      <div 
        className={`absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#690d89]/20 to-transparent transition-opacity duration-300 ${
          scrolled ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Main Navigation */}
      <Container className="flex items-center justify-between p-4">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <div className="flex items-center gap-2">
            <img 
              src="/kudosim-logo.svg"
              alt={settings?.site?.title || 'KudoSIM'}
              className="h-6 w-auto"
              width="120"
              height="24"
              fetchpriority="high"
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {menuItems.map((item) => (
            <div key={item.id} className="relative group">
              <Link
                to={item.href}
                className={`relative text-lg font-medium transition-colors duration-200 ${
                  isActive(item.href)
                    ? `text-[#690d89]`
                    : scrolled 
                      ? 'text-gray-600 hover:text-[#690d89]' 
                      : 'text-gray-900 hover:text-[#690d89]'
                }`}
              >
                {getTranslatedMenuName(item)}
                {isActive(item.href) && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#690d89]"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>

              {/* Submenu */}
              {item.submenu?.length > 0 && (
                <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="bg-white rounded-lg shadow-lg py-2 min-w-[200px]">
                    {item.submenu.map((subitem) => (
                      <Link
                        key={subitem.id}
                        to={subitem.href}
                        className={`block px-4 py-2 text-sm ${
                          isActive(subitem.href)
                            ? 'text-[#690d89] bg-[#690d89]/5'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {getTranslatedMenuName(subitem)}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Language Switcher - Only show on desktop */}
          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>

          {/* CTA Button */}
          <Link
            to="#"
            className="inline-flex items-center gap-2 text-white font-medium px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-sm shadow-lg transition-all duration-300"
            style={{ 
              backgroundColor: settings?.site?.primaryColor || '#690d89'
            }}
          >
            <span className="hidden sm:inline">
              <TranslatedText 
                textKey="Shop" 
                namespace="common" 
                fallback="Shop"
              />
            </span>{' '}
            <TranslatedText 
              textKey="Shop eSIMs" 
              namespace="common" 
              fallback="Shop eSIMs"
            />
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 rounded-lg hover:bg-gray-100/50 transition-colors ${
              scrolled ? 'text-gray-600' : 'text-gray-900'
            }`}
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
              />
            </svg>
          </button>
        </div>
      </Container>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              variants={fadeInVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              variants={slideInVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl z-50 md:hidden"
              style={{ height: '100dvh' }}
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                  <img 
                    src="/kudosim-logo.svg"
                    alt={settings?.site?.title || 'KudoSIM'}
                    className="h-6 w-auto"
                    width="120"
                    height="24"
                  />
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-lg text-gray-500 hover:text-[#690d89] hover:bg-[#690d89]/5"
                    aria-label="Close menu"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Language Switcher in Mobile Menu */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-500 mb-3">
                    <TranslatedText 
                      textKey="Select Language" 
                      namespace="common" 
                      fallback="Select Language"
                    />
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {languages.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => {
                          if (isChangingLanguage) return;
                          
                          // Use requestAnimationFrame to defer the language change to the next frame
                          requestAnimationFrame(() => {
                            setTimeout(() => {
                              changeLanguage(language.code);
                            }, 10);
                          });
                        }}
                        disabled={isChangingLanguage}
                        className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                          currentLanguage === language.code
                            ? 'bg-[#690d89] text-white'
                            : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                        } ${isChangingLanguage ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className="w-6 h-4 overflow-hidden rounded-sm shadow-sm">
                          <Flag 
                            code={language.flag} 
                            className="w-full h-full object-cover"
                            loading="lazy"
                            width="24"
                            height="16"
                          />
                        </div>
                        <span className="font-medium text-sm">{language.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto py-4">
                  {menuItems.map((item) => (
                    <React.Fragment key={item.id}>
                      <Link
                        to={item.href}
                        className={`flex items-center gap-3 px-4 py-3 text-lg font-medium ${
                          isActive(item.href)
                            ? 'text-[#690d89] bg-[#690d89]/5'
                            : 'text-gray-900 hover:bg-gray-50'
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        {getIcon(item.icon)}
                        {getTranslatedMenuName(item)}
                      </Link>

                      {/* Mobile Submenu */}
                      {item.submenu?.map((subitem) => (
                        <Link
                          key={subitem.id}
                          to={subitem.href}
                          className={`flex items-center gap-3 px-8 py-2 text-base ${
                            isActive(subitem.href)
                              ? 'text-[#690d89] bg-[#690d89]/5'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                          onClick={() => setIsOpen(false)}
                        >
                          {getIcon(subitem.icon)}
                          {getTranslatedMenuName(subitem)}
                        </Link>
                      ))}
                    </React.Fragment>
                  ))}
                </div>

                <div className="p-4 border-t border-gray-100">
                  <Link
                    to="#"
                    className="flex items-center justify-center gap-2 w-full bg-[#690d89] text-white font-medium px-6 py-3 rounded-xl shadow-lg hover:bg-[#8B5CF6] transition-all duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    <TranslatedText 
                      textKey="Shop eSIMs" 
                      namespace="common" 
                      fallback="Shop eSIMs"
                    />
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}