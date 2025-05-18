import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { supabase } from '../services/supabaseService';

export default function HeroManager() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [settings, setSettings] = useState({
    background_image: '',
    phone_image: '',
    translations: {
      en: { title: '', subtitle: '' },
      sq: { title: '', subtitle: '' },
      fr: { title: '', subtitle: '' },
      de: { title: '', subtitle: '' },
      tr: { title: '', subtitle: '' }
    }
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cms_hero_settings')
        .select('*')
        .single();

      if (error) throw error;
      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error('Error loading hero settings:', error);
      setMessage({
        type: 'error',
        text: 'Failed to load hero settings'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e, type) => {
    try {
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
      const filePath = `hero/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      // Update settings
      setSettings(prev => ({
        ...prev,
        [type === 'background' ? 'background_image' : 'phone_image']: publicUrl
      }));

    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage({
        type: 'error',
        text: error.message
      });
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage({ type: '', text: '' });

      const { error } = await supabase
        .from('cms_hero_settings')
        .upsert(settings);

      if (error) throw error;

      setMessage({
        type: 'success',
        text: 'Hero settings saved successfully!'
      });
    } catch (error) {
      console.error('Error saving hero settings:', error);
      setMessage({
        type: 'error',
        text: 'Failed to save hero settings'
      });
    } finally {
      setSaving(false);
    }
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Hero Section Settings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your homepage hero section content
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
        {/* Images Section */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Images</h2>
          
          {/* Background Image */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Background Image
            </label>
            <div className="flex items-center gap-4">
              {settings.background_image && (
                <div className="relative w-32 h-24 rounded-lg overflow-hidden">
                  <img 
                    src={settings.background_image} 
                    alt="Background" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'background')}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-[#690d89] file:text-white
                    hover:file:bg-[#8B5CF6]"
                />
              </div>
            </div>
          </div>

          {/* Phone Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Image
            </label>
            <div className="flex items-center gap-4">
              {settings.phone_image && (
                <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                  <img 
                    src={settings.phone_image} 
                    alt="Phone" 
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'phone')}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-[#690d89] file:text-white
                    hover:file:bg-[#8B5CF6]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Translations Section */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Translations</h2>
          
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={content.title}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        translations: {
                          ...prev.translations,
                          [lang]: {
                            ...prev.translations[lang],
                            title: e.target.value
                          }
                        }
                      }))}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#690d89] focus:ring-[#690d89]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subtitle
                    </label>
                    <textarea
                      value={content.subtitle}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        translations: {
                          ...prev.translations,
                          [lang]: {
                            ...prev.translations[lang],
                            subtitle: e.target.value
                          }
                        }
                      }))}
                      rows={3}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#690d89] focus:ring-[#690d89]"
                    />
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