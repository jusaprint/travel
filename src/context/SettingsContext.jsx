import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../lib/cms';

// Create context
const SettingsContext = createContext(null);

// Custom hook to use the settings context
export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}

// Provider component
export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get all settings from Supabase
        const { data, error } = await supabase
          .from('cms_settings')
          .select('*');

        if (error) throw error;

        // Convert array of settings to nested object structure
        const settingsObject = {
          site: {},
          contact: {},
          social: {},
          api: {}
        };

        data?.forEach(setting => {
          const [category, key] = setting.key.split('.');
          if (!settingsObject[category]) {
            settingsObject[category] = {};
          }
          settingsObject[category][key] = setting.value;
        });

        setSettings(settingsObject);
      } catch (err) {
        console.error('Error loading settings:', err);
        setError(err.message);
        
        // Load default settings as fallback
        const defaultSettings = {
          site: {
            title: 'KudoSIM',
            tagline: 'Global Connectivity for Modern Travelers',
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
          }
        };
        setSettings(defaultSettings);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();

    // Set up a listener for real-time updates
    const subscription = supabase
      .channel('settings_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'cms_settings' 
      }, payload => {
        loadSettings();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const updateSettings = async (category, key, value) => {
    try {
      const { error } = await supabase
        .from('cms_settings')
        .upsert({ 
          key: `${category}.${key}`,
          value
        });

      if (error) throw error;

      setSettings(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          [key]: value
        }
      }));

      return { success: true };
    } catch (err) {
      console.error('Error updating settings:', err);
      return { success: false, error: err.message };
    }
  };

  return (
    <SettingsContext.Provider value={{ 
      settings, 
      loading, 
      error,
      updateSettings
    }}>
      {children}
    </SettingsContext.Provider>
  );
}