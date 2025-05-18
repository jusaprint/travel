import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { getPackageById, createPackage, updatePackage } from '../services/dataService';

// Feature input component
const FeatureInput = ({ features, setFeatures }) => {
  const [newFeature, setNewFeature] = useState('');

  const addFeature = () => {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const removeFeature = (index) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Features</label>
      <div className="mt-1">
        <div className="flex rounded-md shadow-sm">
          <input
            type="text"
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            className="focus:ring-[#690d89] focus:border-[#690d89] flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300"
            placeholder="Add a feature"
          />
          <button
            type="button"
            onClick={addFeature}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-r-md text-white bg-[#690d89] hover:bg-[#8B5CF6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#690d89]"
          >
            Add
          </button>
        </div>
      </div>
      <div className="mt-2 space-y-2">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md">
            <span className="text-sm text-gray-700">{feature}</span>
            <button
              type="button"
              onClick={() => removeFeature(index)}
              className="text-red-600 hover:text-red-900"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Country selector component
const CountrySelector = ({ selectedCountries, setSelectedCountries }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Sample countries data
  const allCountries = [
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'IT', name: 'Italy' },
    { code: 'ES', name: 'Spain' },
    { code: 'PT', name: 'Portugal' },
    { code: 'NL', name: 'Netherlands' },
    { code: 'BE', name: 'Belgium' },
    { code: 'AT', name: 'Austria' },
    { code: 'HR', name: 'Croatia' },
    { code: 'RS', name: 'Serbia' },
    { code: 'ME', name: 'Montenegro' },
    { code: 'MK', name: 'North Macedonia' },
    { code: 'AL', name: 'Albania' },
    { code: 'GR', name: 'Greece' },
    { code: 'BG', name: 'Bulgaria' },
    { code: 'RO', name: 'Romania' },
    { code: 'HU', name: 'Hungary' }
  ];

  const filteredCountries = allCountries.filter(
    country => country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleCountry = (country) => {
    const isSelected = selectedCountries.some(c => c.code === country.code);
    if (isSelected) {
      setSelectedCountries(selectedCountries.filter(c => c.code !== country.code));
    } else {
      setSelectedCountries([...selectedCountries, country]);
    }
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700">Countries</label>
      <div className="mt-1 relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-[#690d89] focus:border-[#690d89] sm:text-sm"
        >
          <span className="block truncate">
            {selectedCountries.length === 0
              ? 'Select countries'
              : `${selectedCountries.length} countries selected`}
          </span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
            </svg>
          </span>
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
            <div className="sticky top-0 z-10 bg-white p-2">
              <input
                type="text"
                className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-[#690d89] focus:border-[#690d89] sm:text-sm"
                placeholder="Search countries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="py-1">
              {filteredCountries.map((country) => {
                const isSelected = selectedCountries.some(c => c.code === country.code);
                return (
                  <div
                    key={country.code}
                    className={`${
                      isSelected ? 'bg-[#690d89]/10 text-[#690d89]' : 'text-gray-900'
                    } cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-gray-100`}
                    onClick={() => toggleCountry(country)}
                  >
                    <div className="flex items-center">
                      <span className="block truncate font-medium">{country.name}</span>
                    </div>
                    {isSelected && (
                      <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#690d89]">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      {selectedCountries.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedCountries.map((country) => (
            <div
              key={country.code}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#690d89]/10 text-[#690d89]"
            >
              {country.name}
              <button
                type="button"
                onClick={() => toggleCountry(country)}
                className="ml-1 inline-flex text-[#690d89] focus:outline-none"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function PackageForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentLang } = useOutletContext();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    validity_days: 30,
    region: '',
    status: 'draft',
    features: [],
    countries: [],
    popular: false,
    best_value: false
  });
  
  const [translations, setTranslations] = useState({
    en: { name: '', description: '' },
    de: { name: '', description: '' },
    fr: { name: '', description: '' },
    es: { name: '', description: '' }
  });
  
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  
  // Fetch package data if editing
  useEffect(() => {
    if (id && id !== 'new') {
      setIsLoading(true);
      getPackageById(id)
        .then(packageData => {
          if (packageData) {
            setFormData({
              name: packageData.name || '',
              description: packageData.description || '',
              price: packageData.price || '',
              validity_days: packageData.validity_days || 30,
              region: packageData.region || '',
              status: packageData.status || 'draft',
              features: packageData.features || [],
              popular: packageData.popular || false,
              best_value: packageData.best_value || false
            });
            
            setSelectedCountries(packageData.countries || []);
            setTranslations(packageData.translations || {
              en: { name: packageData.name, description: packageData.description || '' },
              de: { name: '', description: '' },
              fr: { name: '', description: '' },
              es: { name: '', description: '' }
            });
          }
          setIsLoading(false);
        })
        .catch(err => {
          console.error('Error fetching package:', err);
          setError('Failed to load package data. Please try again.');
          setIsLoading(false);
        });
    }
  }, [id]);
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    if (['name', 'description'].includes(name)) {
      setTranslations({
        ...translations,
        [currentLang]: {
          ...translations[currentLang],
          [name]: value
        }
      });
    }
  };
  
  const handleTranslationChange = (e, lang) => {
    const { name, value } = e.target;
    setTranslations({
      ...translations,
      [lang]: {
        ...translations[lang],
        [name]: value
      }
    });
    
    // Update main form data if current language
    if (lang === currentLang && (name === 'name' || name === 'description')) {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage('');
    
    try {
      // Prepare data for submission
      const packageData = {
        ...formData,
        countries: selectedCountries,
        translations
      };
      
      if (id === 'new') {
        await createPackage(packageData);
        setMessage('Package created successfully!');
      } else {
        await updatePackage(id, packageData);
        setMessage('Package updated successfully!');
      }
      
      setTimeout(() => {
        navigate('/admin/packages');
      }, 1500);
    } catch (err) {
      console.error('Error saving package:', err);
      setError('Failed to save package. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading && id && id !== 'new') {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#690d89]"></div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            {id === 'new' ? 'Create New Package' : 'Edit Package'}
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            type="button"
            onClick={() => navigate('/admin/packages')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#690d89]"
          >
            Cancel
          </button>
        </div>
      </div>
      
      {error && (
        <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {message && (
        <div className="mt-4 bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{message}</p>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="mt-6 space-y-8 divide-y divide-gray-200">
        <div className="space-y-8 divide-y divide-gray-200">
          {/* Basic Information */}
          <div>
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Basic Information</h3>
              <p className="mt-1 text-sm text-gray-500">
                This information will be displayed publicly on the website.
              </p>
            </div>
            
            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Package Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={translations[currentLang]?.name || formData.name}
                    onChange={(e) => handleTranslationChange(e, currentLang)}
                    className="shadow-sm focus:ring-[#690d89] focus:border-[#690d89] block w-full sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="region" className="block text-sm font-medium text-gray-700">
                  Region
                </label>
                <div className="mt-1">
                  <select
                    id="region"
                    name="region"
                    value={formData.region}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-[#690d89] focus:border-[#690d89] block w-full sm:text-sm border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select a region</option>
                    <option value="Europe">Europe</option>
                    <option value="Asia">Asia</option>
                    <option value="Americas">Americas</option>
                    <option value="Africa">Africa</option>
                    <option value="Oceania">Oceania</option>
                    <option value="Global">Global</option>
                  </select>
                </div>
              </div>
              
              <div className="sm:col-span-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <div className="mt-1">
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={translations[currentLang]?.description || formData.description}
                    onChange={(e) => handleTranslationChange(e, currentLang)}
                    className="shadow-sm focus:ring-[#690d89] focus:border-[#690d89] block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Brief description of the package for customers.
                </p>
              </div>
              
              <div className="sm:col-span-2">
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Price (€)
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    id="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-[#690d89] focus:border-[#690d89] block w-full sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>
              
              <div className="sm:col-span-2">
                <label htmlFor="validity_days" className="block text-sm font-medium text-gray-700">
                  Validity (days)
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="validity_days"
                    id="validity_days"
                    value={formData.validity_days}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-[#690d89] focus:border-[#690d89] block w-full sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>
              
              <div className="sm:col-span-2">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <div className="mt-1">
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-[#690d89] focus:border-[#690d89] block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* Package Type Options */}
              <div className="sm:col-span-6">
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  <h4 className="text-sm font-medium text-gray-900">Package Type</h4>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="popular"
                          name="popular"
                          type="checkbox"
                          checked={formData.popular}
                          onChange={handleInputChange}
                          className="focus:ring-[#690d89] h-4 w-4 text-[#690d89] border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="popular" className="font-medium text-gray-700">Most Popular</label>
                        <p className="text-gray-500">Mark this package as the most popular option</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="best_value"
                          name="best_value"
                          type="checkbox"
                          checked={formData.best_value}
                          onChange={handleInputChange}
                          className="focus:ring-[#690d89] h-4 w-4 text-[#690d89] border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="best_value" className="font-medium text-gray-700">Best Value</label>
                        <p className="text-gray-500">Mark this package as the best value option</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Features and Countries */}
          <div className="pt-8">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Features and Coverage</h3>
              <p className="mt-1 text-sm text-gray-500">
                Define what's included in the package and where it can be used.
              </p>
            </div>
            
            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <FeatureInput 
                  features={formData.features} 
                  setFeatures={(features) => setFormData({...formData, features})} 
                />
              </div>
              
              <div className="sm:col-span-6">
                <CountrySelector 
                  selectedCountries={selectedCountries} 
                  setSelectedCountries={setSelectedCountries} 
                />
              </div>
            </div>
          </div>
          
          {/* Translations */}
          <div className="pt-8">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Translations</h3>
              <p className="mt-1 text-sm text-gray-500">
                Manage translations for different languages.
              </p>
            </div>
            
            <div className="mt-6 space-y-6">
              {Object.keys(translations).filter(lang => lang !== currentLang).map((lang) => (
                <div key={lang} className="border border-gray-200 rounded-md p-4">
                  <h4 className="text-md font-medium text-gray-900 mb-4">
                    {lang === 'en' ? 'English' : lang === 'de' ? 'German' : lang === 'fr' ? 'French' : 'Spanish'}
                  </h4>
                  
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label htmlFor={`name-${lang}`} className="block text-sm font-medium text-gray-700">
                        Package Name
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="name"
                          id={`name-${lang}`}
                          value={translations[lang]?.name || ''}
                          onChange={(e) => handleTranslationChange(e, lang)}
                          className="shadow-sm focus:ring-[#690d89] focus:border-[#690d89] block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    
                    <div className="sm:col-span-6">
                      <label htmlFor={`description-${lang}`} className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <div className="mt-1">
                        <textarea
                          id={`description-${lang}`}
                          name="description"
                          rows={3}
                          value={translations[lang]?.description || ''}
                          onChange={(e) => handleTranslationChange(e, lang)}
                          className="shadow-sm focus:ring-[#690d89] focus:border-[#690d89] block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="pt-5">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/admin/packages')}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#690d89]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#690d89] hover:bg-[#8B5CF6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#690d89]"
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              {id === 'new' ? 'Create Package' : 'Update Package'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}