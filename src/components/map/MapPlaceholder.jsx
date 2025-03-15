import React from 'react';
import { FiMapPin, FiMaximize, FiMinimize } from 'react-icons/fi';
import useUIStore from '../../store/uiStore';

/**
 * MapPlaceholder Component
 * A placeholder for a map service that will be integrated later
 * 
 * @param {Object} props - Component props
 * @param {Array} props.markers - Array of location markers to display on the map
 * @param {boolean} props.fullScreen - Whether the map is displayed in full screen mode
 */
const MapPlaceholder = ({ markers = [], fullScreen = false }) => {
  const [isFullScreen, setIsFullScreen] = React.useState(fullScreen);
  const { isMapVisible } = useUIStore();
  
  // If map is not visible, don't render it
  if (!isMapVisible) return null;
  
  // Toggle fullscreen mode
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };
  
  return (
    <div 
      className={`
        bg-gray-100 rounded-lg overflow-hidden relative border border-gray-300
        ${isFullScreen ? 'fixed inset-0 z-50' : 'h-96'}
      `}
    >
      {/* Placeholder map content */}
      <div className="h-full w-full flex flex-col items-center justify-center">
        <div className="text-gray-400 mb-4">
          <FiMapPin size={48} />
        </div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">Map View</h3>
        <p className="text-gray-500 text-center max-w-md px-4">
          This is a placeholder for a mapping service (like Mapbox or Leaflet).
          In a production application, this would display interactive maps.
        </p>
        
        {/* Example markers */}
        {markers.length > 0 && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 mb-2">News Locations ({markers.length}):</p>
            <div className="flex flex-wrap justify-center gap-2 max-w-lg">
              {markers.map((marker, index) => (
                <div 
                  key={index} 
                  className="bg-white px-3 py-1 rounded-full text-xs text-gray-600 border border-gray-300 flex items-center"
                >
                  <FiMapPin size={12} className="mr-1 text-red-500" />
                  Loc #{index + 1}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Grid overlay to simulate a map */}
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="w-full h-full grid grid-cols-12 grid-rows-6">
            {Array.from({ length: 12 * 6 }).map((_, i) => (
              <div key={i} className="border border-gray-400"></div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Controls overlay */}
      <div className="absolute top-4 right-4 bg-white rounded-md shadow-md p-2">
        <button 
          onClick={toggleFullScreen}
          className="text-gray-600 hover:text-blue-600 focus:outline-none"
          aria-label={isFullScreen ? "Exit full screen" : "Enter full screen"}
        >
          {isFullScreen ? <FiMinimize size={20} /> : <FiMaximize size={20} />}
        </button>
      </div>
    </div>
  );
};

export default MapPlaceholder;
