import React from 'react';
import { FiBookmark, FiShare2, FiMapPin } from 'react-icons/fi';

/**
 * Card Component
 * Displays structured content like news articles, settings, or preferences
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Card title
 * @param {string} props.description - Card description
 * @param {string} props.image - URL of the image to display
 * @param {string} props.category - Category of the content
 * @param {string} props.date - Formatted date string
 * @param {Object} props.location - Location data with lat/lng
 * @param {string} props.variant - Card variant ('grid' or 'list')
 * @param {Function} props.onClick - Click handler for the card
 */
const Card = ({
  title,
  description,
  image,
  category,
  date,
  location,
  variant = 'grid',
  onClick,
}) => {
  // Determine card layout based on variant
  const isGridVariant = variant === 'grid';
  
  // Common button style
  const buttonClass = 'text-gray-500 hover:text-blue-600 focus:outline-none p-2 rounded-full hover:bg-gray-100';
  
  // Format description to limit length
  const formatDescription = (text, limit) => {
    if (!text) return '';
    return text.length > limit ? `${text.substring(0, limit)}...` : text;
  };
  
  const handleCardClick = (e) => {
    // If the click was on a button, don't trigger the card click
    if (e.target.closest('button')) return;
    if (onClick) onClick();
  };
  
  return (
    <div 
      onClick={handleCardClick}
      className={`bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg cursor-pointer ${
        isGridVariant 
          ? 'flex flex-col h-full' 
          : 'flex flex-row h-40 sm:h-48'
      }`}
    >
      {/* Card Image */}
      <div 
        className={isGridVariant ? 'h-48' : 'w-1/3 h-full'}
        style={{ 
          backgroundImage: `url(${image || 'https://via.placeholder.com/300x200?text=No+Image'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {category && (
          <span className="inline-block bg-blue-600 text-white text-xs px-2 py-1 m-2 rounded">
            {category}
          </span>
        )}
      </div>
      
      {/* Card Content */}
      <div className={`flex flex-col ${isGridVariant ? 'p-4 flex-1' : 'p-3 flex-1'}`}>
        {/* Title */}
        <h3 className={`font-bold text-gray-800 ${isGridVariant ? 'text-lg mb-2' : 'text-md mb-1'}`}>
          {title}
        </h3>
        
        {/* Description */}
        <p className="text-gray-600 text-sm flex-grow">
          {formatDescription(description, isGridVariant ? 100 : 80)}
        </p>
        
        {/* Footer */}
        <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100">
          <div className="flex items-center text-xs text-gray-500">
            {date && <span className="mr-2">{date}</span>}
            {location && (
              <span className="flex items-center">
                <FiMapPin size={12} className="mr-1" />
                <span>Map</span>
              </span>
            )}
          </div>
          
          <div className="flex">
            <button className={buttonClass} aria-label="Save">
              <FiBookmark size={16} />
            </button>
            <button className={buttonClass} aria-label="Share">
              <FiShare2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
