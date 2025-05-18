import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../services/supabaseService';
import { useLanguage } from '../../context/LanguageContext';
import Fuse from 'fuse.js';

// Translation key component
const TranslationKey = ({ translationKey, translations, onUpdate, languages }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTranslations, setEditedTranslations] = useState({...translations});
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (lang, value) => {
    setEditedTranslations({
      ...editedTranslations,
      [lang]: value
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdate(translationKey, editedTranslations);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving translations:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-white">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{translationKey}</h3>
          <p className="text-sm text-gray-500">Translation key</p>
        </div>
        <div>
          {isEditing ? (
            <div className="flex space-x-2">
              <button
                onClick={() => setIsEditing(false)}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-[#690d89] hover:bg-[#8B5CF6]"
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
                  'Save'
                )}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Edit
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {languages.map(lang => (
          <div key={lang.code} className="flex flex-col">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {lang.name}
            </label>
            {isEditing ? (
              <textarea
                value={editedTranslations[lang.code] || ''}
                onChange={(e) => handleChange(lang.code, e.target.value)}
                className="shadow-sm focus:ring-[#690d89] focus:border-[#690d89] block w-full sm:text-sm border-gray-300 rounded-md"
                rows={2}
              />
            ) : (
              <div className="p-2 bg-gray-50 rounded-md text-sm text-gray-800 min-h-[3rem]">
                {translations[lang.code] || <span className="text-gray-400 italic">Not translated</span>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Translation history component
const TranslationHistory = ({ translationId }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const { data, error } = await supabase
          .from('cms_translation_history')
          .select('*')
          .eq('translation_id', translationId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setHistory(data);
      } catch (error) {
        console.error('Error loading translation history:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [translationId]);

  if (loading) {
    return <div className="text-center py-4">Loading history...</div>;
  }

  return (
    <div className="space-y-4">
      {history.map((entry) => (
        <div key={entry.id} className="border-l-4 border-[#690d89] pl-4 py-2">
          <div className="text-sm text-gray-500">
            {new Date(entry.created_at).toLocaleString()}
          </div>
          <div className="mt-1">
            <div className="text-red-600 line-through">{entry.previous_value}</div>
            <div className="text-green-600">{entry.new_value}</div>
          </div>
        </div>
      ))}
      {history.length === 0 && (
        <div className="text-center text-gray-500">No history available</div>
      )}
    </div>
  );
};

// Main component
export default function TranslationManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [translations, setTranslations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTranslation, setSelectedTranslation] = useState(null);
  const { languages } = useLanguage();
  const [categories, setCategories] = useState(['all']);
  const [newTranslation, setNewTranslation] = useState({
    key: '',
    category: '',
    translations: {}
  });
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Load translations
  useEffect(() => {
    loadTranslations();
  }, []);

  const loadTranslations = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('cms_translations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Extract unique categories
      const uniqueCategories = ['all', ...new Set(data.map(item => item.category))];
      setCategories(uniqueCategories);
      
      setTranslations(data || []);
    } catch (error) {
      console.error('Error loading translations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update translation
  const handleUpdateTranslation = async (key, newTranslations) => {
    try {
      const { error } = await supabase
        .from('cms_translations')
        .update({ translations: newTranslations })
        .eq('key', key);

      if (error) throw error;
      await loadTranslations();
    } catch (error) {
      console.error('Error updating translation:', error);
      throw error;
    }
  };

  // Add new translation
  const handleAddTranslation = async () => {
    try {
      if (!newTranslation.key || !newTranslation.category) {
        alert('Key and category are required');
        return;
      }

      // Prepare translations object with all languages
      const translationsObj = {};
      languages.forEach(lang => {
        translationsObj[lang.code] = newTranslation.translations[lang.code] || '';
      });

      const { error } = await supabase
        .from('cms_translations')
        .insert([{
          key: newTranslation.key,
          category: newTranslation.category,
          translations: translationsObj
        }]);

      if (error) throw error;
      
      // Reset form and reload
      setNewTranslation({
        key: '',
        category: '',
        translations: {}
      });
      setIsAddingNew(false);
      await loadTranslations();
    } catch (error) {
      console.error('Error adding translation:', error);
      alert('Failed to add translation: ' + error.message);
    }
  };

  // Delete translation
  const handleDeleteTranslation = async (key) => {
    if (!window.confirm('Are you sure you want to delete this translation?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('cms_translations')
        .delete()
        .eq('key', key);

      if (error) throw error;
      await loadTranslations();
    } catch (error) {
      console.error('Error deleting translation:', error);
      alert('Failed to delete translation: ' + error.message);
    }
  };

  // Filter translations
  const filteredTranslations = translations.filter(translation => {
    const matchesSearch = translation.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      Object.values(translation.translations).some(text => 
        typeof text === 'string' && text.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesCategory = categoryFilter === 'all' || translation.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Translation Manager</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage translations for all content and UI elements
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-4">
          <button
            onClick={() => setIsAddingNew(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#690d89] hover:bg-[#8B5CF6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#690d89]"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Translation
          </button>
        </div>
      </div>

      {/* Add New Translation Form */}
      <AnimatePresence>
        {isAddingNew && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 bg-white rounded-lg shadow-lg p-6 overflow-hidden"
          >
            <h2 className="text-lg font-medium text-gray-900 mb-4">Add New Translation</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Key
                </label>
                <input
                  type="text"
                  value={newTranslation.key}
                  onChange={(e) => setNewTranslation({...newTranslation, key: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#690d89] focus:ring-[#690d89] sm:text-sm"
                  placeholder="e.g. common.welcome"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="text"
                    value={newTranslation.category}
                    onChange={(e) => setNewTranslation({...newTranslation, category: e.target.value})}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#690d89] focus:ring-[#690d89] sm:text-sm"
                    placeholder="e.g. common, navigation, features"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Translations</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {languages.map(lang => (
                  <div key={lang.code}>
                    <label className="block text-sm font-medium text-gray-700">
                      {lang.name}
                    </label>
                    <textarea
                      value={newTranslation.translations[lang.code] || ''}
                      onChange={(e) => setNewTranslation({
                        ...newTranslation, 
                        translations: {
                          ...newTranslation.translations,
                          [lang.code]: e.target.value
                        }
                      })}
                      rows={2}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#690d89] focus:ring-[#690d89] sm:text-sm"
                      placeholder={`Translation in ${lang.name}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddTranslation}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#690d89] hover:bg-[#8B5CF6]"
              >
                Add Translation
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700">
            Search
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="text"
              name="search"
              id="search"
              className="focus:ring-[#690d89] focus:border-[#690d89] block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="Search translations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category"
            name="category"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#690d89] focus:border-[#690d89] sm:text-sm rounded-md"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            name="status"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#690d89] focus:border-[#690d89] sm:text-sm rounded-md"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="complete">Complete</option>
            <option value="incomplete">Incomplete</option>
            <option value="review">Needs Review</option>
          </select>
        </div>
      </div>

      {/* Translations List */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#690d89]"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTranslations.map((translation) => (
            <div key={translation.id} className="relative group">
              <TranslationKey
                translationKey={translation.key}
                translations={translation.translations}
                onUpdate={handleUpdateTranslation}
                languages={languages}
              />
              <button
                onClick={() => handleDeleteTranslation(translation.key)}
                className="absolute top-4 right-16 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 text-red-600 hover:text-red-800 rounded-full hover:bg-red-50"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
          {filteredTranslations.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No translations found</p>
            </div>
          )}
        </div>
      )}

      {/* Translation History Modal */}
      <AnimatePresence>
        {selectedTranslation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Translation History</h3>
                  <button
                    onClick={() => setSelectedTranslation(null)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <TranslationHistory translationId={selectedTranslation} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}