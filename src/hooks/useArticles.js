import { useState, useEffect } from 'react';

const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://127.0.0.1:8080' 
  : process.env.REACT_APP_API_URL;

/**
 * Custom hook to fetch articles from the backend API
 * @param {Object} filters - Optional filters for the articles
 * @returns {Object} - { articles, loading, error }
 */
export const useArticles = (filters = {}) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Build query parameters
        const params = new URLSearchParams();
        if (filters.keywords) params.append('keywords', filters.keywords);
        if (filters.categories) params.append('categories', filters.categories);
        if (filters.countries) params.append('countries', filters.countries);
        if (filters.limit) params.append('limit', filters.limit);
        if (filters.offset) params.append('offset', filters.offset);

        const url = `${API_BASE_URL}/api/articles/?${params}`;
        console.log('Fetching articles from:', url);

        const response = await fetch(url, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          mode: 'cors'
        });

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error(`Invalid content type: ${contentType}. Expected application/json`);
        }

        const data = await response.json();
        console.log('API Response:', data);
        
        if (!response.ok) {
          throw new Error(data.error || `Failed to fetch articles: ${response.status} ${response.statusText}`);
        }

        if (!data.articles) {
          throw new Error('Invalid response format: missing articles array');
        }

        setArticles(data.articles);
      } catch (err) {
        console.error('Error fetching articles:', err);
        setError(err.message);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [filters]);

  return { articles, loading, error };
};

export default useArticles;
