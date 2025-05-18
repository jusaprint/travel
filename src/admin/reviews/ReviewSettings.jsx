import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../services/supabaseService';

export default function ReviewSettings() {
  const [settings, setSettings] = useState({
    autoModeration: {
      enabled: true,
      minRating: 1,
      keywords: [],
      requireVerification: true
    },
    notifications: {
      newReview: true,
      pendingModeration: true,
      customerResponse: true,
      emailNotifications: true
    },
    display: {
      showRating: true,
      showDate: true,
      showLocation: true,
      sortBy: 'newest'
    }
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('cms_settings')
        .select('*')
        .eq('key', 'review_settings')
        .single();

      if (error) throw error;
      if (data?.value) {
        setSettings(data.value);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('cms_settings')
        .upsert({
          key: 'review_settings',
          value: settings
        });

      if (error) throw error;

      setMessage({
        type: 'success',
        text: 'Settings saved successfully!'
      });

      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({
        type: 'error',
        text: 'Failed to save settings. Please try again.'
      });
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
          <h1 className="text-2xl font-bold text-gray-900">Review Settings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Configure review management preferences
          </p>
        </div>
        <button
          onClick={handleSave}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#690d89] hover:bg-[#8B5CF6]"
        >
          Save Changes
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
        {/* Auto-Moderation Settings */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Auto-Moderation</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-gray-700">Enable Auto-Moderation</label>
                <p className="text-sm text-gray-500">Automatically moderate reviews based on rules</p>
              </div>
              <button
                onClick={() => setSettings(prev => ({
                  ...prev,
                  autoModeration: {
                    ...prev.autoModeration,
                    enabled: !prev.autoModeration.enabled
                  }
                }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.autoModeration.enabled ? 'bg-[#690d89]' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.autoModeration.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div>
              <label className="block font-medium text-gray-700">Minimum Rating</label>
              <select
                value={settings.autoModeration.minRating}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  autoModeration: {
                    ...prev.autoModeration,
                    minRating: parseInt(e.target.value)
                  }
                }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#690d89] focus:ring-[#690d89]"
              >
                {[1, 2, 3, 4, 5].map(rating => (
                  <option key={rating} value={rating}>{rating} Stars</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-gray-700">Blocked Keywords</label>
              <div className="mt-1">
                <textarea
                  value={settings.autoModeration.keywords.join('\n')}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    autoModeration: {
                      ...prev.autoModeration,
                      keywords: e.target.value.split('\n').filter(k => k.trim())
                    }
                  }))}
                  rows={4}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#690d89] focus:ring-[#690d89]"
                  placeholder="Enter keywords (one per line)"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Notifications</h2>
          <div className="space-y-4">
            {Object.entries(settings.notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-gray-700">
                    {key.split(/(?=[A-Z])/).join(' ')}
                  </label>
                </div>
                <button
                  onClick={() => setSettings(prev => ({
                    ...prev,
                    notifications: {
                      ...prev.notifications,
                      [key]: !value
                    }
                  }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    value ? 'bg-[#690d89]' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      value ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Display Settings */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Display Settings</h2>
          <div className="space-y-4">
            {Object.entries(settings.display).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-gray-700">
                    {key === 'sortBy' ? 'Default Sort Order' : `Show ${key}`}
                  </label>
                </div>
                {key === 'sortBy' ? (
                  <select
                    value={value}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      display: {
                        ...prev.display,
                        sortBy: e.target.value
                      }
                    }))}
                    className="rounded-md border-gray-300 shadow-sm focus:border-[#690d89] focus:ring-[#690d89]"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                ) : (
                  <button
                    onClick={() => setSettings(prev => ({
                      ...prev,
                      display: {
                        ...prev.display,
                        [key]: !value
                      }
                    }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      value ? 'bg-[#690d89]' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        value ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}