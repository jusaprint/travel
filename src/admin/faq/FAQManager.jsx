import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { supabase } from '../services/supabaseService';

export default function FAQManager() {
  const { t, i18n } = useTranslation();
  const [faqs, setFaqs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [currentLang, setCurrentLang] = useState(i18n.language);

  const [formData, setFormData] = useState({
    category: '',
    order: 0,
    translations: {
      en: { question: '', answer: '' },
      sq: { question: '', answer: '' },
      fr: { question: '', answer: '' },
      de: { question: '', answer: '' }
    }
  });

  useEffect(() => {
    loadFAQs();
  }, []);

  const loadFAQs = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('cms_faqs')
        .select('*')
        .order('category', { ascending: true })
        .order('order', { ascending: true });

      if (error) throw error;
      setFaqs(data || []);
    } catch (error) {
      console.error('Error loading FAQs:', error);
      setMessage({
        type: 'error',
        text: 'Failed to load FAQs'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (item) => {
    setCurrentItem(item);
    setFormData({
      category: item.category,
      order: item.order,
      translations: item.translations || {
        en: { question: item.question, answer: item.answer },
        sq: { question: '', answer: '' },
        fr: { question: '', answer: '' },
        de: { question: '', answer: '' }
      }
    });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this FAQ?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('cms_faqs')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setFaqs(faqs.filter(item => item.id !== id));
      setMessage({
        type: 'success',
        text: 'FAQ deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      setMessage({
        type: 'error',
        text: 'Failed to delete FAQ'
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const faqData = {
        ...formData,
        question: formData.translations.en.question, // Keep original columns for backwards compatibility
        answer: formData.translations.en.answer
      };

      if (currentItem) {
        // Update existing FAQ
        const { error } = await supabase
          .from('cms_faqs')
          .update(faqData)
          .eq('id', currentItem.id);

        if (error) throw error;

        setFaqs(faqs.map(item => 
          item.id === currentItem.id ? { ...item, ...faqData } : item
        ));
        setMessage({
          type: 'success',
          text: 'FAQ updated successfully'
        });
      } else {
        // Create new FAQ
        const { data, error } = await supabase
          .from('cms_faqs')
          .insert([faqData])
          .select();

        if (error) throw error;

        setFaqs([...faqs, data[0]]);
        setMessage({
          type: 'success',
          text: 'FAQ created successfully'
        });
      }

      setIsEditing(false);
      setCurrentItem(null);
      setFormData({
        category: '',
        order: 0,
        translations: {
          en: { question: '', answer: '' },
          sq: { question: '', answer: '' },
          fr: { question: '', answer: '' },
          de: { question: '', answer: '' }
        }
      });
    } catch (error) {
      console.error('Error saving FAQ:', error);
      setMessage({
        type: 'error',
        text: 'Failed to save FAQ'
      });
    }
  };

  const handleTranslationChange = (lang, field, value) => {
    setFormData(prev => ({
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

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">FAQ Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage frequently asked questions and their translations
          </p>
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#690d89] hover:bg-[#8B5CF6]"
        >
          Add FAQ
        </button>
      </div>

      {/* Message display */}
      {message.text && (
        <div className={`mt-4 p-4 rounded-md ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {/* Edit Form */}
      {isEditing && (
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#690d89] focus:ring-[#690d89] sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Order</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#690d89] focus:ring-[#690d89] sm:text-sm"
                required
              />
            </div>

            {/* Translations */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Translations</h3>
              
              {Object.entries(formData.translations).map(([lang, content]) => (
                <div key={lang} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-md font-medium text-gray-900 mb-4">
                    {lang === 'en' ? 'English' : 
                     lang === 'sq' ? 'Albanian' : 
                     lang === 'fr' ? 'French' : 
                     'German'}
                  </h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Question
                      </label>
                      <input
                        type="text"
                        value={content.question}
                        onChange={(e) => handleTranslationChange(lang, 'question', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#690d89] focus:ring-[#690d89] sm:text-sm"
                        required={lang === 'en'} // Only English is required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Answer
                      </label>
                      <textarea
                        value={content.answer}
                        onChange={(e) => handleTranslationChange(lang, 'answer', e.target.value)}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#690d89] focus:ring-[#690d89] sm:text-sm"
                        required={lang === 'en'} // Only English is required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setCurrentItem(null);
                  setFormData({
                    category: '',
                    order: 0,
                    translations: {
                      en: { question: '', answer: '' },
                      sq: { question: '', answer: '' },
                      fr: { question: '', answer: '' },
                      de: { question: '', answer: '' }
                    }
                  });
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#690d89] hover:bg-[#8B5CF6]"
              >
                {currentItem ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* FAQ List */}
      <div className="mt-8">
        {/* Group FAQs by category */}
        {Object.entries(
          faqs.reduce((acc, faq) => {
            if (!acc[faq.category]) {
              acc[faq.category] = [];
            }
            acc[faq.category].push(faq);
            return acc;
          }, {})
        ).map(([category, categoryFaqs]) => (
          <div key={category} className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{category}</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="divide-y divide-gray-200">
                {categoryFaqs.map((faq) => (
                  <div key={faq.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {/* Show translations for the current language */}
                        <h3 className="text-lg font-medium text-gray-900">
                          {faq.translations?.[currentLang]?.question || faq.question}
                        </h3>
                        <p className="mt-2 text-gray-600">
                          {faq.translations?.[currentLang]?.answer || faq.answer}
                        </p>
                        
                        {/* Translation status indicators */}
                        <div className="mt-4 flex gap-2">
                          {Object.entries(faq.translations || {}).map(([lang, content]) => (
                            <div
                              key={lang}
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                content?.question && content?.answer
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {lang.toUpperCase()}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <button
                          onClick={() => handleEdit(faq)}
                          className="text-[#690d89] hover:text-[#8B5CF6] mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(faq.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {!isLoading && faqs.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No FAQs yet</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding a new FAQ.</p>
            <div className="mt-6">
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#690d89] hover:bg-[#8B5CF6]"
              >
                <svg
                  className="-ml-1 mr-2 h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add FAQ
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}