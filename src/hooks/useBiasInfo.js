import { useState, useEffect } from 'react';

const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://127.0.0.1:8080' 
  : process.env.REACT_APP_API_URL;

/**
 * Custom hook to fetch bias information for news sources
 * @param {string} sourceName - Optional specific source name to fetch info for
 * @returns {Object} - { biasInfo, loading, error }
 */
export const useBiasInfo = (sourceName = null) => {
  const [biasInfo, setBiasInfo] = useState(sourceName ? null : []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [biasCache, setBiasCache] = useState({});

  useEffect(() => {
    const fetchBiasInfo = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Check cache first for specific source
        if (sourceName && biasCache[sourceName]) {
          setBiasInfo(biasCache[sourceName]);
          setLoading(false);
          return;
        }
        
        // Construct URL based on whether we want a specific source or all sources
        const url = sourceName 
          ? `${API_BASE_URL}/api/bias-sources/${encodeURIComponent(sourceName)}/`
          : `${API_BASE_URL}/api/bias-sources/`;
          
        console.log('Fetching bias info from:', url);

        const response = await fetch(url, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          mode: 'cors'
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch bias info: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Bias API Response:', data);
        
        if (sourceName) {
          setBiasInfo(data);
          // Update cache
          setBiasCache(prev => ({
            ...prev,
            [sourceName]: data
          }));
        } else {
          setBiasInfo(data);
          // Update cache with all sources
          const newCache = {};
          data.forEach(source => {
            newCache[source.source_name] = source;
          });
          setBiasCache(prev => ({
            ...prev,
            ...newCache
          }));
        }
      } catch (err) {
        console.error('Error fetching bias info:', err);
        setError(err.message);
        setBiasInfo(sourceName ? null : []);
      } finally {
        setLoading(false);
      }
    };

    fetchBiasInfo();
  }, [sourceName]);

  // Helper function to get bias info for a specific source from the cache
  const getBiasForSource = (source) => {
    if (!source) return null;
    return biasCache[source] || null;
  };

  return { 
    biasInfo, 
    loading, 
    error, 
    getBiasForSource 
  };
};

export default useBiasInfo;
