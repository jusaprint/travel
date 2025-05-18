import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Flag from 'react-world-flags';
import { useTranslation } from 'react-i18next';

const CountrySelector = ({ onAdd }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const countries = [
    // European countries
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'IT', name: 'Italy' },
    { code: 'ES', name: 'Spain' },
    { code: 'PT', name: 'Portugal' },
    { code: 'NL', name: 'Netherlands' },
    { code: 'BE', name: 'Belgium' },
    { code: 'AT', name: 'Austria' },
    { code: 'DK', name: 'Denmark' },
    { code: 'SE', name: 'Sweden' },
    { code: 'FI', name: 'Finland' },
    { code: 'GR', name: 'Greece' },
    { code: 'PL', name: 'Poland' },
    { code: 'CZ', name: 'Czech Republic' },
    { code: 'HU', name: 'Hungary' },
    // Balkan countries
    { code: 'HR', name: 'Croatia' },
    { code: 'RS', name: 'Serbia' },
    { code: 'ME', name: 'Montenegro' },
    { code: 'MK', name: 'North Macedonia' },
    { code: 'AL', name: 'Albania' },
    { code: 'BG', name: 'Bulgaria' },
    { code: 'RO', name: 'Romania' },
    // Additional countries
    { code: 'TR', name: 'Turkey' },
    { code: 'CH', name: 'Switzerland' },
    { code: 'US', name: 'United States' },
    { code: 'AU', name: 'Australia' },
    { code: 'CA', name: 'Canada' }
  ];

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white/20 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-white/30 transition-colors flex items-center justify-between"
      >
        <span>Add Country</span>
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-white rounded-lg shadow-xl">
          <div className="p-2">
            <input
              type="text"
              placeholder="Search countries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 text-sm focus:ring-[#690d89] focus:border-[#690d89]"
            />
          </div>
          <div className="max-h-60 overflow-auto">
            {filteredCountries.map((country) => (
              <button
                key={country.code}
                onClick={() => {
                  onAdd(country);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
              >
                <div className="w-6 h-4 overflow-hidden rounded">
                  <Flag code={country.code} className="w-full h-full object-cover" />
                </div>
                <span className="text-gray-900 text-sm">{country.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const FlagGroup = ({ countries, maxVisible = 6, onRemove }) => {
  const [showAll, setShowAll] = useState(false);
  const visibleCountries = showAll ? countries : countries.slice(0, maxVisible);
  const remainingCount = countries.length - maxVisible;

  return (
    <div className="flex flex-wrap gap-1 sm:gap-2">
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
          className="w-8 h-6 sm:w-10 sm:h-7 bg-[#ffc300] text-white rounded-lg text-xs sm:text-sm font-bold hover:bg-white transition-colors duration-300 flex items-center justify-center shadow-lg"
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

  const europeanCountries = useMemo(
    () =>
      editedPackage.countries.filter((country) =>
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
    [editedPackage.countries]
  );

  const balkanCountries = useMemo(
    () =>
      editedPackage.countries.filter((country) =>
        ['HR', 'RS', 'ME', 'MK', 'AL', 'GR', 'BG', 'RO', 'HU'].includes(
          country.code
        )
      ),
    [editedPackage.countries]
  );

  const otherCountries = useMemo(
    () =>
      editedPackage.countries.filter((country) =>
        ['US', 'CA', 'AU'].includes(country.code)
      ),
    [editedPackage.countries]
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

  const handleAddCountry = (country) => {
    if (!editedPackage.countries.some(c => c.code === country.code)) {
      setEditedPackage(prev => ({
        ...prev,
        countries: [...prev.countries, country]
      }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="relative overflow-hidden rounded-[32px] bg-[#6F2DA8] p-6 text-white shadow-xl transition-all duration-300"
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
                <h3 className="text-2xl font-bold">{editedPackage.name}</h3>
              )}
            </div>
            <div className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full font-semibold text-sm">
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
                <div className="text-2xl font-bold">{editedPackage.price}</div>
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
                    <span>{t('package.days')}</span>
                  </div>
                ) : (
                  <>
                    {t('package.valid.for')} {editedPackage.validity_days} {t('package.days')}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-white/80 mb-1">
              {t('package.checkout.url')}
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
              <div className="h-8 w-8 sm:h-12 sm:w-12 flex-shrink-0 flex items-center justify-center rounded-full bg-[#6F2DA8] text-white">
                <svg className="h-4 w-4 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-semibold text-white/80">{t('package.hotspot')}</h4>
                <p className="text-sm sm:text-lg font-bold text-white">{t('package.allowed')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="h-8 w-8 sm:h-12 sm:w-12 flex-shrink-0 flex items-center justify-center rounded-full bg-[#6F2DA8] text-white">
                <svg className="h-4 w-4 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-semibold text-white/80">{t('package.speed')}</h4>
                <p className="text-sm sm:text-lg font-bold text-white">{t('package.no.limit')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Coverage Section */}
        <div className="space-y-6 mb-8">
          {isEditing && (
            <div className="mb-4">
              <CountrySelector onAdd={handleAddCountry} />
            </div>
          )}

          {europeanCountries.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-base font-semibold text-white/90">{t('package.european.coverage')}</h4>
              <FlagGroup 
                countries={europeanCountries} 
                maxVisible={6} 
                onRemove={isEditing ? handleRemoveCountry : undefined}
              />
            </div>
          )}
          
          {balkanCountries.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-base font-semibold text-white/90">{t('package.balkan.coverage')}</h4>
              <FlagGroup 
                countries={balkanCountries} 
                maxVisible={6} 
                onRemove={isEditing ? handleRemoveCountry : undefined}
              />
            </div>
          )}

          {otherCountries.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-base font-semibold text-white/90">{t('package.other.coverage')}</h4>
              <FlagGroup 
                countries={otherCountries} 
                maxVisible={8}
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
              className="flex-1 bg-[#ffc300] text-white rounded-xl py-3 font-bold text-base hover:bg-white transition-colors duration-300 shadow-lg"
            >
              {t('common.save')}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onCancel}
              className="flex-1 bg-white/20 backdrop-blur-sm text-white rounded-xl py-3 font-bold text-base hover:bg-white/30 transition-colors duration-300"
            >
              {t('common.cancel')}
            </motion.button>
          </div>
        ) : (
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onEdit}
              className="flex-1 bg-[#ffc300] text-white rounded-xl py-3 font-bold text-base hover:bg-white transition-colors duration-300 shadow-lg"
            >
              {t('common.edit')}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onDuplicate}
              className="flex-1 bg-white/20 backdrop-blur-sm text-white rounded-xl py-3 font-bold text-base hover:bg-white/30 transition-colors duration-300"
            >
              {t('common.duplicate')}
            </motion.button>
            {dataPackage.checkout_url ? (
              <a 
                href={dataPackage.checkout_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-green-500/20 backdrop-blur-sm text-green-100 rounded-xl py-3 font-bold text-base hover:bg-green-500/30 transition-colors duration-300"
                >
                  {t('package.purchase')}
                </motion.button>
              </a>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onDelete}
                className="flex-1 bg-red-500/20 backdrop-blur-sm text-red-100 rounded-xl py-3 font-bold text-base hover:bg-red-500/30 transition-colors duration-300"
              >
                {t('common.delete')}
              </motion.button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
export default React.memo(ComboPackageCard);
