import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../services/supabaseService';

export default function PressManager() {
  const [pressReleases, setPressReleases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    source_url: '',
    publication_date: '',
    source_name: '',
    featured: false
  });

  useEffect(() => {
    loadPressReleases();
  }, []);

  const loadPressReleases = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('cms_press')
        .select('*')
        .order('publication_date', { ascending: false });

      if (error) throw error;
      setPressReleases(data || []);
    } catch (error) {
      console.error('Error loading press releases:', error);
      setMessage({
        type: 'error',
        text: 'Failed to load press releases'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (item) => {
    setCurrentItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      image_url: item.image_url,
      source_url: item.source_url,
      publication_date: item.publication_date,
      source_name: item.source_name,
      featured: item.featured
    });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this press release?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('cms_press')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPressReleases(pressReleases.filter(item => item.id !== id));
      setMessage({
        type: 'success',
        text: 'Press release deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting press release:', error);
      setMessage({
        type: 'error',
        text: 'Failed to delete press release'
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (currentItem) {
        // Update existing press release
        const { error } = await supabase
          .from('cms_press')
          .update(formData)
          .eq('id', currentItem.id);

        if (error) throw error;

        setPressReleases(pressReleases.map(item => 
          item.id === currentItem.id ? { ...item, ...formData } : item
        ));
        setMessage({
          type: 'success',
          text: 'Press release updated successfully'
        });
      } else {
        // Create new press release
        const { data, error } = await supabase
          .from('cms_press')
          .insert([formData])
          .select();

        if (error) throw error;

        setPressReleases([...pressReleases, data[0]]);
        setMessage({
          type: 'success',
          text: 'Press release created successfully'
        });
      }

      setIsEditing(false);
      setCurrentItem(null);
      setFormData({
        title: '',
        description: '',
        image_url: '',
        source_url: '',
        publication_date: '',
        source_name: '',
        featured: false
      });
    } catch (error) {
      console.error('Error saving press release:', error);
      setMessage({
        type: 'error',
        text: 'Failed to save press release'
      });
    }
  };

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Press Coverage</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage press coverage and media releases
          </p>
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#690d89] hover:bg-[#8B5CF6]"
        >
          Add Press Release
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
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#690d89] focus:ring-[#690d89] sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#690d89] focus:ring-[#690d89] sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Image URL</label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#690d89] focus:ring-[#690d89] sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Source URL</label>
              <input
                type="url"
                value={formData.source_url}
                onChange={(e) => setFormData({ ...formData, source_url: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#690d89] focus:ring-[#690d89] sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Source Name</label>
              <input
                type="text"
                value={formData.source_name}
                onChange={(e) => setFormData({ ...formData, source_name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#690d89] focus:ring-[#690d89] sm:text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Publication Date</label>
              <input
                type="date"
                value={formData.publication_date}
                onChange={(e) => setFormData({ ...formData, publication_date: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#690d89] focus:ring-[#690d89] sm:text-sm"
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="h-4 w-4 text-[#690d89] focus:ring-[#690d89] border-gray-300 rounded"
              />
              <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                Featured Article
              </label>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setCurrentItem(null);
                  setFormData({
                    title: '',
                    description: '',
                    image_url: '',
                    source_url: '',
                    publication_date: '',
                    source_name: '',
                    featured: false
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

      {/* Press Releases List */}
      <div className="mt-8">
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Title</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Source</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Featured</th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {pressReleases.map((item) => (
                <tr key={item.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                    {item.title}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {item.source_name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {new Date(item.publication_date).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {item.featured ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Featured
                      </span>
                    ) : null}
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-[#690d89] hover:text-[#8B5CF6] mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}