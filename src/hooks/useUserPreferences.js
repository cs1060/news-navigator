import { useState, useEffect } from 'react';

const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://127.0.0.1:8080' 
  : process.env.REACT_APP_API_URL;

/**
 * Custom hook to fetch and update user preferences
 * @returns {Object} - { preferences, loading, error, updatePreferences, recordInteraction }
 */
export const useUserPreferences = () => {
  const [preferences, setPreferences] = useState({
    interests: [],
    preferred_categories: [],
    preferred_sources: [],
    excluded_sources: [],
    preferred_countries: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get session ID from localStorage or create a new one
  const getSessionId = () => {
    let sessionId = localStorage.getItem('news_session_id');
    if (!sessionId) {
      sessionId = 'session_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('news_session_id', sessionId);
    }
    return sessionId;
  };

  // Fetch user preferences
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const url = `${API_BASE_URL}/api/preferences/`;
        console.log('Fetching user preferences from:', url);

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
          if (response.status === 404) {
            // No preferences found, use defaults
            console.log('No preferences found, using defaults');
            return;
          }
          throw new Error(`Failed to fetch preferences: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Preferences Response:', data);
        
        setPreferences(data);
      } catch (err) {
        console.error('Error fetching preferences:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, []);

  // Update user preferences
  const updatePreferences = async (newPreferences) => {
    try {
      setLoading(true);
      setError(null);
      
      const url = `${API_BASE_URL}/api/preferences/`;
      console.log('Updating user preferences:', newPreferences);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Session-ID': getSessionId()
        },
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify(newPreferences)
      });

      if (!response.ok) {
        throw new Error(`Failed to update preferences: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Updated Preferences Response:', data);
      
      setPreferences(data);
      return data;
    } catch (err) {
      console.error('Error updating preferences:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Record user interaction with an article
  const recordInteraction = async (articleId, interactionType) => {
    try {
      const url = `${API_BASE_URL}/api/interaction/`;
      console.log(`Recording ${interactionType} interaction for article ${articleId}`);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Session-ID': getSessionId()
        },
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify({
          article_id: articleId,
          interaction_type: interactionType
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to record interaction: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Interaction Response:', data);
      
      return data;
    } catch (err) {
      console.error('Error recording interaction:', err);
      throw err;
    }
  };

  return { 
    preferences, 
    loading, 
    error, 
    updatePreferences,
    recordInteraction
  };
};

export default useUserPreferences;
