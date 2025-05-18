import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTranslationLoader } from '../i18n/hooks/useTranslationLoader';

export default function AppDownload() {
  const { t, i18n } = useTranslation('app');
  const { isLoading } = useTranslationLoader(['app']);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#690d89]"></div>
      </div>
    );
  }

  return (
    <section className="w-full bg-gradient-to-r from-[#690d89] to-[#8B5CF6] py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">
          {/* Left Content */}
          <div className="flex-1">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl font-bold text-white mb-4"
            >
              {i18n.language === 'en' ? "Shop on the web or use the KudoSIM app" : 
               i18n.language === 'sq' ? "Blini në web ose përdorni aplikacionin KudoSIM" :
               i18n.language === 'fr' ? "Achetez sur le web ou utilisez l'application KudoSIM" :
               i18n.language === 'de' ? "Kaufen Sie im Web oder nutzen Sie die KudoSIM-App" :
               i18n.language === 'tr' ? "Web'de alışveriş yapın veya KudoSIM uygulamasını kullanın" :
               "Shop on the web or use the KudoSIM app"}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-white/90 text-lg mb-8 max-w-2xl"
            >
              {i18n.language === 'en' ? "Download SIM cards for 200+ countries worldwide, and instantly enjoy reliable, prepaid mobile data. No contracts, no hidden fees, and no roaming charges." : 
               i18n.language === 'sq' ? "Shkarkoni karta SIM për më shumë se 200 vende në mbarë botën dhe gëzoni menjëherë të dhëna mobile të besueshme të parapaguara. Pa kontrata, pa tarifa të fshehura dhe pa tarifa roaming." :
               i18n.language === 'fr' ? "Téléchargez des cartes SIM pour plus de 200 pays dans le monde et profitez instantanément de données mobiles prépayées fiables. Pas de contrats, pas de frais cachés et pas de frais d'itinérance." :
               i18n.language === 'de' ? "Laden Sie SIM-Karten für über 200 Länder weltweit herunter und genießen Sie sofort zuverlässige, vorausbezahlte mobile Daten. Keine Verträge, keine versteckten Gebühren und keine Roaming-Kosten." :
               i18n.language === 'tr' ? "Dünya çapında 200'den fazla ülke için SIM kartları indirin ve anında güvenilir, ön ödemeli mobil verinin keyfini çıkarın. Sözleşme yok, gizli ücret yok ve dolaşım ücreti yok." :
               "Download SIM cards for 200+ countries worldwide, and instantly enjoy reliable, prepaid mobile data. No contracts, no hidden fees, and no roaming charges."}
            </motion.p>
            
            {/* App Store Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap gap-4"
            >
              {/* App Store Button */}
              <a 
                href="#" 
                className="flex items-center bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors"
              >
                <svg className="w-8 h-8 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <div>
                  <div className="text-xs">
                    {i18n.language === 'en' ? "Download on the" : 
                     i18n.language === 'sq' ? "Shkarkoni në" :
                     i18n.language === 'fr' ? "Télécharger sur l'" :
                     i18n.language === 'de' ? "Laden im" :
                     i18n.language === 'tr' ? "App Store'dan" :
                     "Download on the"}
                  </div>
                  <div className="text-lg font-semibold leading-tight">App Store</div>
                </div>
              </a>
              
              {/* Google Play Button */}
              <a 
                href="#" 
                className="flex items-center bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors"
              >
                <svg className="w-8 h-8 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                </svg>
                <div>
                  <div className="text-xs">
                    {i18n.language === 'en' ? "Get it on" : 
                     i18n.language === 'sq' ? "Merreni në" :
                     i18n.language === 'fr' ? "Disponible sur" :
                     i18n.language === 'de' ? "Jetzt bei" :
                     i18n.language === 'tr' ? "Google Play'den" :
                     "Get it on"}
                  </div>
                  <div className="text-lg font-semibold leading-tight">Google Play</div>
                </div>
              </a>
            </motion.div>
          </div>
          
          {/* Right Image */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex-shrink-0 relative"
          >
            <div className="relative w-64 sm:w-80">
              {/* Phone Image */}
              <img 
                src="/telefoni.webp" 
                alt="KudoSIM Mobile App" 
                className="relative z-10 w-full h-auto"
                width="320"
                height="640"
              />
              
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-white/20 blur-xl rounded-full z-0"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}