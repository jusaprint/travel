import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPackages, deletePackage, createPackage } from '../services/dataService';

// Status badge component
const StatusBadge = ({ status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyles()}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default function PackageList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');
  const [countryFilter, setCountryFilter] = useState('all');
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [countries, setCountries] = useState([]);
  
  // Load packages
  useEffect(() => {
    const loadPackages = async () => {
      try {
        const data = await getPackages();
        setPackages(data);
        
        // Extract unique countries from packages
        const uniqueCountries = new Set();
        data.forEach(pkg => {
          if (pkg.countries && Array.isArray(pkg.countries)) {
            pkg.countries.forEach(country => {
              if (country && country.code) {
                uniqueCountries.add(country.code);
              }
            });
          }
        });
        
        // Convert to array and sort
        const countriesArray = Array.from(uniqueCountries).map(code => ({
          code,
          name: getCountryName(code)
        })).sort((a, b) => a.name.localeCompare(b.name));
        
        setCountries(countriesArray);
      } catch (error) {
        console.error('Error loading packages:', error);
        setMessage({ type: 'error', text: 'Failed to load packages. Please try again.' });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPackages();
  }, []);

  // Get country name from code
  const getCountryName = (code) => {
    const countryNames = {
      'US': 'United States',
      'GB': 'United Kingdom',
      'DE': 'Germany',
      'FR': 'France',
      'IT': 'Italy',
      'ES': 'Spain',
      'CA': 'Canada',
      'AU': 'Australia',
      'JP': 'Japan',
      'CN': 'China',
      'IN': 'India',
      'BR': 'Brazil',
      'RU': 'Russia',
      'ZA': 'South Africa',
      'MX': 'Mexico',
      'AR': 'Argentina',
      'TR': 'Turkey',
      'EG': 'Egypt',
      'AE': 'United Arab Emirates',
      'SG': 'Singapore',
      'MY': 'Malaysia',
      'TH': 'Thailand',
      'ID': 'Indonesia',
      'PH': 'Philippines',
      'VN': 'Vietnam',
      'KR': 'South Korea',
      'NZ': 'New Zealand',
      'CH': 'Switzerland',
      'SE': 'Sweden',
      'NO': 'Norway',
      'DK': 'Denmark',
      'FI': 'Finland',
      'NL': 'Netherlands',
      'BE': 'Belgium',
      'AT': 'Austria',
      'PT': 'Portugal',
      'GR': 'Greece',
      'PL': 'Poland',
      'CZ': 'Czech Republic',
      'HU': 'Hungary',
      'RO': 'Romania',
      'BG': 'Bulgaria',
      'HR': 'Croatia',
      'RS': 'Serbia',
      'SI': 'Slovenia',
      'SK': 'Slovakia',
      'UA': 'Ukraine',
      'IL': 'Israel',
      'QA': 'Qatar',
      'KW': 'Kuwait',
      'OM': 'Oman',
      'BH': 'Bahrain',
      'JO': 'Jordan',
      'LB': 'Lebanon',
      'IQ': 'Iraq',
      'IR': 'Iran',
      'SY': 'Syria',
      'SA': 'Saudi Arabia',
      'YE': 'Yemen',
      'LY': 'Libya',
      'TN': 'Tunisia',
      'DZ': 'Algeria',
      'MA': 'Morocco',
      'MR': 'Mauritania',
      'ML': 'Mali',
      'NE': 'Niger',
      'TD': 'Chad',
      'SD': 'Sudan',
      'ER': 'Eritrea',
      'DJ': 'Djibouti',
      'SO': 'Somalia',
      'ET': 'Ethiopia',
      'KE': 'Kenya',
      'UG': 'Uganda',
      'TZ': 'Tanzania',
      'RW': 'Rwanda',
      'BI': 'Burundi',
      'CD': 'Democratic Republic of the Congo',
      'CG': 'Republic of the Congo',
      'CF': 'Central African Republic',
      'GA': 'Gabon',
      'GQ': 'Equatorial Guinea',
      'CM': 'Cameroon',
      'NG': 'Nigeria',
      'BJ': 'Benin',
      'TG': 'Togo',
      'GH': 'Ghana',
      'CI': 'Ivory Coast',
      'LR': 'Liberia',
      'SL': 'Sierra Leone',
      'GN': 'Guinea',
      'GW': 'Guinea-Bissau',
      'SN': 'Senegal',
      'GM': 'Gambia',
      'CV': 'Cape Verde',
      'ST': 'Sao Tome and Principe',
      'AO': 'Angola',
      'NA': 'Namibia',
      'BW': 'Botswana',
      'LS': 'Lesotho',
      'SZ': 'Eswatini',
      'MZ': 'Mozambique',
      'ZW': 'Zimbabwe',
      'ZM': 'Zambia',
      'MW': 'Malawi',
      'MG': 'Madagascar',
      'KM': 'Comoros',
      'SC': 'Seychelles',
      'MU': 'Mauritius',
      'RE': 'Réunion',
      'YT': 'Mayotte',
      'EU': 'Europe'
    };
    
    return countryNames[code] || code;
  };

  // Handle package deletion
  const handleDeletePackage = async (id) => {
    if (window.confirm('Are you sure you want to delete this package? This action cannot be undone.')) {
      try {
        await deletePackage(id);
        setPackages(packages.filter(pkg => pkg.id !== id));
        setMessage({ type: 'success', text: 'Package deleted successfully!' });
      } catch (error) {
        console.error('Error deleting package:', error);
        setMessage({ type: 'error', text: 'Failed to delete package. Please try again.' });
      }
    }
  };

  // Handle package duplication
  const handleDuplicatePackage = async (pkg) => {
    try {
      // Create a copy of the package without the id and timestamps
      const { id, created_at, updated_at, ...packageData } = pkg;
      
      // Add "(Copy)" to the name
      packageData.name = `${packageData.name} (Copy)`;
      
      // Create new package
      const newPackage = await createPackage(packageData);
      
      // Add the new package to the list
      setPackages([...packages, newPackage]);
      
      setMessage({ type: 'success', text: 'Package duplicated successfully!' });
    } catch (error) {
      console.error('Error duplicating package:', error);
      setMessage({ type: 'error', text: 'Failed to duplicate package. Please try again.' });
    }
  };

  // Filter packages based on search term and filters
  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = pkg.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || pkg.status === statusFilter;
    const matchesRegion = regionFilter === 'all' || pkg.region === regionFilter;
    
    // Filter by country if selected
    const matchesCountry = countryFilter === 'all' || 
      (pkg.countries && Array.isArray(pkg.countries) && 
       pkg.countries.some(country => country.code === countryFilter));
    
    return matchesSearch && matchesStatus && matchesRegion && matchesCountry;
  });

  // Get unique regions for filter
  const regions = ['all', ...new Set(packages.map(pkg => pkg.region))];

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Packages</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your data packages and pricing
          </p>
        </div>
        <Link
          to="/admin/packages/new"
          className="inline-flex items-center px-4 py-2 mt-4 text-sm font-medium text-white bg-[#690d89] border border-transparent rounded-md shadow-sm hover:bg-[#8B5CF6] sm:mt-0"
        >
          <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Package
        </Link>
      </div>

      {/* Message display */}
      {message.text && (
        <div className={`mt-4 p-4 rounded-md ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          <div className="flex">
            <div className="flex-shrink-0">
              {message.type === 'success' ? (
                <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm">{message.text}</p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700">
            Search
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              name="search"
              id="search"
              className="focus:ring-[#690d89] focus:border-[#690d89] block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              placeholder="Search packages"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
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
            <option value="all">All</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div>
          <label htmlFor="region" className="block text-sm font-medium text-gray-700">
            Region
          </label>
          <select
            id="region"
            name="region"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#690d89] focus:border-[#690d89] sm:text-sm rounded-md"
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
          >
            {regions.map((region) => (
              <option key={region} value={region}>
                {region === 'all' ? 'All Regions' : region}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700">
            Country
          </label>
          <select
            id="country"
            name="country"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#690d89] focus:border-[#690d89] sm:text-sm rounded-md"
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
          >
            <option value="all">All Countries</option>
            {countries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="mt-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#690d89]"></div>
        </div>
      ) : (
        <>
          {/* Packages Table */}
          <div className="mt-8 flex flex-col">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                          Name
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Region
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Price
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Validity
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Status
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Last Updated
                        </th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {filteredPackages.map((pkg) => (
                        <tr key={pkg.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {pkg.name}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {pkg.region}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            €{pkg.price}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {pkg.validity_days} days
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <StatusBadge status={pkg.status} />
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {pkg.lastUpdated}
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <Link to={`/admin/packages/${pkg.id}`} className="text-[#690d89] hover:text-[#8B5CF6] mr-4">
                              Edit
                            </Link>
                            <button 
                              onClick={() => handleDuplicatePackage(pkg)}
                              className="text-[#690d89] hover:text-[#8B5CF6] mr-4"
                            >
                              Duplicate
                            </button>
                            <button 
                              onClick={() => handleDeletePackage(pkg.id)}
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
          </div>

          {/* Empty State */}
          {filteredPackages.length === 0 && (
            <div className="mt-8 text-center py-12 bg-gray-50 rounded-lg">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No packages found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter !== 'all' || regionFilter !== 'all' || countryFilter !== 'all' ? 'Try adjusting your search or filters.' : 'Get started by adding a package.'}
              </p>
              {!searchTerm && statusFilter === 'all' && regionFilter === 'all' && countryFilter === 'all' && (
                <div className="mt-6">
                  <Link
                    to="/admin/packages/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#690d89] hover:bg-[#8B5CF6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#690d89]"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Package
                  </Link>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}