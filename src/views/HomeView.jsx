import React, { useState } from 'react';
import GridLayout from '../components/grid/GridLayout';
import MapPlaceholder from '../components/map/MapPlaceholder';
import useArticles from '../hooks/useArticles';
import useUIStore from '../store/uiStore';
import { FiGrid, FiList, FiMap } from 'react-icons/fi';

const HomeView = () => {
  const [filters, setFilters] = useState({
    limit: 25,
    offset: 0
  });
  
  const { articles, loading, error } = useArticles(filters);
  const { layoutType, setLayoutType, isMapVisible, toggleMapVisibility } = useUIStore();
  
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
        </div>
        
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
        items={articles} 
        loading={loading} 
        emptyMessage="No news articles available at the moment"
      />
    </div>
  );
};

export default HomeView;
