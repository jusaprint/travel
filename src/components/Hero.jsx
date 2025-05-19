// src/components/Hero.jsx
import React, { useState, useEffect, useCallback, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { supabase } from '../lib/cms';
import SearchCountries from './SearchCountries';
import Container from './Container';
import { useLanguage } from '../context/LanguageContext';

// List of countries to rotate through
const europeanCountries = [
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' }
];

// Star rating component
const StarRating = memo(() => (
  <div className="flex items-center gap-2 bg-[#690d89] rounded-full px-4 py-2 text-white">
    {[...Array(5)].map((_, i) => (
      <img
        key={i}
        src="/starkudo.svg"
        alt="Star"
        className="w-5 h-5"
        width="20"
        height="20"
        loading="eager"
      />
    ))}
    <span className="font-bold text-white text-lg ml-2">4.9/5</span>
    <span className="text-white/90 text-sm ml-1">from 10,000+ reviews</span>
  </div>
));

// Payment methods component
const PaymentMethods = memo(() => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.7, duration: 0.5 }}
  >
    <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
      {['visa', 'mastercard', 'gpay'].map(name => (
        <img
          key={name}
          src={`/${name}.svg`}
          alt={name}
          className="h-10 w-auto"
          width="60"
          height="40"
          loading="eager"
        />
      ))}
    </div>
  </motion.div>
));

// Suggested-plans title section
const PlansTitle = memo(() => {
  const { i18n } = useTranslation('plans');
  const texts = {
    en: {
      title: 'Suggested Plans for Your Journey',
      subtitle: 'Discover our carefully curated selection of premium connectivity solutions'
    },
    sq: {
      title: 'Planet e Sugjeruara për Udhëtimin Tuaj',
      subtitle: 'Zbuloni përzgjedhjen tonë të kujdesshme të zgjidhjeve premium të lidhjes'
    },
    fr: {
      title: 'Forfaits Suggérés pour Votre Voyage',
      subtitle: 'Découvrez notre sélection soigneusement organisée de solutions de connectivité premium'
    },
    de: {
      title: 'Empfohlene Tarife für Ihre Reise',
      subtitle: 'Entdecken Sie unsere sorgfältig kuratierte Auswahl an Premium-Konnektivitätslösungen'
    },
    tr: {
      title: 'Yolculuğunuz İçin Önerilen Planlar',
      subtitle: 'Premium bağlantı çözümlerimizin özenle seçilmiş koleksiyonunu keşfedin'
    }
  };
  const lang = texts[i18n.language] ? i18n.language : 'en';

  return (
    <div className="text-center py-4 bg-white">
      <h2 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-[#690d89] to-[#8B5CF6] bg-clip-text text-transparent">
        {texts[lang].title}
      </h2>
      <p className="text-lg text-gray-600">{texts[lang].subtitle}</p>
    </div>
  );
});

// Always use these local images for the hero section visuals
const DEFAULT_BG_IMAGE = '/kudosimheroimage.jpeg';
// Use the telefoni.webp image from the project root and ensure it scales nicely
const DEFAULT_PHONE_IMAGE = '/telefoni.webp';

const Hero = () => {
  const [currentCountry, setCurrentCountry] = useState(europeanCountries[0]);
  const [heroSettings, setHeroSettings] = useState({
    background_image: DEFAULT_BG_IMAGE,
    phone_image: DEFAULT_PHONE_IMAGE,
    translations: {
      en: {
        title: 'Travel with KudoSIM in',
        subtitle:
          'Stay connected globally with instant digital SIM cards. No physical SIM needed, just scan and connect.'
      },
      sq: {
        title: 'Udhëtoni me KudoSIM në',
        subtitle:
          'Qëndroni të lidhur globalisht me karta SIM dixhitale të menjëhershme. Nuk nevojitet SIM fizike, thjesht skanoni dhe lidhuni.'
      },
      fr: {
        title: 'Voyagez avec KudoSIM en',
        subtitle:
          'Restez connecté mondialement avec des cartes SIM numériques instantanées. Pas de SIM physique nécessaire, scannez et connectez-vous.'
      },
      de: {
        title: 'Reisen Sie mit KudoSIM in',
        subtitle:
          'Bleiben Sie weltweit mit sofortigen digitalen SIM-Karten verbunden. Keine physische SIM erforderlich, einfach scannen und verbinden.'
      },
      tr: {
        title: 'KudoSIM ile şurada seyahat edin:',
        subtitle:
          'Anında dijital SIM kartlarla dünya çapında bağlantıda kalın. Fiziksel SIM gerekmez, sadece tarayın ve bağlanın.'
      }
    }
  });

  const { i18n } = useTranslation('hero');
  const { currentLanguage } = useLanguage();

  // Fetch CMS translations once
  useEffect(() => {
    async function load() {
      const cached = sessionStorage.getItem('kudosim_hero_translations');

      if (cached) {
        try {
          const translations = JSON.parse(cached);
          setHeroSettings(prev => ({
            ...prev,
            translations,
            background_image: DEFAULT_BG_IMAGE,
            phone_image: DEFAULT_PHONE_IMAGE
          }));
        } catch (err) {
          console.warn('Failed to parse cached hero translations:', err);
        }
      } else {
        try {
          const { data, error } = await supabase
            .from('cms_hero_settings')
            .select('translations')
            .single();

          if (!error && data?.translations) {
            sessionStorage.setItem(
              'kudosim_hero_translations',
              JSON.stringify(data.translations)
            );
            setHeroSettings(prev => ({
              ...prev,
              translations: data.translations,
              background_image: DEFAULT_BG_IMAGE,
              phone_image: DEFAULT_PHONE_IMAGE
            }));
          } else if (error) {
            console.warn('Failed to fetch hero translations:', error.message);
          }
        } catch (err) {
          console.warn('Error fetching hero translations:', err);
        }
      }
    }

    load();

    const iv = setInterval(() => {
      setCurrentCountry(prev => {
        const idx = europeanCountries.findIndex(c => c.code === prev.code);
        return europeanCountries[(idx + 1) % europeanCountries.length];
      });
    }, 5000);

    return () => clearInterval(iv);
  }, []);

  const getTitle = useCallback(
    () =>
      heroSettings.translations[currentLanguage]?.title ||
      heroSettings.translations.en.title,
    [heroSettings.translations, currentLanguage]
  );
  const getSubtitle = useCallback(
    () =>
      heroSettings.translations[currentLanguage]?.subtitle ||
      heroSettings.translations.en.subtitle,
    [heroSettings.translations, currentLanguage]
  );

  // framer-motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 10 } }
  };
  const flagVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -5 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: { type: 'spring', stiffness: 200, damping: 15 }
    },
    hover: { scale: 1.1, rotate: 5 }
  };

  const bgImage = heroSettings.background_image;
  const phoneImage = heroSettings.phone_image;

  return (
    <>
      <div className="relative w-full overflow-hidden z-0 lg:min-h-[65vh]">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 w-full h-full bg-center bg-no-repeat bg-cover"
            style={{ backgroundImage: `url('${bgImage}')` }}
          />
          <link rel="preload" href={bgImage} as="image" fetchPriority="high" />
          <div className="absolute inset-0 bg-[#690d89]/50" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-[0.15]" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col">
          <Container className="flex-1 pt-28 sm:pt-32 lg:pt-32 pb-12 lg:pb-6 flex flex-col justify-center">
            <motion.div
              className="grid lg:grid-cols-2 gap-4 lg:gap-8 items-center h-full" 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Left */}
              <div className="text-center lg:text-left max-w-2xl mx-auto lg:mx-0 mt-8 lg:mt-0">
                <motion.h1
                  className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-3 sm:mb-4 tracking-tight flex flex-wrap items-center justify-center lg:justify-start gap-2"
                  variants={itemVariants}
                >
                  {getTitle()}
                  {currentCountry && (
                    <motion.div
                      className="relative inline-flex w-16 h-12 sm:w-20 sm:h-14"
                      variants={flagVariants}
                      whileHover="hover"
                    >
                      <img
                        src={`https://flagcdn.com/${currentCountry.code.toLowerCase()}.svg`}
                        alt={currentCountry.name}
                        className="w-full h-full object-cover rounded-lg"
                        width="80"
                        height="56"
                        loading="eager"
                      />
                    </motion.div>
                  )}
                </motion.h1>

                <motion.p
                  className="text-base sm:text-lg lg:text-xl text-white mb-6 sm:mb-8"
                  variants={itemVariants}
                >
                  {getSubtitle()}
                </motion.p>

                <motion.div className="mb-6 sm:mb-8" variants={itemVariants}>
                  <SearchCountries
                    placeholder={{
                      en: 'Where are you travelling to?',
                      sq: 'Ku po udhëtoni?',
                      fr: 'Où voyagez-vous ?',
                      de: 'Wohin reisen Sie?',
                      tr: 'Nereye seyahat ediyorsunuz?'
                    }[i18n.language]}
                  />
                </motion.div>

                <motion.div className="mb-6 sm:mb-8 flex justify-center lg:justify-start" variants={itemVariants}>
                  <StarRating />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <PaymentMethods />
                </motion.div>
              </div>

              {/* Right phone */}
              <motion.div className="relative hidden lg:flex justify-center items-center" variants={itemVariants}>
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse' }} className="relative z-10">
                  <motion.img
                    src={phoneImage}
                    alt="eSIM Device"
                    className="w-full h-full object-contain mx-auto"
                    width="224"
                    height="448"
                    loading="eager"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 100, damping: 15, delay: 0.5 }}
                  />
                </motion.div>
              </motion.div>
            </motion.div>
          </Container>
        </div>
      </div>

      {/* Suggested plans */}
      <div className="bg-white w-full">
        <Container>
          <PlansTitle />
        </Container>
      </div>
    </>
  );
};

export default Hero;
