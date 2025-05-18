import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import Flag from 'react-world-flags';
import { getCountryById, createCountry, updateCountry } from '../services/dataService';

export default function CountryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentLang } = useOutletContext();
  
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    region: '',
    status: 'active',
    description: '',
    emergency_number: '',
    currency: '',
    languages: [],
    networks: [],
    features: [],
    technical_details: [],
    translations: {},
    coverimage: '',
    starting_price: '',
    top_destination: false
  });
  
  const [translations, setTranslations] = useState({
    en: { name: '', description: '' },
    de: { name: '', description: '' },
    fr: { name: '', description: '' },
    es: { name: '', description: '' }
  });
  
  const [newFeature, setNewFeature] = useState('');
  const [newTechnicalDetail, setNewTechnicalDetail] = useState('');
  const [newNetwork, setNewNetwork] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (id && id !== 'new') {
      setIsLoading(true);
      getCountryById(id)
        .then(country => {
          setFormData({
            name: country.name,
            code: country.code,
            region: country.region,
            status: country.status,
            description: country.description || '',
            emergency_number: country.emergency_number || '',
            currency: country.currency || '',
            languages: country.languages || [],
            networks: country.networks || [],
            features: country.features || [],
            technical_details: country.technical_details || [],
            coverimage: country.coverimage || '',
            starting_price: country.starting_price || '',
            top_destination: country.top_destination || false
          });
          
          setTranslations(country.translations || {
            en: { name: country.name, description: country.description || '' },
            de: { name: '', description: '' },
            fr: { name: '', description: '' },
            es: { name: '', description: '' }
          });
          
          setIsLoading(false);
        })
        .catch(err => {
          console.error('Error fetching country:', err);
          setError('Failed to load country data. Please try again.');
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
    
    if (name === 'name' || name === 'description') {
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
    
    if (lang === currentLang && (name === 'name' || name === 'description')) {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature.trim()]
      });
      setNewFeature('');
    }
  };

  const removeFeature = (feature) => {
    setFormData({
      ...formData,
      features: formData.features.filter(f => f !== feature)
    });
  };

  const addTechnicalDetail = () => {
    if (newTechnicalDetail.trim() && !formData.technical_details.includes(newTechnicalDetail.trim())) {
      setFormData({
        ...formData,
        technical_details: [...formData.technical_details, newTechnicalDetail.trim()]
      });
      setNewTechnicalDetail('');
    }
  };

  const removeTechnicalDetail = (detail) => {
    setFormData({
      ...formData,
      technical_details: formData.technical_details.filter(d => d !== detail)
    });
  };

  const addNetwork = () => {
    if (newNetwork.trim() && !formData.networks.includes(newNetwork.trim())) {
      setFormData({
        ...formData,
        networks: [...formData.networks, newNetwork.trim()]
      });
      setNewNetwork('');
    }
  };

  const removeNetwork = (network) => {
    setFormData({
      ...formData,
      networks: formData.networks.filter(n => n !== network)
    });
  };

  const addLanguage = () => {
    if (newLanguage.trim() && !formData.languages.includes(newLanguage.trim())) {
      setFormData({
        ...formData,
        languages: [...formData.languages, newLanguage.trim()]
      });
      setNewLanguage('');
    }
  };

  const removeLanguage = (language) => {
    setFormData({
      ...formData,
      languages: formData.languages.filter(l => l !== language)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage('');
    
    try {
      const countryData = {
        ...formData,
        translations
      };
      
      if (id === 'new') {
        await createCountry(countryData);
        setMessage('Country created successfully!');
      } else {
        await updateCountry(id, countryData);
        setMessage('Country updated successfully!');
      }
      
      setTimeout(() => {
        navigate('/admin/countries');
      }, 1500);
    } catch (err) {
      console.error('Error saving country:', err);
      setError('Failed to save country. Please try again.');
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
            {id === 'new' ? 'Add New Country' : 'Edit Country'}
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            type="button"
            onClick={() => navigate('/admin/countries')}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#690d89]"
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
                  Country Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={translations[currentLang].name || formData.name}
                    onChange={(e) => handleTranslationChange(e, currentLang)}
                    className="shadow-sm focus:ring-[#690d89] focus:border-[#690d89] block w-full sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                  Country Code (ISO)
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="code"
                    id="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-[#690d89] focus:border-[#690d89] block w-full sm:text-sm border-gray-300 rounded-md"
                    required
                    maxLength={2}
                    placeholder="e.g. DE, FR, US"
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
                  </select>
                </div>
              </div>

              <div className="sm:col-span-3">
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
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
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
                    value={translations[currentLang].description || formData.description}
                    onChange={(e) => handleTranslationChange(e, currentLang)}
                    className="shadow-sm focus:ring-[#690d89] focus:border-[#690d89] block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Brief description of the country for travelers.
                </p>
              </div>

              <div className="sm:col-span-6">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="top_destination"
                      name="top_destination"
                      type="checkbox"
                      checked={formData.top_destination}
                      onChange={handleInputChange}
                      className="focus:ring-[#690d89] h-4 w-4 text-[#690d89] border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="top_destination" className="font-medium text-gray-700">Top Destination</label>
                    <p className="text-gray-500">Mark this country as a top destination to feature it prominently on the destinations page.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="pt-8">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Additional Information</h3>
              <p className="mt-1 text-sm text-gray-500">
                Useful information for travelers visiting this country.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="emergency_number" className="block text-sm font-medium text-gray-700">
                  Emergency Number
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="emergency_number"
                    id="emergency_number"
                    value={formData.emergency_number}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-[#690d89] focus:border-[#690d89] block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="e.g. 911, 112"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                  Currency
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="currency"
                    id="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-[#690d89] focus:border-[#690d89] block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="e.g. EUR, USD"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="coverimage" className="block text-sm font-medium text-gray-700">
                  Cover Image URL
                </label>
                <div className="mt-1">
                  <input
                    type="url"
                    name="coverimage"
                    id="coverimage"
                    value={formData.coverimage}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-[#690d89] focus:border-[#690d89] block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="starting_price" className="block text-sm font-medium text-gray-700">
                  Starting Price
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="starting_price"
                    id="starting_price"
                    value={formData.starting_price}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-[#690d89] focus:border-[#690d89] block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="e.g. $4.50 USD"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">
                  Languages
                </label>
                <div className="mt-1">
                  <div className="flex rounded-md shadow-sm">
                    <input
                      type="text"
                      value={newLanguage}
                      onChange={(e) => setNewLanguage(e.target.value)}
                      className="focus:ring-[#690d89] focus:border-[#690d89] flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300"
                      placeholder="Add a language"
                    />
                    <button
                      type="button"
                      onClick={addLanguage}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-r-md text-white bg-[#690d89] hover:bg-[#8B5CF6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#690d89]"
                    >
                      Add
                    </button>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.languages.map((language) => (
                    <div
                      key={language}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#690d89]/10 text-[#690d89]"
                    >
                      {language}
                      <button
                        type="button"
                        onClick={() => removeLanguage(language)}
                        className="ml-1 inline-flex text-[#690d89] focus:outline-none"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">
                  Mobile Networks
                </label>
                <div className="mt-1">
                  <div className="flex rounded-md shadow-sm">
                    <input
                      type="text"
                      value={newNetwork}
                      onChange={(e) => setNewNetwork(e.target.value)}
                      className="focus:ring-[#690d89] focus:border-[#690d89] flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300"
                      placeholder="Add a network"
                    />
                    <button
                      type="button"
                      onClick={addNetwork}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-r-md text-white bg-[#690d89] hover:bg-[#8B5CF6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#690d89]"
                    >
                      Add
                    </button>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.networks.map((network) => (
                    <div
                      key={network}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#690d89]/10 text-[#690d89]"
                    >
                      {network}
                      <button
                        type="button"
                        onClick={() => removeNetwork(network)}
                        className="ml-1 inline-flex text-[#690d89] focus:outline-none"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="sm:col-span-6">
                <label className="block text-sm font-medium text-gray-700">
                  Features
                </label>
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
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.features.map((feature, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#690d89]/10 text-[#690d89]"
                    >
                      {feature}
                      <button
                        type="button"
                        onClick={() => removeFeature(feature)}
                        className="ml-1 inline-flex text-[#690d89] focus:outline-none"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="sm:col-span-6">
                <label className="block text-sm font-medium text-gray-700">
                  Technical Details
                </label>
                <div className="mt-1">
                  <div className="flex rounded-md shadow-sm">
                    <input
                      type="text"
                      value={newTechnicalDetail}
                      onChange={(e) => setNewTechnicalDetail(e.target.value)}
                      className="focus:ring-[#690d89] focus:border-[#690d89] flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300"
                      placeholder="Add a technical detail"
                    />
                    <button
                      type="button"
                      onClick={addTechnicalDetail}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-r-md text-white bg-[#690d89] hover:bg-[#8B5CF6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#690d89]"
                    >
                      Add
                    </button>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.technical_details.map((detail, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#690d89]/10 text-[#690d89]"
                    >
                      {detail}
                      <button
                        type="button"
                        onClick={() => removeTechnicalDetail(detail)}
                        className="ml-1 inline-flex text-[#690d89] focus:outline-none"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Flag Preview */}
          <div className="pt-8">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Flag Preview</h3>
              <p className="mt-1 text-sm text-gray-500">
                Preview of the country flag based on the country code.
              </p>
            </div>

            <div className="mt-6">
              {formData.code && (
                <div className="flex items-center">
                  <div className="w-24 h-16 overflow-hidden rounded-md shadow-md">
                    <Flag code={formData.code} className="w-full h-full object-cover" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">
                      Flag will be automatically displayed based on the country code.
                    </p>
                  </div>
                </div>
              )}

              {!formData.code && (
                <div className="text-sm text-gray-500">
                  Enter a valid country code to see the flag preview.
                </div>
              )}
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
                        Country Name
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="name"
                          id={`name-${lang}`}
                          value={translations[lang].name || ''}
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
                          value={translations[lang].description || ''}
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
              onClick={() => navigate('/admin/countries')}
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
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                id === 'new' ? 'Create Country' : 'Update Country'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}