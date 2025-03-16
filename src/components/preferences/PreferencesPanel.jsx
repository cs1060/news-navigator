import React, { useState, useEffect } from 'react';
import { FiX, FiPlus, FiCheck, FiFilter, FiGlobe, FiBookmark, FiTag } from 'react-icons/fi';
import useUserPreferences from '../../hooks/useUserPreferences';

const CATEGORIES = [
  { id: 'general', name: 'General' },
  { id: 'business', name: 'Business' },
  { id: 'entertainment', name: 'Entertainment' },
  { id: 'health', name: 'Health' },
  { id: 'science', name: 'Science' },
  { id: 'sports', name: 'Sports' },
  { id: 'technology', name: 'Technology' }
];

const COUNTRIES = [
  { id: 'us', name: 'United States' },
  { id: 'gb', name: 'United Kingdom' },
  { id: 'ca', name: 'Canada' },
  { id: 'au', name: 'Australia' },
  { id: 'de', name: 'Germany' },
  { id: 'fr', name: 'France' },
  { id: 'in', name: 'India' },
  { id: 'jp', name: 'Japan' },
  { id: 'cn', name: 'China' },
  { id: 'br', name: 'Brazil' }
];

/**
 * PreferencesPanel Component
 * Allows users to set and update their news preferences
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the panel is open
 * @param {Function} props.onClose - Function to call when closing the panel
 * @param {Function} props.onPreferencesUpdated - Callback when preferences are updated
 */
const PreferencesPanel = ({ isOpen, onClose, onPreferencesUpdated }) => {
  const { preferences, loading, error, updatePreferences } = useUserPreferences();
  
  const [interests, setInterests] = useState([]);
  const [preferredCategories, setPreferredCategories] = useState([]);
  const [preferredSources, setPreferredSources] = useState([]);
  const [excludedSources, setExcludedSources] = useState([]);
  const [preferredCountries, setPreferredCountries] = useState([]);
  const [newInterest, setNewInterest] = useState('');
  const [newSource, setNewSource] = useState('');
  const [newExcludedSource, setNewExcludedSource] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  
  // Initialize form with current preferences
  useEffect(() => {
    if (!loading && preferences) {
      setInterests(preferences.interests || []);
      setPreferredCategories(preferences.preferred_categories || []);
      setPreferredSources(preferences.preferred_sources || []);
      setExcludedSources(preferences.excluded_sources || []);
      setPreferredCountries(preferences.preferred_countries || []);
    }
  }, [preferences, loading]);
  
  const handleAddInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setInterests([...interests, newInterest.trim()]);
      setNewInterest('');
    }
  };
  
  const handleRemoveInterest = (interest) => {
    setInterests(interests.filter(i => i !== interest));
  };
  
  const handleAddSource = () => {
    if (newSource.trim() && !preferredSources.includes(newSource.trim())) {
      setPreferredSources([...preferredSources, newSource.trim()]);
      setNewSource('');
    }
  };
  
  const handleRemoveSource = (source) => {
    setPreferredSources(preferredSources.filter(s => s !== source));
  };
  
  const handleAddExcludedSource = () => {
    if (newExcludedSource.trim() && !excludedSources.includes(newExcludedSource.trim())) {
      setExcludedSources([...excludedSources, newExcludedSource.trim()]);
      setNewExcludedSource('');
    }
  };
  
  const handleRemoveExcludedSource = (source) => {
    setExcludedSources(excludedSources.filter(s => s !== source));
  };
  
  const toggleCategory = (categoryId) => {
    if (preferredCategories.includes(categoryId)) {
      setPreferredCategories(preferredCategories.filter(c => c !== categoryId));
    } else {
      setPreferredCategories([...preferredCategories, categoryId]);
    }
  };
  
  const toggleCountry = (countryId) => {
    if (preferredCountries.includes(countryId)) {
      setPreferredCountries(preferredCountries.filter(c => c !== countryId));
    } else {
      setPreferredCountries([...preferredCountries, countryId]);
    }
  };
  
  const handleSave = async () => {
    try {
      setIsSaving(true);
      setSaveError(null);
      
      const updatedPreferences = {
        interests,
        preferred_categories: preferredCategories,
        preferred_sources: preferredSources,
        excluded_sources: excludedSources,
        preferred_countries: preferredCountries
      };
      
      const result = await updatePreferences(updatedPreferences);
      console.log('Preferences updated successfully:', result);
      
      if (onPreferencesUpdated) {
        onPreferencesUpdated(result);
      }
      
      onClose();
    } catch (err) {
      console.error('Error saving preferences:', err);
      setSaveError('Failed to save preferences. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full overflow-y-auto shadow-lg">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold">News Preferences</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Close"
          >
            <FiX size={20} />
          </button>
        </div>
        
        <div className="p-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {/* Interests Section */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <FiTag className="mr-2" /> Interests
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Add topics you're interested in to personalize your news feed
                </p>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {interests.map(interest => (
                    <div 
                      key={interest}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
                    >
                      {interest}
                      <button 
                        onClick={() => handleRemoveInterest(interest)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                        aria-label={`Remove ${interest}`}
                      >
                        <FiX size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="flex">
                  <input
                    type="text"
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    placeholder="Add an interest (e.g., politics, climate)"
                    className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddInterest()}
                  />
                  <button
                    onClick={handleAddInterest}
                    className="bg-blue-500 text-white px-3 py-2 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <FiPlus size={20} />
                  </button>
                </div>
              </div>
              
              {/* Categories Section */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <FiFilter className="mr-2" /> Categories
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Select categories you want to see in your feed
                </p>
                
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map(category => (
                    <div 
                      key={category.id}
                      onClick={() => toggleCategory(category.id)}
                      className={`
                        px-3 py-2 rounded-md cursor-pointer flex items-center
                        ${preferredCategories.includes(category.id) 
                          ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                          : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'}
                      `}
                    >
                      {preferredCategories.includes(category.id) && (
                        <FiCheck className="mr-2 text-blue-600" size={16} />
                      )}
                      {category.name}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Countries Section */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <FiGlobe className="mr-2" /> Countries
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Select countries you want news from
                </p>
                
                <div className="grid grid-cols-2 gap-2">
                  {COUNTRIES.map(country => (
                    <div 
                      key={country.id}
                      onClick={() => toggleCountry(country.id)}
                      className={`
                        px-3 py-2 rounded-md cursor-pointer flex items-center
                        ${preferredCountries.includes(country.id) 
                          ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                          : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'}
                      `}
                    >
                      {preferredCountries.includes(country.id) && (
                        <FiCheck className="mr-2 text-blue-600" size={16} />
                      )}
                      {country.name}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Preferred Sources Section */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <FiBookmark className="mr-2" /> Preferred Sources
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Add news sources you prefer
                </p>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {preferredSources.map(source => (
                    <div 
                      key={source}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center"
                    >
                      {source}
                      <button 
                        onClick={() => handleRemoveSource(source)}
                        className="ml-2 text-green-600 hover:text-green-800"
                        aria-label={`Remove ${source}`}
                      >
                        <FiX size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="flex">
                  <input
                    type="text"
                    value={newSource}
                    onChange={(e) => setNewSource(e.target.value)}
                    placeholder="Add a preferred source (e.g., BBC, Reuters)"
                    className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddSource()}
                  />
                  <button
                    onClick={handleAddSource}
                    className="bg-green-500 text-white px-3 py-2 rounded-r-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <FiPlus size={20} />
                  </button>
                </div>
              </div>
              
              {/* Excluded Sources Section */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <FiX className="mr-2" /> Excluded Sources
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Add news sources you want to exclude
                </p>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {excludedSources.map(source => (
                    <div 
                      key={source}
                      className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm flex items-center"
                    >
                      {source}
                      <button 
                        onClick={() => handleRemoveExcludedSource(source)}
                        className="ml-2 text-red-600 hover:text-red-800"
                        aria-label={`Remove ${source}`}
                      >
                        <FiX size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="flex">
                  <input
                    type="text"
                    value={newExcludedSource}
                    onChange={(e) => setNewExcludedSource(e.target.value)}
                    placeholder="Add a source to exclude"
                    className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddExcludedSource()}
                  />
                  <button
                    onClick={handleAddExcludedSource}
                    className="bg-red-500 text-white px-3 py-2 rounded-r-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <FiPlus size={20} />
                  </button>
                </div>
              </div>
              
              {/* Save Error */}
              {saveError && (
                <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
                  {saveError}
                </div>
              )}
              
              {/* Save Button */}
              <div className="flex justify-end pt-4 border-t border-gray-200">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md mr-2 hover:bg-gray-100"
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiCheck className="mr-2" />
                      Save Preferences
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreferencesPanel;
