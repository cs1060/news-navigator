import React, { useState, useEffect } from 'react';
import GridLayout from '../components/grid/GridLayout';
import MapPlaceholder from '../components/map/MapPlaceholder';
import useArticles from '../hooks/useArticles';
import usePersonalizedNews from '../hooks/usePersonalizedNews';
import useUserPreferences from '../hooks/useUserPreferences';
import PreferencesPanel from '../components/preferences/PreferencesPanel';
import useUIStore from '../store/uiStore';
import { FiGrid, FiList, FiMap, FiSettings, FiRefreshCw } from 'react-icons/fi';

const HomeView = () => {
  const [filters, setFilters] = useState({
    limit: 25,
    offset: 0
  });
  const [usePersonalized, setUsePersonalized] = useState(true);
  const [isPreferencesPanelOpen, setIsPreferencesPanelOpen] = useState(false);
  const [savedArticles, setSavedArticles] = useState([]);
  
  // Get articles from either personalized or regular endpoint
  const { articles: personalizedArticles, loading: personalizedLoading, error: personalizedError } = usePersonalizedNews(filters);
  const { articles: regularArticles, loading: regularLoading, error: regularError } = useArticles(filters);
  
  // Determine which articles to display
  const articles = usePersonalized ? personalizedArticles : regularArticles;
  const loading = usePersonalized ? personalizedLoading : regularLoading;
  const error = usePersonalized ? personalizedError : regularError;
  
  const { preferences } = useUserPreferences();
  const { layoutType, setLayoutType, isMapVisible, toggleMapVisibility } = useUIStore();
  
  // Load saved articles from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('saved_articles');
    if (saved) {
      try {
        setSavedArticles(JSON.parse(saved));
      } catch (err) {
        console.error('Failed to parse saved articles:', err);
      }
    }
  }, []);
  
  // Handle saving/bookmarking an article
  const handleSaveArticle = (articleId) => {
    const articleToSave = articles.find(article => article.id === articleId);
    if (!articleToSave) return;
    
    const newSavedArticles = [...savedArticles];
    const existingIndex = newSavedArticles.findIndex(a => a.id === articleId);
    
    if (existingIndex >= 0) {
      // Remove if already saved
      newSavedArticles.splice(existingIndex, 1);
    } else {
      // Add if not saved
      newSavedArticles.push(articleToSave);
    }
    
    setSavedArticles(newSavedArticles);
    localStorage.setItem('saved_articles', JSON.stringify(newSavedArticles));
  };
  
  // Prepare location markers for the map from articles
  const markers = articles
    .filter(article => article.location)
    .map(article => article.location);
  
  return (
    <div className="py-4">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Latest News</h1>
        <p className="text-gray-600">Discover the latest news from around the world</p>
      </div>
      
      {/* View Controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2">
          <button
            onClick={() => setLayoutType('grid')}
            className={`flex items-center px-3 py-2 rounded-md ${
              layoutType === 'grid'
                ? 'bg-blue-100 text-blue-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <FiGrid className="mr-2" size={16} />
            Grid
          </button>
          <button
            onClick={() => setLayoutType('list')}
            className={`flex items-center px-3 py-2 rounded-md ${
              layoutType === 'list'
                ? 'bg-blue-100 text-blue-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <FiList className="mr-2" size={16} />
            List
          </button>
          <button
            onClick={() => setUsePersonalized(!usePersonalized)}
            className={`flex items-center px-3 py-2 rounded-md ${
              usePersonalized
                ? 'bg-blue-100 text-blue-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title={usePersonalized ? 'Currently showing personalized news' : 'Currently showing general news'}
          >
            <FiRefreshCw className="mr-2" size={16} />
            {usePersonalized ? 'Personalized' : 'General'}
          </button>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setIsPreferencesPanelOpen(true)}
            className="flex items-center px-3 py-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            <FiSettings className="mr-2" size={16} />
            Preferences
          </button>
          <button
            onClick={toggleMapVisibility}
            className={`flex items-center px-3 py-2 rounded-md ${
              isMapVisible
                ? 'bg-blue-100 text-blue-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <FiMap className="mr-2" size={16} />
            {isMapVisible ? 'Hide Map' : 'Show Map'}
          </button>
        </div>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      
      {/* Map (conditionally rendered) */}
      {isMapVisible && (
        <div className="mb-6">
          <MapPlaceholder markers={markers} />
        </div>
      )}
      
      {/* Content Grid/List */}
      <GridLayout 
        items={articles.map(article => ({
          ...article,
          onSave: handleSaveArticle
        }))} 
        loading={loading} 
        emptyMessage="No news articles available at the moment"
      />
      
      {/* Preferences Panel */}
      <PreferencesPanel 
        isOpen={isPreferencesPanelOpen} 
        onClose={() => setIsPreferencesPanelOpen(false)} 
        onPreferencesUpdated={() => {
          // Refresh articles when preferences are updated
          setUsePersonalized(true);
        }}
      />
    </div>
  );
};

export default HomeView;
