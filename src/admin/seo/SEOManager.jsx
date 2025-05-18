import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { supabase } from '../services/supabaseService';

export default function SEOManager() {
  const { currentLang } = useOutletContext();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [seoData, setSeoData] = useState({
    global: {
      siteName: 'KudoSIM',
      titleTemplate: '%s | KudoSIM',
      defaultTitle: 'KudoSIM - Global Connectivity for Modern Travelers',
      defaultDescription: 'Stay connected worldwide with KudoSIM eSIM technology. No physical SIM needed, just scan and connect.',
      defaultImage: '/og-image.jpg',
      twitterHandle: '@kudosim',
      googleAnalyticsId: ''
    },
    translations: {
      en: {},
      sq: {},
      fr: {},
      es: {}
    },
    robots: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1
    }
  });

  useEffect(() => {
    loadSEOSettings();
  }, []);

  const loadSEOSettings = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('cms_settings')
        .select('*')
        .eq('key', 'seo');

      if (error) throw error;

      if (data?.[0]?.value) {
        setSeoData(data[0].value);
      }
    } catch (error) {
      console.error('Error loading SEO settings:', error);
      setMessage({
        type: 'error',
        text: 'Failed to load SEO settings. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (section, field, value) => {
    setSeoData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleTranslationChange = (lang, field, value) => {
    setSeoData(prev => ({
      ...prev,
      translations: {
        ...prev.translations,
        [lang]: {
          ...prev.translations[lang],
          [field]: value
        }
      }
    }));
  };

  const handleRobotsChange = (directive, value) => {
    setSeoData(prev => ({
      ...prev,
      robots: {
        ...prev.robots,
        [directive]: value
      }
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setMessage({ type: '', text: '' });

      const { error } = await supabase
        .from('cms_settings')
        .upsert({ 
          key: 'seo',
          value: seoData
        });

      if (error) throw error;

      setMessage({
        type: 'success',
        text: 'SEO settings saved successfully!'
      });
    } catch (error) {
      console.error('Error saving SEO settings:', error);
      setMessage({
        type: 'error',
        text: 'Failed to save SEO settings. Please try again.'
      });
    } finally {
      setIsSaving(false);
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
          <h1 className="text-2xl font-bold text-gray-900">SEO Settings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your website's search engine optimization settings
          </p>
        </div>
        <button
          onClick={handleSave}
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
            'Save Settings'
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
        {/* Global SEO Settings */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Global SEO Settings</h2>
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="siteName" className="block text-sm font-medium text-gray-700">
                Site Name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="siteName"
                  value={seoData.global.siteName}
                  onChange={(e) => handleInputChange('global', 'siteName', e.target.value)}
                  className="shadow-sm focus:ring-[#690d89] focus:border-[#690d89] block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="titleTemplate" className="block text-sm font-medium text-gray-700">
                Title Template
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="titleTemplate"
                  value={seoData.global.titleTemplate}
                  onChange={(e) => handleInputChange('global', 'titleTemplate', e.target.value)}
                  className="shadow-sm focus:ring-[#690d89] focus:border-[#690d89] block w-full sm:text-sm border-gray-300 rounded-md"
                />
                <p className="mt-1 text-xs text-gray-500">Use %s for page title placement</p>
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="defaultTitle" className="block text-sm font-medium text-gray-700">
                Default Title
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="defaultTitle"
                  value={seoData.global.defaultTitle}
                  onChange={(e) => handleInputChange('global', 'defaultTitle', e.target.value)}
                  className="shadow-sm focus:ring-[#690d89] focus:border-[#690d89] block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="defaultDescription" className="block text-sm font-medium text-gray-700">
                Default Description
              </label>
              <div className="mt-1">
                <textarea
                  id="defaultDescription"
                  rows={3}
                  value={seoData.global.defaultDescription}
                  onChange={(e) => handleInputChange('global', 'defaultDescription', e.target.value)}
                  className="shadow-sm focus:ring-[#690d89] focus:border-[#690d89] block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="defaultImage" className="block text-sm font-medium text-gray-700">
                Default Social Image
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="defaultImage"
                  value={seoData.global.defaultImage}
                  onChange={(e) => handleInputChange('global', 'defaultImage', e.target.value)}
                  className="shadow-sm focus:ring-[#690d89] focus:border-[#690d89] block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="twitterHandle" className="block text-sm font-medium text-gray-700">
                Twitter Handle
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="twitterHandle"
                  value={seoData.global.twitterHandle}
                  onChange={(e) => handleInputChange('global', 'twitterHandle', e.target.value)}
                  className="shadow-sm focus:ring-[#690d89] focus:border-[#690d89] block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="googleAnalyticsId" className="block text-sm font-medium text-gray-700">
                Google Analytics ID
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="googleAnalyticsId"
                  value={seoData.global.googleAnalyticsId}
                  onChange={(e) => handleInputChange('global', 'googleAnalyticsId', e.target.value)}
                  className="shadow-sm focus:ring-[#690d89] focus:border-[#690d89] block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="G-XXXXXXXXXX"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Robots Settings */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Robots Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="index"
                checked={seoData.robots.index}
                onChange={(e) => handleRobotsChange('index', e.target.checked)}
                className="focus:ring-[#690d89] h-4 w-4 text-[#690d89] border-gray-300 rounded"
              />
              <label htmlFor="index" className="ml-2 block text-sm text-gray-900">
                Allow search engines to index pages
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="follow"
                checked={seoData.robots.follow}
                onChange={(e) => handleRobotsChange('follow', e.target.checked)}
                className="focus:ring-[#690d89] h-4 w-4 text-[#690d89] border-gray-300 rounded"
              />
              <label htmlFor="follow" className="ml-2 block text-sm text-gray-900">
                Allow search engines to follow links
              </label>
            </div>
          </div>
        </div>

        {/* Translations */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">SEO Translations</h2>
          <div className="space-y-6">
            {Object.keys(seoData.translations).map((lang) => (
              <div key={lang} className="border border-gray-200 rounded-md p-4">
                <h3 className="text-md font-medium text-gray-900 mb-4">
                  {lang === 'en' ? 'English' : 
                   lang === 'sq' ? 'Albanian' : 
                   lang === 'fr' ? 'French' : 
                   'Spanish'}
                </h3>
                
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-6">
                    <label htmlFor={`title-${lang}`} className="block text-sm font-medium text-gray-700">
                      Default Title
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id={`title-${lang}`}
                        value={seoData.translations[lang].defaultTitle || ''}
                        onChange={(e) => handleTranslationChange(lang, 'defaultTitle', e.target.value)}
                        className="shadow-sm focus:ring-[#690d89] focus:border-[#690d89] block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-6">
                    <label htmlFor={`description-${lang}`} className="block text-sm font-medium text-gray-700">
                      Default Description
                    </label>
                    <div className="mt-1">
                      <textarea
                        id={`description-${lang}`}
                        rows={3}
                        value={seoData.translations[lang].defaultDescription || ''}
                        onChange={(e) => handleTranslationChange(lang, 'defaultDescription', e.target.value)}
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
    </div>
  );
}