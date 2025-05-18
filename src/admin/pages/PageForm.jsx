import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { getPageById, createPage, updatePage } from '../services/dataService';

export default function PageForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentLang } = useOutletContext();
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    metaTitle: '',
    metaDescription: '',
    status: 'draft',
    featured: false,
    featuredImage: ''
  });
  
  const [translations, setTranslations] = useState({
    en: { title: '', content: '', metaTitle: '', metaDescription: '' },
    de: { title: '', content: '', metaTitle: '', metaDescription: '' },
    fr: { title: '', content: '', metaTitle: '', metaDescription: '' },
    es: { title: '', content: '', metaTitle: '', metaDescription: '' }
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  
  // Fetch page data if editing
  useEffect(() => {
    if (id && id !== 'new') {
      setIsLoading(true);
      getPageById(id)
        .then(pageData => {
          setFormData({
            title: pageData.title,
            slug: pageData.slug,
            content: pageData.content,
            metaTitle: pageData.metaTitle,
            metaDescription: pageData.metaDescription,
            status: pageData.status,
            featured: pageData.featured,
            featuredImage: pageData.featuredImage
          });
          
          setTranslations(pageData.translations || {
            en: { 
              title: pageData.title, 
              content: pageData.content,
              metaTitle: pageData.metaTitle,
              metaDescription: pageData.metaDescription
            },
            de: { title: '', content: '', metaTitle: '', metaDescription: '' },
            fr: { title: '', content: '', metaTitle: '', metaDescription: '' },
            es: { title: '', content: '', metaTitle: '', metaDescription: '' }
          });
          
          setIsLoading(false);
        })
        .catch(err => {
          console.error('Error fetching page:', err);
          setError('Failed to load page data. Please try again.');
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
    
    // Update current language translation if title, content, metaTitle, or metaDescription
    if (['title', 'content', 'metaTitle', 'metaDescription'].includes(name)) {
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
    
    // Update main form data if current language
    if (lang === currentLang && ['title', 'content', 'metaTitle', 'metaDescription'].includes(name)) {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const generateSlug = () => {
    if (formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      
      setFormData({
        ...formData,
        slug: `/${slug}`
      });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage('');
    
    // Prepare data for submission
    const pageData = {
      ...formData,
      translations
    };
    
    try {
      if (id === 'new') {
        await createPage(pageData);
        setMessage('Page created successfully!');
      } else {
        await updatePage(id, pageData);
        setMessage('Page updated successfully!');
      }
      
      setTimeout(() => {
        navigate('/admin/pages');
      }, 1500);
    } catch (err) {
      console.error('Error saving page:', err);
      setError('Failed to save page. Please try again.');
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
            {id === 'new' ? 'Create New Page' : 'Edit Page'}
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            type="button"
            onClick={() => navigate('/admin/pages')}
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
              <div className="sm:col-span-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Page Title
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={translations[currentLang].title || formData.title}
                    onChange={(e) => handleTranslationChange(e, currentLang)}
                    className="shadow-sm focus:ring-[#690d89] focus:border-[#690d89] block w-full sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>
              
              <div className="sm:col-span-4">
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                  URL Slug
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                    https://kudosim.com
                  </span>
                  <input
                    type="text"
                    name="slug"
                    id="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-[#690d89] focus:border-[#690d89] sm:text-sm border-gray-300"
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={generateSlug}
                  className="mt-2 inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#690d89]"
                >
                  Generate from title
                </button>
              </div>
              
              <div className="sm:col-span-6">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                  Content
                </label>
                <div className="mt-1">
                  <textarea
                    id="content"
                    name="content"
                    rows={10}
                    value={translations[currentLang].content || formData.content}
                    onChange={(e) => handleTranslationChange(e, currentLang)}
                    className="shadow-sm focus:ring-[#690d89] focus:border-[#690d89] block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  HTML is supported. Use &lt;p&gt; tags for paragraphs.
                </p>
              </div>
              
              <div className="sm:col-span-6">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="featured"
                      name="featured"
                      type="checkbox"
                      checked={formData.featured}
                      onChange={handleInputChange}
                      className="focus:ring-[#690d89] h-4 w-4 text-[#690d89] border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="featured" className="font-medium text-gray-700">Featured Page</label>
                    <p className="text-gray-500">Featured pages may be highlighted on the homepage or in navigation.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* SEO Information */}
          <div className="pt-8">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">SEO Information</h3>
              <p className="mt-1 text-sm text-gray-500">
                Optimize your page for search engines.
              </p>
            </div>
            
            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700">
                  Meta Title
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="metaTitle"
                    id="metaTitle"
                    value={translations[currentLang].metaTitle || formData.metaTitle}
                    onChange={(e) => handleTranslationChange(e, currentLang)}
                    className="shadow-sm focus:ring-[#690d89] focus:border-[#690d89] block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Recommended length: 50-60 characters
                </p>
              </div>
              
              <div className="sm:col-span-6">
                <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700">
                  Meta Description
                </label>
                <div className="mt-1">
                  <textarea
                    id="metaDescription"
                    name="metaDescription"
                    rows={3}
                    value={translations[currentLang].metaDescription || formData.metaDescription}
                    onChange={(e) => handleTranslationChange(e, currentLang)}
                    className="shadow-sm focus:ring-[#690d89] focus:border-[#690d89] block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Recommended length: 150-160 characters
                </p>
              </div>
              
              <div className="sm:col-span-6">
                <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-700">
                  Featured Image URL
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="featuredImage"
                    id="featuredImage"
                    value={formData.featuredImage}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-[#690d89] focus:border-[#690d89] block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Enter the URL of the image to be used as the featured image.
                </p>
              </div>
            </div>
          </div>
          
          {/* Publishing Options */}
          <div className="pt-8">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Publishing Options</h3>
              <p className="mt-1 text-sm text-gray-500">
                Control the visibility of your page.
              </p>
            </div>
            
            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
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
                    <div className="sm:col-span-6">
                      <label htmlFor={`title-${lang}`} className="block text-sm font-medium text-gray-700">
                        Page Title
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="title"
                          id={`title-${lang}`}
                          value={translations[lang].title || ''}
                          onChange={(e) => handleTranslationChange(e, lang)}
                          className="shadow-sm focus:ring-[#690d89] focus:border-[#690d89] block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    
                    <div className="sm:col-span-6">
                      <label htmlFor={`content-${lang}`} className="block text-sm font-medium text-gray-700">
                        Content
                      </label>
                      <div className="mt-1">
                        <textarea
                          id={`content-${lang}`}
                          name="content"
                          rows={5}
                          value={translations[lang].content || ''}
                          onChange={(e) => handleTranslationChange(e, lang)}
                          className="shadow-sm focus:ring-[#690d89] focus:border-[#690d89] block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    
                    <div className="sm:col-span-6">
                      <label htmlFor={`metaTitle-${lang}`} className="block text-sm font-medium text-gray-700">
                        Meta Title
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="metaTitle"
                          id={`metaTitle-${lang}`}
                          value={translations[lang].metaTitle || ''}
                          onChange={(e) => handleTranslationChange(e, lang)}
                          className="shadow-sm focus:ring-[#690d89] focus:border-[#690d89] block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    
                    <div className="sm:col-span-6">
                      <label htmlFor={`metaDescription-${lang}`} className="block text-sm font-medium text-gray-700">
                        Meta Description
                      </label>
                      <div className="mt-1">
                        <textarea
                          id={`metaDescription-${lang}`}
                          name="metaDescription"
                          rows={3}
                          value={translations[lang].metaDescription || ''}
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
              onClick={() => navigate('/admin/pages')}
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
              {id === 'new' ? 'Create Page' : 'Update Page'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}