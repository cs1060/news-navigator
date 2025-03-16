import React from 'react';
import { FiBookmark, FiShare2, FiMapPin, FiClock, FiThumbsUp, FiThumbsDown } from 'react-icons/fi';
import { getCountryName } from '../../utils/countryUtils';
import BiasIndicator from '../bias/BiasIndicator';
import useUserPreferences from '../../hooks/useUserPreferences';

/**
 * Card Component
 * Displays structured content like news articles, settings, or preferences
 * 
 * @param {Object} props - Component props
 * @param {string} props.id - Article ID
 * @param {string} props.title - Card title
 * @param {string} props.description - Card description
 * @param {string} props.image - URL of the image to display
 * @param {string} props.category - Category of the content
 * @param {string} props.country - Country code of the article
 * @param {string} props.source - Source of the article
 * @param {string} props.published_at - Publication date
 * @param {string} props.url - URL of the article
 * @param {string} props.variant - Card variant ('grid' or 'list')
 * @param {Function} props.onClick - Click handler for the card
 * @param {Function} props.onSave - Handler for saving/bookmarking an article
 */
const Card = ({
  id,
  title,
  description,
  image,
  category,
  country,
  source,
  published_at,
  url,
  variant = 'grid',
  onClick,
  onSave,
}) => {
  const { recordInteraction } = useUserPreferences();
  // Determine card layout based on variant
  const isGridVariant = variant === 'grid';
  
  // Common button style
  const buttonClass = 'text-gray-500 hover:text-blue-600 focus:outline-none p-2 rounded-full hover:bg-gray-100';
  
  // Format description to limit length
  const formatDescription = (text, limit) => {
    if (!text) return '';
    return text.length > limit ? `${text.substring(0, limit)}...` : text;
  };

  // Format date to relative time (e.g., "2 hours ago")
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
    return date.toLocaleDateString();
  };
  
  const handleCardClick = (e) => {
    // If the click was on a button, don't trigger the card click
    if (e.target.closest('button')) return;
    if (onClick) onClick();
    
    // Record click interaction
    if (id) {
      try {
        recordInteraction(id, 'click');
      } catch (err) {
        console.error('Failed to record click interaction:', err);
      }
    }
    
    // Open article in new tab
    if (url) window.open(url, '_blank');
  };
  
  const handleSave = (e) => {
    e.stopPropagation();
    
    // Record save interaction
    if (id) {
      try {
        recordInteraction(id, 'save');
      } catch (err) {
        console.error('Failed to record save interaction:', err);
      }
    }
    
    if (onSave) onSave(id);
  };
  
  const handleLike = (e) => {
    e.stopPropagation();
    
    // Record like interaction
    if (id) {
      try {
        recordInteraction(id, 'like');
      } catch (err) {
        console.error('Failed to record like interaction:', err);
      }
    }
  };
  
  const handleDislike = (e) => {
    e.stopPropagation();
    
    // Record dislike interaction
    if (id) {
      try {
        recordInteraction(id, 'dislike');
      } catch (err) {
        console.error('Failed to record dislike interaction:', err);
      }
    }
  };
  
  return (
    <div 
      onClick={handleCardClick}
      className={`bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg cursor-pointer ${
        isGridVariant 
          ? 'flex flex-col h-full' 
          : 'flex flex-row h-48 sm:h-56'
      }`}
    >
      {/* Card Image */}
      <div 
        className={isGridVariant ? 'h-48 relative' : 'w-1/3 h-full relative'}
        style={{ 
          backgroundImage: `url(${image || 'https://via.placeholder.com/300x200?text=No+Image'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute top-2 left-2 flex gap-2">
          {category && (
            <span className="inline-block bg-blue-600 text-white text-xs px-2 py-1 rounded font-medium">
              {category.toUpperCase()}
            </span>
          )}
          {country && (
            <span className="inline-block bg-gray-800 text-white text-xs px-2 py-1 rounded font-medium" title={country}>
              {getCountryName(country)}
            </span>
          )}
        </div>
      </div>
      
      {/* Card Content */}
      <div className={`flex flex-col ${isGridVariant ? 'p-4 flex-1' : 'p-3 flex-1'}`}>
        {/* Source, Bias Indicator, and Date */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <div className="flex items-center">
            {source && (
              <span className="font-medium text-gray-700 mr-2 flex items-center">
                {source}
                {source && <BiasIndicator source={source} variant="badge" />}
              </span>
            )}
          </div>
          {published_at && (
            <span className="flex items-center">
              <FiClock size={12} className="mr-1" />
              {formatDate(published_at)}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className={`font-bold text-gray-800 ${isGridVariant ? 'text-lg mb-2' : 'text-md mb-1'}`}>
          {title}
        </h3>
        
        {/* Description */}
        <p className="text-gray-600 text-sm flex-grow">
          {formatDescription(description, isGridVariant ? 150 : 120)}
        </p>
        
        {/* Footer */}
        <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <button 
              className={buttonClass} 
              aria-label="Save"
              onClick={handleSave}
            >
              <FiBookmark size={16} />
            </button>
            <button 
              className={buttonClass} 
              aria-label="Like"
              onClick={handleLike}
            >
              <FiThumbsUp size={16} />
            </button>
            <button 
              className={buttonClass} 
              aria-label="Dislike"
              onClick={handleDislike}
            >
              <FiThumbsDown size={16} />
            </button>
          </div>
          
          <div className="flex items-center text-xs text-gray-500">
            <span className="text-blue-600 hover:text-blue-800">
              Read more →
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
