import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { supabase } from '../services/supabaseService';

const LogoUpload = ({ currentLogo, onLogoChange }) => {
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

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        throw new Error('File size must be less than 2MB');
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `site-logo.${fileExt}`;
      const filePath = `settings/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('media')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      onLogoChange(publicUrl);
    } catch (err) {
      console.error('Error uploading logo:', err);
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Site Logo
      </label>
      
      <div className="flex items-center gap-4">
        {/* Current Logo Preview */}
        {currentLogo && (
          <div className="relative w-32 h-12 rounded-lg overflow-hidden bg-white p-2">
            <img 
              src={currentLogo} 
              alt="Site logo" 
              className="w-full h-full object-contain"
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
              <p className="text-xs text-gray-500">SVG, PNG, JPG up to 2MB</p>
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

export default function Settings() {
  const { currentLang } = useOutletContext();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [settings, setSettings] = useState({
    site: {
      title: 'KudoSIM',
      tagline: 'Global Connectivity for Modern Travelers',
      logo: '/kudosim-logo.svg',
      favicon: '/favicon.ico',
      primaryColor: '#690d89',
      secondaryColor: '#8B5CF6'
    },
    contact: {
      email: 'support@kudosim.com',
      phone: '+1 (555) 123-4567',
      address: '123 Global Street, Tech City, 10001'
    },
    social: {
      facebook: 'https://facebook.com/kudosim',
      twitter: 'https://twitter.com/kudosim',
      instagram: 'https://instagram.com/kudosim',
      linkedin: 'https://linkedin.com/company/kudosim'
    },
    languages: {
      default: 'en',
      available: ['en', 'de', 'fr', 'es']
    },
    seo: {
      metaTitle: 'KudoSIM - Global Connectivity for Modern Travelers',
      metaDescription: 'Stay connected worldwide with KudoSIM eSIM technology. No physical SIM needed, just scan and connect.',
      googleAnalyticsId: 'UA-XXXXXXXXX-X'
    },
    api: {
      stripePublicKey: 'pk_test_XXXXXXXXXXXXXXXXXXXXXXXX',
      mapboxToken: 'pk.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
    }
  });

  // Load settings from localStorage
  useEffect(() => {
    setIsLoading(true);
    try {
      const savedSettings = localStorage.getItem('kudosim_settings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      setMessage({
        type: 'error',
        text: 'Failed to load settings. Using default values.'
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleInputChange = (category, field, value) => {
    setSettings({
      ...settings,
      [category]: {
        ...settings[category],
        [field]: value
      }
    });
  };

  const handleArrayChange = (category, field, index, value) => {
    const newArray = [...settings[category][field]];
    newArray[index] = value;
    
    setSettings({
      ...settings,
      [category]: {
        ...settings[category],
        [field]: newArray
      }
    });
  };

  const handleAddLanguage = () => {
    // Example of adding a new language
    const newLanguage = prompt('Enter language code (e.g., it, pt):');
    if (newLanguage && !settings.languages.available.includes(newLanguage)) {
      setSettings({
        ...settings,
        languages: {
          ...settings.languages,
          available: [...settings.languages.available, newLanguage]
        }
      });
    }
  };

  const handleRemoveLanguage = (langToRemove) => {
    // Don't allow removing the default language
    if (langToRemove === settings.languages.default) {
      alert('Cannot remove the default language.');
      return;
    }
    
    setSettings({
      ...settings,
      languages: {
        ...settings.languages,
        available: settings.languages.available.filter(lang => lang !== langToRemove)
      }
    });
  };

  const handleSaveSettings = () => {
    setIsSaving(true);
    setMessage({ type: '', text: '' });
    
    try {
      // Save settings to localStorage
      localStorage.setItem('kudosim_settings', JSON.stringify(settings));
      
      // Show success message
      setTimeout(() => {
        setIsSaving(false);
        setMessage({
          type: 'success',
          text: 'Settings saved successfully!'
        });
      }, 1000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setIsSaving(false);
      setMessage({
        type: 'error',
        text: 'Failed to save settings. Please try again.'
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#690d89]"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Configure your website settings
          </p>
        </div>
        <button
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="inline-flex items-center px-4 py-2 mt-4 text-sm font-medium text-white bg-[#690d89] border border-transparent rounded-md shadow-sm hover:bg-[#8B5CF6] sm:mt-0 disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            <>
              <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Save Settings
            </>
          )}
        </button>
      </div>

      {/* Message display */}
      {message.text && (
        <div className={`mt-4 p-4 rounded-md ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          <div className="flex">
            <div className="flex-shrink-0">
              {message.type === 'success' ? (
                <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm">{message.text}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 space-y-8">
        {/* Site Settings */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Site Settings</h2>
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="site-title" className="block text-sm font-medium text-gray-700">
                Site Title
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="site-title"
                  value={settings.site.title}
                  onChange={(e) => handleInputChange('site', 'title', e.target.value)}
                  className="shadow-sm focus:ring-[#690d89] focus:border-[#690d89] block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="site-tagline" className="block text-sm font-medium text-gray-700">
                Tagline
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="site-tagline"
                  value={settings.site.tagline}
                  onChange={(e) => handleInputChange('site', 'tagline', e.target.value)}
                  className="shadow-sm focus:ring-[#690d89] focus:border-[#690d89] block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <LogoUpload 
                currentLogo={settings.site.logo}
                onLogoChange={(url) => handleInputChange('site', 'logo', url)}
              />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="site-favicon" className="block text-sm font-medium text-gray-700">
                Favicon Path
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="site-favicon"
                  value={settings.site.favicon}
                  onChange={(e) => handleInputChange('site', 'favicon', e.target.value)}
                  className="shadow-sm focus:ring-[#690d89] focus:border-[#690d89] block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="primary-color" className="block text-sm font-medium text-gray-700">
                Primary Color
              </label>
              <div className="mt-1 flex items-center">
                <input
                  type="color"
                  id="primary-color"
                  value={settings.site.primaryColor}
                  onChange={(e) => handleInputChange('site', 'primaryColor', e.target.value)}
                  className="h-8 w-8 rounded-md border border-gray-300 mr-2"
                />
                <input
                  type="text"
                  value={settings.site.primaryColor}
                  onChange={(e) => handleInputChange('site', 'primaryColor', e.target.value)}
                  className="shadow-sm focus:ring-[#690d89] focus:border-[#690d89] block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="secondary-color" className="block text-sm font-medium text-gray-700">
                Secondary Color
              </label>
              <div className="mt-1 flex items-center">
                <input
                  type="color"
                  id="secondary-color"
                  value={settings.site.secondaryColor}
                  onChange={(e) => handleInputChange('site', 'secondaryColor', e.target.value)}
                  className="h-8 w-8 rounded-md border border-gray-300 mr-2"
                />
                <input
                  type="text"
                  value={settings.site.secondaryColor}
                  onChange={(e) => handleInputChange('site', 'secondaryColor', e.target.value)}
                  className="shadow-sm focus:ring-[#690d89] focus:border-[#690d89] block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  id="contact-email"
                  value={settings.contact.email}
                  onChange={(e) => handleInputChange('contact', 'email', e.target.value)}
                  className="shadow-sm focus:ring-[#690d89] focus:border-[#690d89] block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="contact-phone" className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="contact-phone"
                  value={settings.contact.phone}
                  onChange={(e) => handleInputChange('contact', 'phone', e.target.value)}
                  className="shadow-sm focus:ring-[#690d89] focus:border-[#690d89] block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="contact-address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <div className="mt-1">
                <textarea
                  id="contact-address"
                  rows={3}
                  value={settings.contact.address}
                  onChange={(e) => handleInputChange('contact', 'address', e.target.value)}
                  className="shadow-sm focus:ring-[#690d89] focus:border-[#690d89] block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Social Media</h2>
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="social-facebook" className="block text-sm font-medium text-gray-700">
                Facebook
              </label>
              <div className="mt-1">
                <input
                  type="url"
                  id="social-facebook"
                  value={settings.social.facebook}
                  onChange={(e) => handleInputChange('social', 'facebook', e.target.value)}
                  className="shadow-sm focus:ring-[#690d89] focus:border-[#690d89] block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="social-twitter" className="block text-sm font-medium text-gray-700">
                Twitter
              </label>
              <div className="mt-1">
                <input
                  type="url"
                  id="social-twitter"
                  value={settings.social.twitter}
                  onChange={(e) => handleInputChange('social', 'twitter', e.target.value)}
                  className="shadow-sm focus:ring-[#690d89] focus:border-[#690d89] block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="social-instagram" className="block text-sm font-medium text-gray-700">
                Instagram
              </label>
              <div className="mt-1">
                <input
                  type="url"
                  id="social-instagram"
                  value={settings.social.instagram}
                  onChange={(e) => handleInputChange('social', 'instagram', e.target.value)}
                  className="shadow-sm focus:ring-[#690d89] focus:border-[#690d89] block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="social-linkedin" className="block text-sm font-medium text-gray-700">
                LinkedIn
              </label>
              <div className="mt-1">
                <input
                  type="url"
                  id="social-linkedin"
                  value={settings.social.linkedin}
                  onChange={(e) => handleInputChange('social', 'linkedin', e.target.value)}
                  className="shadow-sm focus:ring-[#690d89] focus:border-[#690d89] block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Language Settings */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Language Settings</h2>
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="default-language" className="block text-sm font-medium text-gray-700">
                Default Language
              </label>
              <div className="mt-1">
                <select
                  id="default-language"
                  value={settings.languages.default}
                  onChange={(e) => handleInputChange('languages', 'default', e.target.value)}
                  className="shadow-sm focus:ring-[#690d89] focus:border-[#690d89] block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  {settings.languages.available.map(lang => (
                    <option key={lang} value={lang}>
                      {lang === 'en' ? 'English' : 
                       lang === 'de' ? 'German' : 
                       lang === 'fr' ? 'French' : 
                       lang === 'es' ? 'Spanish' : lang.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="sm:col-span-6">
              <label className="block text-sm font-medium text-gray-700">
                Available Languages
              </label>
              <div className="mt-2 flex flex-wrap gap-2">
                {settings.languages.available.map((lang, index) => (
                  <div
                    key={lang}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#690d89]/10 text-[#690d89]"
                  >
                    {lang === 'en' ? 'English' : 
                     lang === 'de' ? 'German' : 
                     lang === 'fr' ? 'French' : 
                     lang === 'es' ? 'Spanish' : lang.toUpperCase()}
                    
                    {/* Don't allow removing the default language */}
                    {lang !== settings.languages.default && (
                      <button
                        type="button"
                        onClick={() => handleRemoveLanguage(lang)}
                        className="ml-1 inline-flex text-[#690d89] focus:outline-none"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddLanguage}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200"
                >
                  <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Language
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SEO Settings */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">SEO Settings</h2>
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-6">
              <label htmlFor="meta-title" className="block text-sm font-medium text-gray-700">
                Default Meta Title
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="meta-title"
                  value={settings.seo.metaTitle}
                  onChange={(e) => handleInputChange('seo', 'metaTitle', e.target.value)}
                  className="shadow-sm focus:ring-[#690d89] focus:border-[#690d89] block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="meta-description" className="block text-sm font-medium text-gray-700">
                Default Meta Description
              </label>
              <div className="mt-1">
                <textarea
                  id="meta-description"
                  rows={3}
                  value={settings.seo.metaDescription}
                  onChange={(e) => handleInputChange('seo', 'metaDescription', e.target.value)}
                  className="shadow-sm focus:ring-[#690d89] focus:border-[#690d89] block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="google-analytics" className="block text-sm font-medium text-gray-700">
                Google Analytics ID
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="google-analytics"
                  value={settings.seo.googleAnalyticsId}
                  onChange={(e) => handleInputChange('seo', 'googleAnalyticsId', e.target.value)}
                  className="shadow-sm focus:ring-[#690d89] focus:border-[#690d89] block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="UA-XXXXXXXXX-X"
                />
              </div>
            </div>
          </div>
        </div>

        {/* API Keys */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">API Keys</h2>
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-6">
              <label htmlFor="stripe-key" className="block text-sm font-medium text-gray-700">
                Stripe Public Key
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="stripe-key"
                  value={settings.api.stripePublicKey}
                  onChange={(e) => handleInputChange('api', 'stripePublicKey', e.target.value)}
                  className="shadow-sm focus:ring-[#690d89] focus:border-[#690d89] block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="pk_test_XXXXXXXXXXXXXXXXXXXXXXXX"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Note: Stripe Secret Key should be set in server environment variables, not here.
              </p>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="mapbox-token" className="block text-sm font-medium text-gray-700">
                Mapbox Token
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="mapbox-token"
                  value={settings.api.mapboxToken}
                  onChange={(e) => handleInputChange('api', 'mapbox-token', e.target.value)}
                  className="shadow-sm focus:ring-[#690d89] focus:border-[#690d89] block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="pk.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button (Bottom) */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#690d89] hover:bg-[#8B5CF6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#690d89] disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            <>
              <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Save Settings
            </>
          )}
        </button>
      </div>
    </div>
  );
}