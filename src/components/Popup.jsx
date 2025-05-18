import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/cms';
import { useTranslationLoader } from '../i18n/hooks/useTranslationLoader';

// Retry configuration
const RETRY_COUNT = 3;
const INITIAL_RETRY_DELAY = 1000;
const MAX_RETRY_DELAY = 5000;

const DEFAULT_SETTINGS = {
  enabled: false,
  delay: 3000,
  background_image: '',
  translations: {
    en: { title: 'Get 1GB Free Internet!', description: 'Download our app now and enjoy 1GB of free data.' },
    sq: { title: 'Merrni 1GB Internet Falas!', description: 'Shkarkoni aplikacionin tonë tani dhe shijoni 1GB të dhëna falas.' },
    fr: { title: 'Obtenez 1GB d\'Internet Gratuit!', description: 'Téléchargez notre application maintenant et profitez de 1GB de données gratuites.' },
    de: { title: 'Erhalte 1GB kostenloses Internet!', description: 'Lade jetzt unsere App herunter und genieße 1GB kostenlose Daten.' },
    tr: { title: '1GB Ücretsiz İnternet Alın!', description: 'Şimdi uygulamamızı indirin ve 1GB ücretsiz veri keyfini çıkarın.' }
  },
  app_store_url: 'https://apps.apple.com/app/kudosim',
  play_store_url: 'https://play.google.com/store/apps/details?id=com.kudosim'
};

const retryWithExponentialBackoff = async (fn, retries = RETRY_COUNT, delay = INITIAL_RETRY_DELAY) => {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    
    await new Promise(resolve => setTimeout(resolve, delay));
    return retryWithExponentialBackoff(
      fn,
      retries - 1,
      Math.min(delay * 2, MAX_RETRY_DELAY)
    );
  }
};

const Popup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [popupSettings, setPopupSettings] = useState(DEFAULT_SETTINGS);
  const { t, i18n } = useTranslation('popup');
  const { isLoading } = useTranslationLoader(['popup']);

  useEffect(() => {
    const loadPopupSettings = async () => {
      try {
        // Check if we have cached settings
        const cachedSettings = sessionStorage.getItem('kudosim_popup_settings');
        if (cachedSettings) {
          const parsedSettings = JSON.parse(cachedSettings);
          setPopupSettings(parsedSettings);
          
          if (parsedSettings.enabled) {
            setTimeout(() => {
              setIsVisible(true);
            }, parsedSettings.delay || 3000);
          }
          return;
        }

        // Fetch from Supabase with retry logic
        const { data, error } = await retryWithExponentialBackoff(async () => {
          const response = await supabase
            .from('cms_settings')
            .select('value')
            .eq('key', 'popup')
            .maybeSingle(); // Use maybeSingle() instead of single() to handle no rows gracefully
          
          if (response.error && response.error.code !== 'PGRST116') {
            throw response.error;
          }
          return response;
        });

        // If we have data, use it; otherwise use default settings
        const settings = data?.value || DEFAULT_SETTINGS;
        
        // Cache the settings
        sessionStorage.setItem('kudosim_popup_settings', JSON.stringify(settings));
        setPopupSettings(settings);
        
        if (settings.enabled) {
          setTimeout(() => {
            setIsVisible(true);
          }, settings.delay || 3000);
        }
      } catch (error) {
        console.error('Error loading popup settings:', error);
        // Use default settings in case of error
        setPopupSettings(DEFAULT_SETTINGS);
      }
    };

    loadPopupSettings();
    
    const popupDismissed = localStorage.getItem('kudosim_popup_dismissed');
    if (popupDismissed) {
      setIsVisible(false);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('kudosim_popup_dismissed', 'true');
  };

  const getTitle = () => {
    const currentLang = i18n.language;
    return popupSettings.translations[currentLang]?.title || 
           popupSettings.translations.en.title;
  };

  const getDescription = () => {
    const currentLang = i18n.language;
    return popupSettings.translations[currentLang]?.description || 
           popupSettings.translations.en.description;
  };

  if (!popupSettings.enabled || isLoading) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 p-1 rounded-full bg-white/80 text-gray-800 hover:bg-white transition-colors"
              aria-label="Close popup"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/2 relative">
                {popupSettings.background_image ? (
                  <img 
                    src={popupSettings.background_image} 
                    alt="App promotion" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full min-h-[200px] bg-gradient-to-br from-[#690d89] to-[#8B5CF6] flex items-center justify-center">
                    <img 
                      src="/telefoni.webp" 
                      alt="Mobile device" 
                      className="max-h-[200px] md:max-h-full object-contain"
                    />
                  </div>
                )}
              </div>

              <div className="w-full md:w-1/2 p-6 flex flex-col">
                <h2 className="text-2xl font-bold text-[#690d89] mb-2">
                  {getTitle()}
                </h2>
                <p className="text-gray-600 mb-6">
                  {getDescription()}
                </p>

                <div className="mt-auto space-y-3">
                  <a 
                    href={popupSettings.app_store_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16.3,2.5C16.7,3,17,3.7,17,4.6c0,1.1-0.6,2.1-1.5,2.7c-0.9,0.5-1.9,0.5-2.9,0.3c-0.1-1,0.3-2,0.9-2.7 C14.2,4,15.3,3.5,16.3,2.5z M20.8,17.8c0.1,0.2,0.2,0.3,0.2,0.5c0,0.1-0.1,0.3-0.2,0.4c-0.8,1.1-1.7,2.2-2.7,3.1 c-0.5,0.5-1.2,0.5-1.8,0.1c-0.7-0.4-1.4-0.9-2.1-1.3c-0.7-0.4-1.4-0.4-2.1,0c-0.7,0.4-1.4,0.9-2.1,1.3c-0.6,0.4-1.3,0.4-1.8-0.1 c-1-0.9-1.9-2-2.7-3.1c-0.8-1.1-1.5-2.3-1.9-3.6c-0.4-1.3-0.5-2.7-0.3-4c0.2-1.5,0.8-2.9,1.8-4c1-1.1,2.3-1.6,3.8-1.6 c0.7,0,1.4,0.2,2.1,0.4c0.6,0.2,1.2,0.4,1.8,0.4c0.5,0,1.1-0.1,1.6-0.3c0.7-0.2,1.3-0.4,2-0.5c1.3-0.1,2.5,0.2,3.5,0.9 c-0.3,0.2-0.6,0.4-0.8,0.6c-0.8,0.8-1.3,1.7-1.3,2.8c0,1.2,0.5,2.1,1.3,2.9c0.5,0.5,1.1,0.8,1.8,0.9c-0.2,0.6-0.4,1.2-0.6,1.8 C20.9,15.4,20.6,16.6,20.8,17.8z"/>
                    </svg>
                    <span>{t('download_app_store', 'Download on the App Store')}</span>
                  </a>
                  
                  <a 
                    href={popupSettings.play_store_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-[#690d89] text-white py-3 px-4 rounded-lg hover:bg-[#8B5CF6] transition-colors"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3.609 1.814L13.792 12 3.609 22.186c-.181.181-.29.423-.29.684v-.369c0-.261.109-.513.29-.684L13.402 12 3.609 2.198c-.181-.181-.29-.423-.29-.684v.3c0 .261.109.513.29.684zm10.831 9.326l2.274-1.276-2.274-1.276-1.969 1.276 1.969 1.276zM5.83 1.497L14.217 6.2l2.265-1.272c1.388-.779 1.887-.651 2.327-.241.23.215.357.506.357.809 0 .545-.357 1.078-1.009 1.445l-1.259.704 1.25.704c.652.368 1.018.9 1.018 1.446 0 .303-.126.594-.357.809-.441.41-.939.539-2.327-.241l-2.265-1.272-8.387 4.702c1.258.704 2.516 0 2.516 0L16.56 8.991v6.182l-5.92-3.326-5.022 2.816c0 .001 1.46.823 2.769.107L16.56 8.992V2.811L8.338 7.133 5.83 5.648v-4.15z"/>
                    </svg>
                    <span>{t('get_on_google_play', 'Get it on Google Play')}</span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Popup;