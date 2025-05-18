import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Flag from 'react-world-flags';
import { supabase } from '../services/supabaseService';

const FlagGroup = ({ countries, maxVisible = 10, onRemoveCountry }) => {
  const [showAll, setShowAll] = useState(false);
  const visibleCountries = showAll ? countries : countries.slice(0, maxVisible);
  const remainingCount = countries.length - maxVisible;

  return (
    <div className="flex flex-wrap gap-2">
      {visibleCountries.map((country) => (
        <motion.div
          key={country.code}
          whileHover={{ scale: 1.1 }}
          className="relative group"
        >
          <div className="w-8 h-6 overflow-hidden rounded-lg shadow-sm">
            <Flag code={country.code} className="w-full h-full object-cover" />
            {onRemoveCountry && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveCountry(country);
                }}
                className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center"
              >
                ×
              </button>
            )}
          </div>
        </motion.div>
      ))}
      {!showAll && remainingCount > 0 && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={() => setShowAll(true)}
          className="w-8 h-6 bg-gray-100 rounded-lg flex items-center justify-center text-xs font-medium text-gray-600"
        >
          +{remainingCount}
        </motion.button>
      )}
    </div>
  );
};

const CountrySelector = ({ onAdd, selectedCountries }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const { data, error } = await supabase
          .from('cms_countries')
          .select('code, name')
          .order('name');

        if (error) throw error;
        setCountries(data || []);
      } catch (error) {
        console.error('Error loading countries:', error);
      }
    };

    loadCountries();
  }, []);

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedCountries.some(c => c.code === country.code)
  );

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white text-gray-700 rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-between border border-gray-300"
      >
        <span>Add Country</span>
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-white rounded-lg shadow-xl">
          <div className="p-2">
            <input
              type="text"
              placeholder="Search countries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 text-sm focus:ring-[#690d89] focus:border-[#690d89]"
            />
          </div>
          <div className="max-h-60 overflow-auto">
            {filteredCountries.map((country) => (
              <button
                key={country.code}
                onClick={() => {
                  onAdd(country);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
              >
                <div className="w-6 h-4 overflow-hidden rounded">
                  <Flag code={country.code} className="w-full h-full object-cover" />
                </div>
                <span className="text-gray-900 text-sm">{country.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function RegionsManager() {
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [editingRegion, setEditingRegion] = useState(null);
  const [newRegion, setNewRegion] = useState({ 
    name: '', 
    description: '', 
    explore_packages_url: '',
    starting_price: ''
  });

  useEffect(() => {
    loadRegions();
  }, []);

  const loadRegions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cms_regions')
        .select('*')
        .order('name');

      if (error) throw error;
      setRegions(data || []);
    } catch (err) {
      console.error('Error loading regions:', err);
      setError('Failed to load regions');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRegion = async () => {
    try {
      if (!newRegion.name.trim()) {
        setMessage({ type: 'error', text: 'Region name is required' });
        return;
      }

      const { data, error } = await supabase
        .from('cms_regions')
        .insert([{
          name: newRegion.name,
          description: newRegion.description,
          explore_packages_url: newRegion.explore_packages_url,
          starting_price: newRegion.starting_price,
          countries: []
        }])
        .select();

      if (error) throw error;

      setRegions([...regions, data[0]]);
      setNewRegion({ 
        name: '', 
        description: '', 
        explore_packages_url: '',
        starting_price: ''
      });
      setMessage({ type: 'success', text: 'Region created successfully' });
    } catch (err) {
      console.error('Error creating region:', err);
      setMessage({ type: 'error', text: 'Failed to create region' });
    }
  };

  const handleUpdateRegion = async (regionId, updates) => {
    try {
      const { error } = await supabase
        .from('cms_regions')
        .update(updates)
        .eq('id', regionId);

      if (error) throw error;

      setRegions(regions.map(r => 
        r.id === regionId ? { ...r, ...updates } : r
      ));

      setMessage({ type: 'success', text: 'Region updated successfully' });
    } catch (err) {
      console.error('Error updating region:', err);
      setMessage({ type: 'error', text: 'Failed to update region' });
    }
  };

  const handleDeleteRegion = async (regionId) => {
    if (!window.confirm('Are you sure you want to delete this region?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('cms_regions')
        .delete()
        .eq('id', regionId);

      if (error) throw error;

      setRegions(regions.filter(r => r.id !== regionId));
      setMessage({ type: 'success', text: 'Region deleted successfully' });
    } catch (err) {
      console.error('Error deleting region:', err);
      setMessage({ type: 'error', text: 'Failed to delete region' });
    }
  };

  const handleAddCountry = async (region, country) => {
    try {
      const updatedCountries = [...(region.countries || []), country];
      const { error } = await supabase
        .from('cms_regions')
        .update({ countries: updatedCountries })
        .eq('id', region.id);

      if (error) throw error;

      setRegions(regions.map(r => 
        r.id === region.id ? { ...r, countries: updatedCountries } : r
      ));

      setMessage({ type: 'success', text: `Added ${country.name} to ${region.name}` });
    } catch (err) {
      console.error('Error adding country to region:', err);
      setMessage({ type: 'error', text: 'Failed to add country to region' });
    }
  };

  const handleRemoveCountry = async (region, country) => {
    try {
      const updatedCountries = region.countries.filter(c => c.code !== country.code);
      const { error } = await supabase
        .from('cms_regions')
        .update({ countries: updatedCountries })
        .eq('id', region.id);

      if (error) throw error;

      setRegions(regions.map(r => 
        r.id === region.id ? { ...r, countries: updatedCountries } : r
      ));

      setMessage({ type: 'success', text: `Removed ${country.name} from ${region.name}` });
    } catch (err) {
      console.error('Error removing country from region:', err);
      setMessage({ type: 'error', text: 'Failed to remove country from region' });
    }
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Regions</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage region groupings and their countries
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

      {/* Add New Region Form */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Region</h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <input
              type="text"
              placeholder="Region Name"
              value={newRegion.name}
              onChange={(e) => setNewRegion({ ...newRegion, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#690d89] focus:border-[#690d89]"
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Description (optional)"
              value={newRegion.description}
              onChange={(e) => setNewRegion({ ...newRegion, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#690d89] focus:border-[#690d89]"
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Starting Price (optional)"
              value={newRegion.starting_price}
              onChange={(e) => setNewRegion({ ...newRegion, starting_price: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#690d89] focus:border-[#690d89]"
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Explore Packages URL (optional)"
              value={newRegion.explore_packages_url}
              onChange={(e) => setNewRegion({ ...newRegion, explore_packages_url: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#690d89] focus:border-[#690d89]"
            />
          </div>
        </div>
        <button
          onClick={handleAddRegion}
          className="mt-4 px-4 py-2 bg-[#690d89] text-white rounded-md hover:bg-[#8B5CF6]"
        >
          Add Region
        </button>
      </div>

      {/* Regions List */}
      <div className="space-y-6">
        {regions.map((region) => (
          <div 
            key={region.id}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{region.name}</h2>
                {region.description && (
                  <p className="text-sm text-gray-500 mt-1">{region.description}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <CountrySelector 
                  onAdd={(country) => handleAddCountry(region, country)}
                  selectedCountries={region.countries || []}
                />
                <button
                  onClick={() => handleDeleteRegion(region.id)}
                  className="p-2 text-red-600 hover:text-red-800 rounded-lg hover:bg-red-50"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Starting Price"
                  value={region.starting_price || ''}
                  onChange={(e) => handleUpdateRegion(region.id, { starting_price: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#690d89] focus:border-[#690d89]"
                />
                <input
                  type="text"
                  placeholder="Explore Packages URL"
                  value={region.explore_packages_url || ''}
                  onChange={(e) => handleUpdateRegion(region.id, { explore_packages_url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#690d89] focus:border-[#690d89]"
                />
              </div>
              
              <FlagGroup 
                countries={region.countries || []} 
                maxVisible={10}
                onRemoveCountry={(country) => handleRemoveCountry(region, country)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}