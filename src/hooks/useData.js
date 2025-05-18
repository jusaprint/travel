import { useState, useEffect } from 'react';
import { supabase } from '../lib/cms';

// Predefined high-quality Unsplash images for popular countries
const countryImages = {
  'DE': 'https://images.unsplash.com/photo-1599946347371-68eb71b16afc?auto=format&fit=crop&w=1000&q=80', // Berlin
  'FR': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1000&q=80', // Paris
  'IT': 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?auto=format&fit=crop&w=1000&q=80', // Rome
  'ES': 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=1000&q=80', // Barcelona
  'GB': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1000&q=80', // London
  'AL': 'https://images.unsplash.com/photo-1529592767881-c6bb394eb83d?q=80&w=3540&auto=format&fit=crop', // Albania
  'AT': 'https://images.unsplash.com/photo-1609856878074-cf31e21ccb6b?auto=format&fit=crop&w=1000&q=80', // Austria
  'US': 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=1000&q=80' // United States
};

// Cache for data
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export function usePackages(options = {}) {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cacheKey = `packages-${JSON.stringify(options)}`;

  useEffect(() => {
    const loadPackages = async () => {
      try {
        // Check cache first
        const cached = cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
          setPackages(cached.data);
          setLoading(false);
          return;
        }

        setLoading(true);
        let query = supabase
          .from('cms_packages')
          .select('*')
          .eq('status', 'published');

        if (options.countryCode) {
          const countryFilter = `[{"code": "${options.countryCode.toUpperCase()}"}]`;
          query = query.contains('countries', countryFilter);
        }

        if (options.region) {
          query = query.eq('region', options.region);
        }

        const { data, error: err } = await query;
        
        if (err) throw err;
        
        const formattedData = data?.map(pkg => ({
          ...pkg,
          features: Array.isArray(pkg.features) ? pkg.features : [],
          countries: Array.isArray(pkg.countries) ? pkg.countries : []
        })) || [];
        
        // Cache the result
        cache.set(cacheKey, {
          data: formattedData,
          timestamp: Date.now()
        });
        
        setPackages(formattedData);
        setError(null);
      } catch (err) {
        console.error('Error loading packages:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadPackages();
  }, [options.region, options.countryCode, cacheKey]);

  return { packages, loading, error };
}

export function useComboPackages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cacheKey = 'combo-packages';

  useEffect(() => {
    const loadPackages = async () => {
      try {
        // Check cache first
        const cached = cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
          setPackages(cached.data);
          setLoading(false);
          return;
        }

        setLoading(true);
        setError(null);
        
        // Direct API call to fetch combo packages
        const { data, error: err } = await supabase
          .from('cms_combo_packages')
          .select('*')
          .order('order', { ascending: true });

        if (err) throw err;
        
        const formattedData = data?.map(pkg => ({
          ...pkg,
          features: Array.isArray(pkg.features) ? pkg.features : [],
          countries: Array.isArray(pkg.countries) ? pkg.countries : []
        })) || [];
        
        // Cache the result
        cache.set(cacheKey, {
          data: formattedData,
          timestamp: Date.now()
        });
        
        setPackages(formattedData);
      } catch (err) {
        console.error('Error loading combo packages:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadPackages();
  }, []);

  return { packages, loading, error };
}

export function useCountry(code) {
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cacheKey = `country-${code}`;

  useEffect(() => {
    const loadCountry = async () => {
      if (!code) {
        setLoading(false);
        return;
      }

      try {
        // Check cache first
        const cached = cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
          setCountry(cached.data);
          setLoading(false);
          return;
        }

        setLoading(true);
        setError(null);

        // Add error handling and timeout for the fetch request
        const fetchWithTimeout = async (timeout = 10000) => {
          const controller = new AbortController();
          const id = setTimeout(() => controller.abort(), timeout);
          
          try {
            const { data, error: err } = await supabase
              .from('cms_countries')
              .select('*')
              .eq('code', code.toUpperCase())
              .single();
            
            clearTimeout(id);
            return { data, error: err };
          } catch (error) {
            clearTimeout(id);
            throw error;
          }
        };

        const { data, error: err } = await fetchWithTimeout();

        if (err) {
          if (err.code === 'PGRST116') {
            // No rows returned - country not found
            setCountry(null);
            setError('Country not found');
            return;
          }
          throw err;
        }
        
        if (data) {
          const processedData = {
            ...data,
            features: Array.isArray(data.features) ? data.features : [],
            technical_details: Array.isArray(data.technical_details) ? data.technical_details : [],
            languages: Array.isArray(data.languages) ? data.languages : [],
            networks: Array.isArray(data.networks) ? data.networks : [],
            coverimage: data.coverimage || countryImages[data.code] || `https://source.unsplash.com/800x600/?${data.name},landmarks`
          };
          
          // Cache the result
          cache.set(cacheKey, {
            data: processedData,
            timestamp: Date.now()
          });
          
          setCountry(processedData);
        } else {
          setCountry(null);
          setError('Country not found');
        }
      } catch (err) {
        console.error('Error loading country:', err);
        setError(err.message);
        setCountry(null);
      } finally {
        setLoading(false);
      }
    };

    loadCountry();
  }, [code, cacheKey]);

  return { country, loading, error };
}

export function useCountries(options = {}) {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cacheKey = `countries-${JSON.stringify(options)}`;

  useEffect(() => {
    const loadCountries = async () => {
      try {
        // Check cache first
        const cached = cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
          setCountries(cached.data);
          setLoading(false);
          return;
        }

        setLoading(true);
        
        // Add error handling and timeout for the fetch request
        const fetchWithTimeout = async (timeout = 10000) => {
          const controller = new AbortController();
          const id = setTimeout(() => controller.abort(), timeout);
          
          try {
            let query = supabase
              .from('cms_countries')
              .select('*');
              
            if (options.status) {
              query = query.eq('status', options.status);
            }

            if (options.region) {
              query = query.eq('region', options.region);
            }

            if (options.showInLocal) {
              query = query.eq('show_in_local', true);
            }

            if (options.topDestination) {
              query = query.eq('top_destination', true);
            }

            query = query.order('name');
            
            const response = await query;
            clearTimeout(id);
            return response;
          } catch (error) {
            clearTimeout(id);
            throw error;
          }
        };

        // Try to fetch from Supabase with timeout
        const { data, error: err } = await fetchWithTimeout();
        
        if (err) throw err;
        
        // If we get here, we have data
        const processedData = data?.map(country => ({
          ...country,
          features: Array.isArray(country.features) ? country.features : [],
          technical_details: Array.isArray(country.technical_details) ? country.technical_details : [],
          languages: Array.isArray(country.languages) ? country.languages : [],
          networks: Array.isArray(country.networks) ? country.networks : [],
          coverimage: country.coverimage || countryImages[country.code] || `https://source.unsplash.com/800x600/?${country.name},landmarks`
        })) || [];
        
        // Cache the result
        cache.set(cacheKey, {
          data: processedData,
          timestamp: Date.now()
        });
        
        setCountries(processedData);
        setError(null);
      } catch (err) {
        console.error('Error loading countries:', err);
        
        // Provide more detailed error message
        setError(`Failed to load countries: ${err.message || 'Unknown error'}`);
        
        // Try to use mock data as fallback
        try {
          const mockCountries = [
            {
              id: '1',
              name: 'United States',
              code: 'US',
              region: 'Americas',
              status: 'active',
              description: 'The United States of America is a diverse country with stunning landscapes, vibrant cities, and a rich cultural heritage.',
              emergency_number: '911',
              currency: 'USD',
              languages: ['English'],
              networks: ['AT&T', 'Verizon', 'T-Mobile'],
              features: ['5G Coverage', 'Unlimited Data', 'Hotspot Enabled', 'No Roaming Charges'],
              technical_details: ['LTE Bands: 2, 4, 5, 12, 13, 14, 17, 66, 71', '5G Bands: n71, n41, n260, n261'],
              coverimage: countryImages['US'],
              starting_price: '$4.50',
              top_destination: true,
              show_in_local: true,
              translations: {
                en: { name: 'United States', description: 'The United States of America is a diverse country with stunning landscapes, vibrant cities, and a rich cultural heritage.' },
                de: { name: 'Vereinigte Staaten', description: 'Die Vereinigten Staaten von Amerika sind ein vielfältiges Land mit atemberaubenden Landschaften, lebendigen Städten und einem reichen kulturellen Erbe.' }
              }
            },
            {
              id: '2',
              name: 'Germany',
              code: 'DE',
              region: 'Europe',
              status: 'active',
              description: 'Germany offers a perfect blend of historical landmarks, modern cities, and beautiful countryside.',
              emergency_number: '112',
              currency: 'EUR',
              languages: ['German'],
              networks: ['Telekom', 'Vodafone', 'O2'],
              features: ['EU Roaming', '5G Coverage', 'Unlimited Data', 'Hotspot Enabled'],
              technical_details: ['LTE Bands: 1, 3, 7, 8, 20, 28', '5G Bands: n1, n3, n28, n78'],
              coverimage: countryImages['DE'],
              starting_price: '€4.99',
              top_destination: true,
              show_in_local: true,
              translations: {
                en: { name: 'Germany', description: 'Germany offers a perfect blend of historical landmarks, modern cities, and beautiful countryside.' },
                de: { name: 'Deutschland', description: 'Deutschland bietet eine perfekte Mischung aus historischen Wahrzeichen, modernen Städten und schöner Landschaft.' }
              }
            },
            {
              id: '3',
              name: 'Albania',
              code: 'AL',
              region: 'Europe',
              status: 'active',
              description: 'Albania features stunning Mediterranean beaches, mountain landscapes, and rich historical heritage.',
              emergency_number: '112',
              currency: 'ALL',
              languages: ['Albanian'],
              networks: ['Vodafone', 'One Albania', 'ALBtelecom'],
              features: ['4G Coverage', 'Affordable Data', 'Hotspot Enabled', 'No Roaming Charges'],
              technical_details: ['LTE Bands: 1, 3, 7, 8, 20', '5G: Coming Soon'],
              coverimage: countryImages['AL'],
              starting_price: '€3.99',
              top_destination: false,
              show_in_local: true,
              translations: {
                en: { name: 'Albania', description: 'Albania features stunning Mediterranean beaches, mountain landscapes, and rich historical heritage.' },
                sq: { name: 'Shqipëria', description: 'Shqipëria ka plazhe mahnitëse mesdhetare, peizazhe malore dhe trashëgimi të pasur historike.' }
              }
            }
          ];
          
          setCountries(mockCountries);
        } catch (mockError) {
          console.error('Error loading mock countries:', mockError);
        }
      } finally {
        setLoading(false);
      }
    };

    loadCountries();
  }, [options.region, options.status, options.showInLocal, options.topDestination, cacheKey]);

  return { countries, loading, error };
}

export function useRegions() {
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cacheKey = 'regions';

  useEffect(() => {
    const loadRegions = async () => {
      try {
        // Check cache first
        const cached = cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
          setRegions(cached.data);
          setLoading(false);
          return;
        }

        setLoading(true);
        
        // Add error handling and timeout for the fetch request
        const fetchWithTimeout = async (timeout = 10000) => {
          const controller = new AbortController();
          const id = setTimeout(() => controller.abort(), timeout);
          
          try {
            const response = await supabase
              .from('cms_regions')
              .select('*')
              .order('name');
            
            clearTimeout(id);
            return response;
          } catch (error) {
            clearTimeout(id);
            throw error;
          }
        };

        const { data, error: err } = await fetchWithTimeout();
        
        if (err) throw err;
        
        // Cache the result
        cache.set(cacheKey, {
          data: data || [],
          timestamp: Date.now()
        });
        
        setRegions(data || []);
        setError(null);
      } catch (err) {
        console.error('Error loading regions:', err);
        setError(err.message);
        
        // Try to use mock data as fallback
        try {
          const mockRegions = [
            {
              id: '1',
              name: 'Europe',
              description: 'Coverage across European countries with seamless roaming.',
              countries: [
                { code: 'DE', name: 'Germany' },
                { code: 'FR', name: 'France' },
                { code: 'IT', name: 'Italy' },
                { code: 'ES', name: 'Spain' }
              ],
              starting_price: '€9.99',
              explore_packages_url: '/regions/europe'
            },
            {
              id: '2',
              name: 'Asia',
              description: 'Stay connected across Asian countries with reliable coverage.',
              countries: [
                { code: 'JP', name: 'Japan' },
                { code: 'KR', name: 'South Korea' },
                { code: 'TH', name: 'Thailand' },
                { code: 'SG', name: 'Singapore' }
              ],
              starting_price: '$12.99',
              explore_packages_url: '/regions/asia'
            },
            {
              id: '3',
              name: 'Americas',
              description: 'Connect across North and South America with our regional plans.',
              countries: [
                { code: 'US', name: 'United States' },
                { code: 'CA', name: 'Canada' },
                { code: 'MX', name: 'Mexico' },
                { code: 'BR', name: 'Brazil' }
              ],
              starting_price: '$14.99',
              explore_packages_url: '/regions/americas'
            }
          ];
          
          setRegions(mockRegions);
        } catch (mockError) {
          console.error('Error loading mock regions:', mockError);
        }
      } finally {
        setLoading(false);
      }
    };

    loadRegions();
  }, []);

  return { regions, loading, error };
}

// Clear cache function for testing or manual cache invalidation
export function clearCache() {
  cache.clear();
}