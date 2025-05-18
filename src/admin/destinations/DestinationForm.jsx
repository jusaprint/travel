import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import Flag from 'react-world-flags';
import { getDestinationById, createDestination, updateDestination } from '../services/dataService';
import { supabase } from '../services/supabaseService';

// Image upload component
const ImageUpload = ({ currentImage, onImageChange }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = async (e) => {
    try {
      setUploading(true);
      setError(null);
      
      const file = e.target.files[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload an image file');
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB');
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `covers/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      onImageChange(publicUrl);
    } catch (err) {
      console.error('Error uploading image:', err);
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Cover Image
      </label>
      
      <div className="flex items-center gap-4">
        {/* Current Image Preview */}
        {currentImage && (
          <div className="relative w-32 h-24 rounded-lg overflow-hidden">
            <img 
              src={currentImage} 
              alt="Cover preview" 
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Upload Button */}
        <div className="flex-1">
          <label className="relative flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-lg hover:bg-gray-50 cursor-pointer">
            <div className="space-y-1 text-center">
              <svg
                className="w-8 h-8 mx-auto text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
              <div className="text-sm text-gray-600">
                {uploading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-[#690d89] rounded-full animate-spin"></div>
                    <span>Uploading...</span>
                  </div>
                ) : (
                  <>
                    <span className="font-medium text-[#690d89] hover:text-[#8B5CF6]">
                      Click to upload
                    </span>
                    <span> or drag and drop</span>
                  </>
                )}
              </div>
              <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
            </div>
            <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileChange}
              accept="image/*"
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default function DestinationForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentLang } = useOutletContext();
  
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    region: '',
    status: 'draft',
    description: '',
    coverimage: '',
    starting_price: '',
    features: [],
    packages: 0
  });
  
  const [translations, setTranslations] = useState({
    en: { name: '', description: '' },
    de: { name: '', description: '' },
    fr: { name: '', description: '' },
    es: { name: '', description: '' }
  });
  
  const [newFeature, setNewFeature] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    if (id && id !== 'new') {
      setIsLoading(true);
      getDestinationById(id)
        .then(destination => {
          setFormData({
            name: destination.name,
            code: destination.code,
            region: destination.region,
            status: destination.status,
            description: destination.description || '',
            coverimage: destination.coverimage || '',
            starting_price: destination.starting_price || '',
            features: destination.features || [],
            packages: destination.packages || 0
          });
          
          setTranslations(destination.translations || {
            en: { name: destination.name, description: destination.description || '' },
            de: { name: '', description: '' },
            fr: { name: '', description: '' },
            es: { name: '', description: '' }
          });
          
          setIsLoading(false);
        })
        .catch(err => {
          console.error('Error fetching destination:', err);
          setError('Failed to load destination data. Please try again.');
          setIsLoading(false);
        });
    }
  }, [id]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
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
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage('');
    
    const destinationData = {
      ...formData,
      translations
    };
    
    try {
      if (id === 'new') {
        await createDestination(destinationData);
        setMessage('Destination created successfully!');
      } else {
        await updateDestination(id, destinationData);
        setMessage('Destination updated successfully!');
      }
      
      setTimeout(() => {
        navigate('/admin/destinations');
      }, 1500);
    } catch (err) {
      console.error('Error saving destination:', err);
      setError('Failed to save destination. Please try again.');
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
            {id === 'new' ? 'Add New Destination' : 'Edit Destination'}
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            type="button"
            onClick={() => navigate('/admin/destinations')}
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
                  Destination Name
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
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
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
                  Brief description of the destination for travelers.
                </p>
              </div>
            </div>

            {/* Add ImageUpload component */}
            <div className="mt-6">
              <ImageUpload
                currentImage={formData.coverimage}
                onImageChange={(url) => setFormData({ ...formData, coverimage: url })}
              />
            </div>
          </div>
          
          {/* Additional Information */}
          <div className="pt-8">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Additional Information</h3>
              <p className="mt-1 text-sm text-gray-500">
                Useful information for travelers visiting this destination.
              </p>
            </div>
            
            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
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
                        Destination Name
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
              onClick={() => navigate('/admin/destinations')}
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
              {id === 'new' ? 'Create Destination' : 'Update Destination'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}