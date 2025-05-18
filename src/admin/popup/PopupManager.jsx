import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { supabase } from '../services/supabaseService';
import MediaSelector from '../../components/MediaSelector';

const DEFAULT_SETTINGS = {
  enabled: false,
  delay: 3000,
  background_image: '',
  translations: {
    en: { title: 'Get 1GB Free Internet!', description: 'Download our app now and enjoy 1GB of free data.' },
    sq: { title: 'Merrni 1GB Internet Falas!', description: 'Shkarkoni aplikacionin tonë tani dhe shijoni 1GB të dhëna falas.' },
    fr: { title: 'Obtenez 1GB d\'Internet Gratuit!', description: 'Téléchargez notre application maintenant et profitez de 1GB de données gratuites.' },
    de: { title: 'Erhalte 1GB kostenloses Internet!', description: 'Lade jetzt unsere App herunter und genieße 1GB kostenlose Daten.' },
    tr: { title: '1GB Ücretsiz İnternet Alın!', description: 'Şimdi uygulamamızı indirin ve 1GB ücretsiz veri keyfini çıkarın.' }
  },
  app_store_url: 'https://apps.apple.com/app/kudosim',
  play_store_url: 'https://play.google.com/store/apps/details?id=com.kudosim'
};

export default function PopupManager() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cms_settings')
        .select('*')
        .eq('key', 'popup')
        .maybeSingle(); // Use maybeSingle() instead of single()

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data?.value) {
        setSettings(data.value);
      } else {
        // If no settings exist, we'll use the default settings
        setSettings(DEFAULT_SETTINGS);
      }
    } catch (error) {
      console.error('Error loading popup settings:', error);
      setMessage({
        type: 'error',
        text: 'Failed to load popup settings'
      });
      // Use default settings in case of error
      setSettings(DEFAULT_SETTINGS);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage({ type: '', text: '' });

      // First check if the record exists
      const { data: existingData, error: checkError } = await supabase
        .from('cms_settings')
        .select('id')
        .eq('key', 'popup')
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      let saveError;
      if (existingData?.id) {
        // Update existing record
        const { error } = await supabase
          .from('cms_settings')
          .update({ value: settings })
          .eq('key', 'popup');
        saveError = error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from('cms_settings')
          .insert({ 
            key: 'popup',
            value: settings
          });
        saveError = error;
      }

      if (saveError) throw saveError;

      // Clear any cached settings
      sessionStorage.removeItem('kudosim_popup_settings');

      setMessage({
        type: 'success',
        text: 'Popup settings saved successfully!'
      });
    } catch (error) {
      console.error('Error saving popup settings:', error);
      setMessage({
        type: 'error',
        text: 'Error saving popup settings: ' + error.message
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTranslationChange = (lang, field, value) => {
    setSettings(prev => ({
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

  // Preview component
  const PopupPreview = () => (
    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-md">
      <div className="flex flex-col md:flex-row">
        {/* Image section */}
        <div className="w-full md:w-1/2 relative">
          {settings.background_image ? (
            <img 
              src={settings.background_image} 
              alt="App promotion" 
              className="w-full h-full object-cover"
              style={{ maxHeight: '300px' }}
            />
          ) : (
            <div className="w-full h-full min-h-[200px] bg-gradient-to-br from-[#690d89] to-[#8B5CF6] flex items-center justify-center">
              <img 
                src="/telefoni.webp" 
                alt="Mobile device" 
                className="max-h-[200px] object-contain"
              />
            </div>
          )}
        </div>

        {/* Content section */}
        <div className="w-full md:w-1/2 p-6 flex flex-col">
          <h2 className="text-2xl font-bold text-[#690d89] mb-2">
            {settings.translations.en.title}
          </h2>
          <p className="text-gray-600 mb-6">
            {settings.translations.en.description}
          </p>

          {/* App store buttons */}
          <div className="mt-auto space-y-3">
            {/* App Store */}
            <div className="flex items-center justify-center gap-2 w-full bg-black text-white py-3 px-4 rounded-lg">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.3,2.5C16.7,3,17,3.7,17,4.6c0,1.1-0.6,2.1-1.5,2.7c-0.9,0.5-1.9,0.5-2.9,0.3c-0.1-1,0.3-2,0.9-2.7 C14.2,4,15.3,3.5,16.3,2.5z M20.8,17.8c0.1,0.2,0.2,0.3,0.2,0.5c0,0.1-0.1,0.3-0.2,0.4c-0.8,1.1-1.7,2.2-2.7,3.1 c-0.5,0.5-1.2,0.5-1.8,0.1c-0.7-0.4-1.4-0.9-2.1-1.3c-0.7-0.4-1.4-0.4-2.1,0c-0.7,0.4-1.4,0.9-2.1,1.3c-0.6,0.4-1.3,0.4-1.8-0.1 c-1-0.9-1.9-2-2.7-3.1c-0.8-1.1-1.5-2.3-1.9-3.6c-0.4-1.3-0.5-2.7-0.3-4c0.2-1.5,0.8-2.9,1.8-4c1-1.1,2.3-1.6,3.8-1.6 c0.7,0,1.4,0.2,2.1,0.4c0.6,0.2,1.2,0.4,1.8,0.4c0.5,0,1.1-0.1,1.6-0.3c0.7-0.2,1.3-0.4,2-0.5c1.3-0.1,2.5,0.2,3.5,0.9 c-0.3,0.2-0.6,0.4-0.8,0.6c-0.8,0.8-1.3,1.7-1.3,2.8c0,1.2,0.5,2.1,1.3,2.9c0.5,0.5,1.1,0.8,1.8,0.9c-0.2,0.6-0.4,1.2-0.6,1.8 C20.9,15.4,20.6,16.6,20.8,17.8z"/>
              </svg>
              <span>Download on the App Store</span>
            </div>
            
            {/* Google Play */}
            <div className="flex items-center justify-center gap-2 w-full bg-[#690d89] text-white py-3 px-4 rounded-lg">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.609 1.814L13.792 12 3.609 22.186c-.181.181-.29.423-.29.684v-.369c0-.261.109-.513.29-.684L13.402 12 3.609 2.198c-.181-.181-.29-.423-.29-.684v.3c0 .261.109.513.29.684zm10.831 9.326l2.274-1.276-2.274-1.276-1.969 1.276 1.969 1.276zM5.83 1.497L14.217 6.2l2.265-1.272c1.388-.779 1.887-.651 2.327-.241.23.215.357.506.357.809 0 .545-.357 1.078-1.009 1.445l-1.259.704 1.25.704c.652.368 1.018.9 1.018 1.446 0 .303-.126.594-.357.809-.441.41-.939.539-2.327-.241l-2.265-1.272-8.387 4.702c1.258.704 2.516 0 2.516 0L16.56 8.991v6.182l-5.92-3.326-5.022 2.816c0 .001 1.46.823 2.769.107L16.56 8.992V2.811L8.338 7.133 5.83 5.648v-4.15z"/>
              </svg>
              <span>Get it on Google Play</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#690d89]"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Popup Settings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Configure the app download promotion popup
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#690d89] hover:bg-[#8B5CF6] disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded-md ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        {/* General Settings */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-lg font-medium text-gray-900 mb-4">General Settings</h2>
          
          <div className="space-y-4">
            {/* Enable/Disable Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-gray-700">Enable Popup</label>
                <p className="text-sm text-gray-500">Show the popup to visitors</p>
              </div>
              <button
                onClick={() => setSettings(prev => ({
                  ...prev,
                  enabled: !prev.enabled
                }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.enabled ? 'bg-[#690d89]' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Delay Setting */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Display Delay (seconds)</label>
              <input
                type="number"
                min="0"
                max="60"
                value={settings.delay / 1000}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  delay: parseInt(e.target.value) * 1000
                }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#690d89] focus:ring-[#690d89]"
              />
              <p className="mt-1 text-xs text-gray-500">
                How many seconds to wait before showing the popup
              </p>
            </div>

            {/* Background Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Background Image
              </label>
              <MediaSelector
                selectedUrl={settings.background_image}
                onSelect={(url) => setSettings(prev => ({
                  ...prev,
                  background_image: url
                }))}
                type="image"
              />
              <p className="mt-1 text-xs text-gray-500">
                Leave empty to use the default gradient background
              </p>
            </div>
          </div>
        </div>

        {/* App Store Links */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-lg font-medium text-gray-900 mb-4">App Store Links</h2>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* App Store URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                App Store URL
              </label>
              <input
                type="url"
                value={settings.app_store_url}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  app_store_url: e.target.value
                }))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#690d89] focus:ring-[#690d89]"
                placeholder="https://apps.apple.com/app/kudosim"
              />
            </div>

            {/* Play Store URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Play Store URL
              </label>
              <input
                type="url"
                value={settings.play_store_url}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  play_store_url: e.target.value
                }))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#690d89] focus:ring-[#690d89]"
                placeholder="https://play.google.com/store/apps/details?id=com.kudosim"
              />
            </div>
          </div>
        </div>

        {/* Translations */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2  className="text-lg font-medium text-gray-900 mb-4">Translations</h2>
          
          <div className="space-y-6">
            {Object.entries(settings.translations).map(([lang, content]) => (
              <div key={lang} className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-md font-medium text-gray-900 mb-4">
                  {lang === 'en' ? 'English' : 
                   lang === 'sq' ? 'Albanian' : 
                   lang === 'fr' ? 'French' : 
                   lang === 'de' ? 'German' :
                   lang === 'tr' ? 'Turkish' : 
                   lang}
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Title
                    </label>
                    <input
                      type="text"
                      value={content.title}
                      onChange={(e) => handleTranslationChange(lang, 'title', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#690d89] focus:ring-[#690d89]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      value={content.description}
                      onChange={(e) => handleTranslationChange(lang, 'description', e.target.value)}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#690d89] focus:ring-[#690d89]"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Preview</h2>
          <PopupPreview />
          <p className="mt-4 text-sm text-gray-500 text-center">
            This is how the popup will appear to visitors. The actual popup will be shown as a modal overlay.
          </p>
        </div>
      </div>
    </div>
  );
}