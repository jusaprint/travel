import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import DestinationsCountries from '../components/destinations/DestinationsCountries';
import TopDestinations from '../components/destinations/TopDestinations';
import { useTranslationLoader } from '../i18n/hooks/useTranslationLoader';
import SEO from '../components/SEO';
import Container from '../components/Container';

export default function Destinations() {
  const { t, i18n } = useTranslation(['destinations', 'search', 'country']);
  const { isLoading } = useTranslationLoader(['destinations', 'search', 'country']);

  // Prepare schema markup for SEO
  const destinationsSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": i18n.language === 'en' ? "Find the Best eSIM for Your Destination" : 
            i18n.language === 'sq' ? "Gjeni eSIM-in më të Mirë për Destinacionin Tuaj" :
            i18n.language === 'fr' ? "Trouvez la Meilleure eSIM pour Votre Destination" :
            i18n.language === 'de' ? "Finden Sie die Beste eSIM für Ihr Reiseziel" :
            i18n.language === 'tr' ? "Destinasyonunuz İçin En İyi eSIM'i Bulun" :
            "Find the Best eSIM for Your Destination",
    "description": i18n.language === 'en' ? "Stay connected worldwide with our reliable eSIM service" : 
                   i18n.language === 'sq' ? "Qëndroni të lidhur në mbarë botën me shërbimin tonë të besueshëm eSIM" :
                   i18n.language === 'fr' ? "Restez connecté dans le monde entier avec notre service eSIM fiable" :
                   i18n.language === 'de' ? "Bleiben Sie weltweit mit unserem zuverlässigen eSIM-Service verbunden" :
                   i18n.language === 'tr' ? "Güvenilir eSIM hizmetimizle dünya çapında bağlantıda kalın" :
                   "Stay connected worldwide with our reliable eSIM service",
    "url": "https://kudosim.com/destinations"
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#690d89]"></div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title={i18n.language === 'en' ? "Find the Best eSIM for Your Destination" : 
               i18n.language === 'sq' ? "Gjeni eSIM-in më të Mirë për Destinacionin Tuaj" :
               i18n.language === 'fr' ? "Trouvez la Meilleure eSIM pour Votre Destination" :
               i18n.language === 'de' ? "Finden Sie die Beste eSIM für Ihr Reiseziel" :
               i18n.language === 'tr' ? "Destinasyonunuz İçin En İyi eSIM'i Bulun" :
               "Find the Best eSIM for Your Destination"}
        description={i18n.language === 'en' ? "Stay connected worldwide with our reliable eSIM service" : 
                     i18n.language === 'sq' ? "Qëndroni të lidhur në mbarë botën me shërbimin tonë të besueshëm eSIM" :
                     i18n.language === 'fr' ? "Restez connecté dans le monde entier avec notre service eSIM fiable" :
                     i18n.language === 'de' ? "Bleiben Sie weltweit mit unserem zuverlässigen eSIM-Service verbunden" :
                     i18n.language === 'tr' ? "Güvenilir eSIM hizmetimizle dünya çapında bağlantıda kalın" :
                     "Stay connected worldwide with our reliable eSIM service"}
        schema={destinationsSchema}
      />
      <div className="min-h-screen bg-gradient-to-b from-[#690d89]/5 to-white">
        {/* Hero Section with improved spacing */}
        <section className="relative pt-32 pb-24 sm:pt-40 sm:pb-32">
          {/* Background Effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.15]" />
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-[#DDA0DD]/20 via-transparent to-transparent rounded-full opacity-[0.15] blur-xl" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-[#87CEEB]/20 via-transparent to-transparent rounded-full opacity-[0.15] blur-xl" />
          </div>

          {/* Content with Container for consistent spacing */}
          <Container>
            <div className="text-center max-w-3xl mx-auto">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-8"
              >
                {i18n.language === 'en' ? "Find the Best eSIM for Your Destination" : 
                 i18n.language === 'sq' ? "Gjeni eSIM-in më të Mirë për Destinacionin Tuaj" :
                 i18n.language === 'fr' ? "Trouvez la Meilleure eSIM pour Votre Destination" :
                 i18n.language === 'de' ? "Finden Sie die Beste eSIM für Ihr Reiseziel" :
                 i18n.language === 'tr' ? "Destinasyonunuz İçin En İyi eSIM'i Bulun" :
                 "Find the Best eSIM for Your Destination"}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl text-gray-600"
              >
                {i18n.language === 'en' ? "Stay connected worldwide with our reliable eSIM service" : 
                 i18n.language === 'sq' ? "Qëndroni të lidhur në mbarë botën me shërbimin tonë të besueshëm eSIM" :
                 i18n.language === 'fr' ? "Restez connecté dans le monde entier avec notre service eSIM fiable" :
                 i18n.language === 'de' ? "Bleiben Sie weltweit mit unserem zuverlässigen eSIM-Service verbunden" :
                 i18n.language === 'tr' ? "Güvenilir eSIM hizmetimizle dünya çapında bağlantıda kalın" :
                 "Stay connected worldwide with our reliable eSIM service"}
              </motion.p>
            </div>
          </Container>
        </section>

        {/* Main Content with improved spacing */}
        <Container className="pb-32">
          {/* Top Destinations Section */}
          <section className="mb-32">
            <TopDestinations />
          </section>
          
          {/* All Countries List */}
          <section>
            <DestinationsCountries />
          </section>
        </Container>
      </div>
    </>
  );
}