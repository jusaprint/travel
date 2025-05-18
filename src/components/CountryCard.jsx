import React from 'react';
import { motion } from 'framer-motion';
import Flag from 'react-world-flags';
import { useTranslation } from 'react-i18next';

export default function CountryCard({ country }) {
  const { t, i18n } = useTranslation('country');

  // Get translated country name and description
  const countryName = country.translations?.[i18n.language]?.name || country.name;
  const countryDescription = country.translations?.[i18n.language]?.description || country.description;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group relative overflow-hidden rounded-2xl bg-white p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 h-full"
    >
      <div className="relative h-48 overflow-hidden rounded-xl mb-4">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
        <img
          src={country.coverimage || `https://source.unsplash.com/800x600/?${country.name},landmarks`}
          alt={countryName}
          className="w-full h-full object-cover"
          loading="eager"
          fetchpriority="high"
          decoding="sync"
          width="400"
          height="300"
        />
        
        <div className="absolute top-4 right-4 z-20">
          <div className="w-16 h-16 rounded-full overflow-hidden shadow-lg ring-2 ring-white/20">
            <Flag 
              code={country.code} 
              className="w-full h-full object-cover"
              loading="eager"
              fetchpriority="high"
            />
          </div>
        </div>

        <div className="absolute bottom-4 left-4 right-4 z-20">
          <h3 className="text-2xl font-bold text-white mb-2">
            {countryName}
          </h3>
        </div>
      </div>

      {country.starting_price && (
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-gray-500">{t('starting.from')}</span>
          <span className="text-lg font-bold text-[#690d89]">{country.starting_price}</span>
        </div>
      )}
    </motion.div>
  );
}