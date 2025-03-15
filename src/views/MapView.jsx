import React, { useState } from 'react';
import useMockData from '../hooks/useMockData';
import MapPlaceholder from '../components/map/MapPlaceholder';
import Card from '../components/cards/Card';
import { FiMaximize2, FiMinimize2, FiList } from 'react-icons/fi';

const MapView = () => {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showFullMap, setShowFullMap] = useState(false);
  const { data: articles, loading } = useMockData('articles');
  
  // Prepare markers for the map
  const markers = articles.map(article => article.location);
  
  // Handle article selection
  const handleArticleClick = (article) => {
    setSelectedArticle(article);
    // In a real app, this would center the map on the article's location
  };
  
  return (
    <div className="py-4">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Map View</h1>
        <p className="text-gray-600">Explore news articles geographically</p>
      </div>
      
      {/* Map Controls */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <span className="text-gray-600">
            {loading ? 'Loading locations...' : `${markers.length} locations found`}
          </span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowFullMap(!showFullMap)}
            className="flex items-center px-3 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-md"
          >
            {showFullMap ? (
              <>
                <FiMinimize2 className="mr-2" size={16} />
                <span>Split View</span>
              </>
            ) : (
              <>
                <FiMaximize2 className="mr-2" size={16} />
                <span>Full Map</span>
              </>
            )}
          </button>
        </div>
      </div>
      
      <div className={`flex ${showFullMap ? 'flex-col' : 'flex-col md:flex-row gap-6'}`}>
        {/* Map Section */}
        <div className={showFullMap ? 'w-full' : 'md:w-2/3'}>
          <MapPlaceholder markers={markers} fullScreen={false} />
        </div>
        
        {/* Articles List (conditionally hidden in full map mode) */}
        {!showFullMap && (
          <div className="md:w-1/3 mt-6 md:mt-0">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800">News Articles</h3>
                <div className="flex items-center text-sm text-gray-500">
                  <FiList className="mr-1" />
                  {articles.length} Articles
                </div>
              </div>
              
              {loading ? (
                <div className="py-8 flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                  {articles.map((article) => (
                    <div 
                      key={article.id}
                      className={`p-3 rounded-md cursor-pointer transition-colors ${
                        selectedArticle?.id === article.id 
                          ? 'bg-blue-50 border border-blue-200' 
                          : 'hover:bg-gray-50 border border-transparent'
                      }`}
                      onClick={() => handleArticleClick(article)}
                    >
                      <h4 className="font-medium text-gray-800 mb-1">{article.title}</h4>
                      <p className="text-sm text-gray-500 line-clamp-2">{article.description}</p>
                      <div className="flex items-center mt-2 text-xs text-gray-400">
                        <span>{article.date}</span>
                        <span className="mx-2">•</span>
                        <span>{article.category}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Selected Article Detail (if any) */}
      {selectedArticle && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Selected Article</h3>
          <Card
            title={selectedArticle.title}
            description={selectedArticle.description}
            image={selectedArticle.image}
            category={selectedArticle.category}
            date={selectedArticle.date}
            location={selectedArticle.location}
            variant="list"
          />
        </div>
      )}
    </div>
  );
};

export default MapView;
