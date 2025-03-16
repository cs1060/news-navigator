import { useState, useEffect } from 'react';

const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://127.0.0.1:8080' 
  : process.env.REACT_APP_API_URL;

/**
 * Custom hook to fetch personalized news articles
 * @param {Object} filters - Optional filters for the articles
 * @returns {Object} - { articles, loading, error }
 */
export const usePersonalizedNews = (filters = {}) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get session ID from localStorage
  const getSessionId = () => {
    return localStorage.getItem('news_session_id') || '';
  };

  useEffect(() => {
    const fetchPersonalizedNews = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Build query parameters
        const params = new URLSearchParams();
        if (filters.limit) params.append('limit', filters.limit);
        if (filters.offset) params.append('offset', filters.offset);

        const url = `${API_BASE_URL}/api/personalized/?${params}`;
        console.log('Fetching personalized news from:', url);

        const response = await fetch(url, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-Session-ID': getSessionId()
          },
          credentials: 'include',
          mode: 'cors'
        });

        if (!response.ok) {
          // If personalized endpoint fails, fallback to regular articles
          console.warn('Personalized news endpoint failed, falling back to regular articles');
          throw new Error('Personalized news not available');
        }

        const data = await response.json();
        console.log('Personalized API Response:', data);
        
        if (!data.articles) {
          throw new Error('Invalid response format: missing articles array');
        }

        setArticles(data.articles);
      } catch (err) {
        console.error('Error fetching personalized news:', err);
        setError(err.message);
        
        // Fallback to regular articles
        try {
          const params = new URLSearchParams();
          if (filters.limit) params.append('limit', filters.limit);
          if (filters.offset) params.append('offset', filters.offset);
          
          const fallbackUrl = `${API_BASE_URL}/api/articles/?${params}`;
          console.log('Falling back to regular articles:', fallbackUrl);
          
          const fallbackResponse = await fetch(fallbackUrl, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            mode: 'cors'
          });
          
          const fallbackData = await fallbackResponse.json();
          
          if (fallbackResponse.ok && fallbackData.articles) {
            console.log('Fallback successful, using regular articles');
            setArticles(fallbackData.articles);
            setError(null); // Clear error since we have fallback data
          }
        } catch (fallbackErr) {
          console.error('Fallback also failed:', fallbackErr);
          setArticles([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPersonalizedNews();
  }, [filters]);

  return { articles, loading, error };
};

export default usePersonalizedNews;
