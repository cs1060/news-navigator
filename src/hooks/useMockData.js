import { useState, useEffect } from 'react';

// Sample mock news data
const mockNewsArticles = [
  {
    id: 1,
    title: 'New Renewable Energy Plant Opens',
    description: 'A state-of-the-art renewable energy plant has opened in California, promising to power over 100,000 homes.',
    image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    category: 'environment',
    location: { lat: 37.7749, lng: -122.4194 },
    date: '2025-03-10'
  },
  {
    id: 2,
    title: 'Tech Company Announces New AI Features',
    description: 'Leading tech company reveals groundbreaking AI capabilities in their latest product lineup.',
    image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    category: 'technology',
    location: { lat: 47.6062, lng: -122.3321 },
    date: '2025-03-12'
  },
  {
    id: 3,
    title: 'Global Summit on Climate Change',
    description: 'World leaders gather to discuss urgent actions needed to address climate change.',
    image: 'https://images.unsplash.com/photo-1544522708-89db83531b6c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    category: 'politics',
    location: { lat: 51.5074, lng: -0.1278 },
    date: '2025-03-14'
  },
  {
    id: 4,
    title: 'Market Trends Show Economic Recovery',
    description: 'Recent market data indicates strong signs of economic recovery following global challenges.',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    category: 'economy',
    location: { lat: 40.7128, lng: -74.0060 },
    date: '2025-03-11'
  },
  {
    id: 5,
    title: 'Breakthrough in Medical Research',
    description: 'Scientists announce major breakthrough in treatment for chronic diseases.',
    image: 'https://images.unsplash.com/photo-1576671081837-49000212a370?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    category: 'health',
    location: { lat: 42.3601, lng: -71.0589 },
    date: '2025-03-13'
  },
  {
    id: 6,
    title: 'Sports Team Wins Championship',
    description: 'Local sports team clinches championship title after remarkable season.',
    image: 'https://images.unsplash.com/photo-1471295253337-3ceaaedca402?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    category: 'sports',
    location: { lat: 34.0522, lng: -118.2437 },
    date: '2025-03-15'
  }
];

// Mock categories for filtering
const mockCategories = [
  { id: 'all', name: 'All News' },
  { id: 'environment', name: 'Environment' },
  { id: 'technology', name: 'Technology' },
  { id: 'politics', name: 'Politics' },
  { id: 'economy', name: 'Economy' },
  { id: 'health', name: 'Health' },
  { id: 'sports', name: 'Sports' }
];

// Mock navigation items
const mockNavItems = [
  { id: 'home', label: 'Home', path: '/' },
  { id: 'explore', label: 'Explore', path: '/explore' },
  { id: 'map', label: 'Map View', path: '/map' },
  { id: 'saved', label: 'Saved Articles', path: '/saved' },
  { id: 'settings', label: 'Settings', path: '/settings' }
];

/**
 * Custom hook to simulate fetching data from an API
 * @param {string} dataType - Type of data to fetch ('articles', 'categories', 'navItems')
 * @param {Object} filters - Optional filters to apply to the data
 * @returns {Object} - { data, loading, error }
 */
export const useMockData = (dataType, filters = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate API delay
    const timer = setTimeout(() => {
      try {
        let result;
        
        switch(dataType) {
          case 'articles':
            result = [...mockNewsArticles];
            
            // Apply category filter if provided
            if (filters.category && filters.category !== 'all') {
              result = result.filter(article => article.category === filters.category);
            }
            
            // Apply search filter if provided
            if (filters.search) {
              const searchLower = filters.search.toLowerCase();
              result = result.filter(article => 
                article.title.toLowerCase().includes(searchLower) || 
                article.description.toLowerCase().includes(searchLower)
              );
            }
            
            break;
          case 'categories':
            result = [...mockCategories];
            break;
          case 'navItems':
            result = [...mockNavItems];
            break;
          default:
            throw new Error(`Unknown data type: ${dataType}`);
        }
        
        setData(result);
        setLoading(false);
      } catch (e) {
        setError(e.message);
        setLoading(false);
      }
    }, 500); // 500ms delay to simulate network request
    
    return () => clearTimeout(timer);
  }, [dataType, filters]);

  return { data, loading, error };
};

export default useMockData;
