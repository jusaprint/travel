import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Flag from 'react-world-flags';
import { supabase } from '../services/supabaseService';

export default function LocalCountries() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  // Load countries
  const loadCountries = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cms_countries')
        .select('*')
        .order('name');

      if (error) throw error;
      setCountries(data || []);
    } catch (err) {
      console.error('Error loading countries:', err);
      setError('Failed to load countries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCountries();
  }, []);

  const handleToggleLocal = async (country) => {
    try {
      setMessage({ type: '', text: '' });
      const { error } = await supabase
        .from('cms_countries')
        .update({ show_in_local: !country.show_in_local })
        .eq('id', country.id);

      if (error) throw error;

      // Update local state
      setCountries(countries.map(c => 
        c.id === country.id ? { ...c, show_in_local: !c.show_in_local } : c
      ));

      setMessage({ 
        type: 'success', 
        text: `${country.name} ${!country.show_in_local ? 'added to' : 'removed from'} local tab` 
      });
    } catch (err) {
      console.error('Error updating country:', err);
      setMessage({ type: 'error', text: 'Failed to update country' });
    }
  };

  const handleStartingPriceChange = async (country, value) => {
    try {
      setMessage({ type: '', text: '' });
      const { error } = await supabase
        .from('cms_countries')
        .update({ starting_price: value })
        .eq('id', country.id);

      if (error) throw error;

      // Update local state
      setCountries(countries.map(c => 
        c.id === country.id ? { ...c, starting_price: value } : c
      ));

      setMessage({ type: 'success', text: `Starting price updated for ${country.name}` });
    } catch (err) {
      console.error('Error updating starting price:', err);
      setMessage({ type: 'error', text: 'Failed to update starting price' });
    }
  };

  const filteredCountries = countries.filter(country => 
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#690d89]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Local Countries</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage which countries appear in the Local tab
          </p>
        </div>
      </div>

      {/* Message display */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-md ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search countries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-[#690d89] focus:border-[#690d89]"
        />
      </div>

      {/* Countries List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Country
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Starting Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Show in Local
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCountries.map((country) => (
              <tr key={country.code}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <Flag code={country.code} className="h-10 w-10 rounded-full" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{country.name}</div>
                      <div className="text-sm text-gray-500">{country.code}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="text"
                    value={country.starting_price || ''}
                    onChange={(e) => handleStartingPriceChange(country, e.target.value)}
                    className="w-32 px-2 py-1 rounded border border-gray-300 focus:ring-[#690d89] focus:border-[#690d89]"
                    placeholder="e.g. €9.99"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleToggleLocal(country)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      country.show_in_local ? 'bg-[#690d89]' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        country.show_in_local ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}