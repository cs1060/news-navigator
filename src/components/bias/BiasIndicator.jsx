import React from 'react';
import useBiasInfo from '../../hooks/useBiasInfo';
import { FiAlertCircle, FiInfo } from 'react-icons/fi';

/**
 * BiasIndicator Component
 * Displays bias and reliability information for a news source
 * 
 * @param {Object} props - Component props
 * @param {string} props.source - Source name to display bias info for
 * @param {string} props.variant - Display variant ('icon', 'badge', or 'full')
 */
const BiasIndicator = ({ source, variant = 'icon' }) => {
  const { biasInfo, loading, error, getBiasForSource } = useBiasInfo();
  
  // Get bias info for this specific source
  const sourceInfo = getBiasForSource(source);
  
  if (loading || error || !sourceInfo) {
    // Don't display anything if we're loading or have an error
    return variant === 'full' ? (
      <div className="text-xs text-gray-400">No bias data available</div>
    ) : null;
  }
  
  // Map bias ratings to colors and labels
  const getBiasColor = (rating) => {
    switch (rating) {
      case 'far_left': return 'bg-blue-700';
      case 'left': return 'bg-blue-500';
      case 'center_left': return 'bg-blue-300';
      case 'center': return 'bg-gray-300';
      case 'center_right': return 'bg-red-300';
      case 'right': return 'bg-red-500';
      case 'far_right': return 'bg-red-700';
      default: return 'bg-gray-300';
    }
  };
  
  const getBiasLabel = (rating) => {
    switch (rating) {
      case 'far_left': return 'Far Left';
      case 'left': return 'Left';
      case 'center_left': return 'Center-Left';
      case 'center': return 'Center';
      case 'center_right': return 'Center-Right';
      case 'right': return 'Right';
      case 'far_right': return 'Far Right';
      default: return 'Unknown';
    }
  };
  
  // Get reliability color based on score
  const getReliabilityColor = (score) => {
    if (score >= 0.8) return 'bg-green-500';
    if (score >= 0.6) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  // Icon-only variant
  if (variant === 'icon') {
    return (
      <div 
        className="relative inline-block cursor-help" 
        title={`${getBiasLabel(sourceInfo.bias_rating)} • Reliability: ${Math.round(sourceInfo.reliability_score * 100)}%`}
      >
        <FiInfo className="text-blue-500" size={16} />
      </div>
    );
  }
  
  // Badge variant
  if (variant === 'badge') {
    return (
      <div className="flex items-center space-x-1">
        <div 
          className={`w-2 h-2 rounded-full ${getBiasColor(sourceInfo.bias_rating)}`}
          title={`Bias: ${getBiasLabel(sourceInfo.bias_rating)}`}
        ></div>
        <div 
          className={`w-2 h-2 rounded-full ${getReliabilityColor(sourceInfo.reliability_score)}`}
          title={`Reliability: ${Math.round(sourceInfo.reliability_score * 100)}%`}
        ></div>
      </div>
    );
  }
  
  // Full variant
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Bias Rating:</span>
        <span className={`text-sm px-2 py-0.5 rounded ${getBiasColor(sourceInfo.bias_rating)} text-white`}>
          {getBiasLabel(sourceInfo.bias_rating)}
        </span>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Reliability:</span>
        <span className={`text-sm px-2 py-0.5 rounded ${getReliabilityColor(sourceInfo.reliability_score)} text-white`}>
          {Math.round(sourceInfo.reliability_score * 100)}%
        </span>
      </div>
      
      {sourceInfo.description && (
        <p className="text-xs text-gray-600 mt-1">{sourceInfo.description}</p>
      )}
    </div>
  );
};

export default BiasIndicator;
