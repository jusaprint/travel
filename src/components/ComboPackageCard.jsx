import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Flag from 'react-world-flags';
import { useTranslation } from 'react-i18next';
import { useTranslationLoader } from '../i18n/hooks/useTranslationLoader';
import TranslatedText from './TranslatedText';

const FlagGroup = ({ countries, maxVisible = 6, onRemove }) => {
  const [showAll, setShowAll] = useState(false);
  const visibleCountries = showAll ? countries : countries.slice(0, maxVisible);
  const remainingCount = countries.length - maxVisible;

  return (
    <div className="grid grid-cols-5 gap-2">
      {visibleCountries.map((country) => (
        <motion.div
          key={country.code}
          whileHover={{ scale: 1.1 }}
          className="relative group"
        >
          <div className="w-8 h-6 sm:w-10 sm:h-7 overflow-hidden rounded-lg shadow-sm">
            <Flag code={country.code} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <span className="text-white text-xs font-medium">{country.name}</span>
            </div>
            {onRemove && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(country);
                }}
                className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs"
              >
                ×
              </button>
            )}
          </div>
        </motion.div>
      ))}
      {!showAll && remainingCount > 0 && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAll(true)}
          className="w-8 h-6 sm:w-10 sm:h-7 bg-yellow-400 text-black rounded-full text-xs sm:text-sm font-bold hover:bg-yellow-500 transition-colors duration-300 flex items-center justify-center shadow"
        >
          +{remainingCount}
        </motion.button>
      )}
    </div>
  );
};

function ComboPackageCard({
  plan,
  package: dataPackage,
  isEditing = false,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onDuplicate
}) {
  const { t } = useTranslation();
  const [editedPackage, setEditedPackage] = useState(dataPackage);
  
  // Load the package namespace
  const { isLoading } = useTranslationLoader(['package']);

  const europeanCountries = useMemo(
    () =>
      dataPackage.countries.filter((country) =>
        [
          'DE',
          'FR',
          'IT',
          'ES',
          'PT',
          'NL',
          'BE',
          'LU',
          'AT',
          'DK',
          'SE',
          'FI',
          'GR',
          'PL',
          'CZ',
          'HU',
          'CH',
          'TR',
        ].includes(country.code)
      ),
    [dataPackage.countries]
  );

  const balkanCountries = useMemo(
    () =>
      dataPackage.countries.filter((country) =>
        ['HR', 'RS', 'ME', 'MK', 'AL', 'GR', 'BG', 'RO', 'HU'].includes(
          country.code
        )
      ),
    [dataPackage.countries]
  );

  const otherCountries = useMemo(
    () =>
      dataPackage.countries.filter((country) =>
        ['US', 'CA', 'AU'].includes(country.code)
      ),
    [dataPackage.countries]
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedPackage(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRemoveCountry = (countryToRemove) => {
    setEditedPackage(prev => ({
      ...prev,
      countries: prev.countries.filter(country => country.code !== countryToRemove.code)
    }));
  };

  if (isLoading) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#572d83] to-[#2e1054] p-6 text-white shadow-xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-white/20 rounded w-1/2"></div>
          <div className="h-12 bg-white/20 rounded"></div>
          <div className="h-20 bg-white/20 rounded"></div>
          <div className="h-32 bg-white/20 rounded"></div>
          <div className="h-12 bg-white/20 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#572d83] to-[#2e1054] p-6 text-white shadow-xl transition-all duration-300"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.15]" />
      
      {/* Content Container */}
      <div className="relative z-10">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={editedPackage.name}
                  onChange={handleInputChange}
                  className="text-2xl font-bold bg-transparent border-b border-white/20 focus:border-white focus:outline-none"
                />
              ) : (
                <h3 className="text-2xl font-bold">{dataPackage.name}</h3>
              )}
            </div>
            <div className="inline-block bg-white/10 px-3 py-1 rounded-full text-sm text-white">
              Europe + Balkan
            </div>
          </div>
          
          {/* Price Tag with Highlight */}
          <div className="relative">
            <div className="absolute -inset-4 bg-white/10 blur-lg rounded-full" />
            <div className="relative bg-white/20 backdrop-blur-sm rounded-xl p-3 text-right">
              {isEditing ? (
                <input
                  type="text"
                  name="price"
                  value={editedPackage.price}
                  onChange={handleInputChange}
                  className="text-2xl font-bold bg-transparent border-b border-white/20 focus:border-white focus:outline-none w-24 text-right"
                />
              ) : (
                <div className="inline-block bg-white/10 px-3 py-1 rounded-full text-sm text-white font-bold">{dataPackage.price}</div>
              )}
              <div className="text-blue-100 text-xs">
                {isEditing ? (
                  <div className="flex items-center justify-end gap-2">
                    <input
                      type="number"
                      name="validity_days"
                      value={editedPackage.validity_days}
                      onChange={handleInputChange}
                      className="w-16 bg-transparent border-b border-white/20 focus:border-white focus:outline-none text-right"
                      min="1"
                    />
                    <span>
                      <TranslatedText 
                        textKey="days" 
                        namespace="package" 
                        fallback="days"
                      />
                    </span>
                  </div>
                ) : (
                  <>
                    <TranslatedText 
                      textKey="valid.for" 
                      namespace="package" 
                      fallback="Valid for"
                    /> {dataPackage.validity_days} <TranslatedText 
                      textKey="days" 
                      namespace="package" 
                      fallback="days"
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-white/80 mb-1">
              <TranslatedText 
                textKey="checkout.url" 
                namespace="package" 
                fallback="Checkout URL"
              />
            </label>
            <input
              type="text"
              name="checkout_url"
              value={editedPackage.checkout_url || ''}
              onChange={handleInputChange}
              className="w-full bg-white/10 text-white rounded-lg px-4 py-2 text-sm border border-white/20 focus:border-white focus:outline-none"
              placeholder="https://checkout.kudosim.com/package-name"
            />
          </div>
        )}

        {/* Features Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
            <div className="h-8 w-8 sm:h-12 sm:w-12 flex-shrink-0 flex items-center justify-center rounded-full bg-[#7c3aed] text-white shadow">
                <svg className="h-4 w-4 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-semibold text-white/80 uppercase">
                  <TranslatedText 
                    textKey="hotspot" 
                    namespace="package" 
                    fallback="Hotspot"
                  />
                </h4>
                <p className="text-sm sm:text-lg font-bold text-white">
                  <TranslatedText 
                    textKey="allowed" 
                    namespace="package" 
                    fallback="Allowed"
                  />
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
            <div className="h-8 w-8 sm:h-12 sm:w-12 flex-shrink-0 flex items-center justify-center rounded-full bg-[#7c3aed] text-white shadow">
                <svg className="h-4 w-4 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-semibold text-white/80 uppercase">
                  <TranslatedText 
                    textKey="speed" 
                    namespace="package" 
                    fallback="Speed"
                  />
                </h4>
                <p className="text-sm sm:text-lg font-bold text-white">
                  <TranslatedText 
                    textKey="no.limit" 
                    namespace="package" 
                    fallback="Unlimited"
                  />
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Coverage Section */}
        <div className="space-y-6 mb-8">
          {europeanCountries.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm uppercase font-semibold text-white/80">
                <TranslatedText 
                  textKey="european.coverage" 
                  namespace="package" 
                  fallback="European Coverage"
                />
              </h4>
              <FlagGroup 
                countries={europeanCountries} 
                maxVisible={5} 
                onRemove={isEditing ? handleRemoveCountry : undefined}
              />
            </div>
          )}
          
          {balkanCountries.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm uppercase font-semibold text-white/80">
                <TranslatedText 
                  textKey="balkan.coverage" 
                  namespace="package" 
                  fallback="Balkan Coverage"
                />
              </h4>
              <FlagGroup 
                countries={balkanCountries} 
                maxVisible={5} 
                onRemove={isEditing ? handleRemoveCountry : undefined}
              />
            </div>
          )}

          {otherCountries.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm uppercase font-semibold text-white/80">
                <TranslatedText 
                  textKey="other.coverage" 
                  namespace="package" 
                  fallback="Other Coverage"
                />
              </h4>
              <FlagGroup 
                countries={otherCountries} 
                maxVisible={5}
                onRemove={isEditing ? handleRemoveCountry : undefined}
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {isEditing ? (
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSave(editedPackage)}
              className="flex-1 bg-yellow-400 text-black rounded-full py-3 font-bold text-base hover:bg-yellow-500 transition-colors duration-300 shadow"
            >
              {t('common.save')}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onCancel}
              className="flex-1 bg-white/20 backdrop-blur-sm text-white rounded-full py-3 font-bold text-base hover:bg-white/30 transition-colors duration-300"
            >
              {t('common.cancel')}
            </motion.button>
          </div>
        ) : (
          <a 
            href={dataPackage.checkout_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-yellow-400 text-black rounded-full py-3 font-bold text-base hover:bg-yellow-500 transition-colors duration-300 shadow flex items-center justify-center gap-2"
            >
              <TranslatedText 
                textKey="get.started" 
                namespace="package" 
                fallback="Get Started"
              />
              <svg className="w-5 h-5 text-[#6F2DA8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </motion.button>
          </a>
        )}
      </div>
    </motion.div>
  );
}
export default React.memo(ComboPackageCard);
