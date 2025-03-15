import React, { useState } from 'react';
import { FiSave, FiRefreshCw, FiGlobe, FiMoon, FiSun, FiBell, FiUser, FiLock } from 'react-icons/fi';

const SettingsView = () => {
  // User settings state
  const [settings, setSettings] = useState({
    theme: 'light',
    fontSize: 'medium',
    language: 'en',
    notifications: {
      browser: true,
      email: false,
      breaking: true,
      daily: true
    },
    privacy: {
      shareData: false,
      saveHistory: true,
      locationAccess: true
    }
  });
  
  // Handle settings change
  const handleSettingChange = (category, setting, value) => {
    if (category) {
      setSettings({
        ...settings,
        [category]: {
          ...settings[category],
          [setting]: value
        }
      });
    } else {
      setSettings({
        ...settings,
        [setting]: value
      });
    }
  };
  
  // Save settings
  const handleSaveSettings = () => {
    // In a real app, this would call an API to save user settings
    console.log('Saving settings:', settings);
    // Show success message or toast notification
    alert('Settings saved successfully!');
  };
  
  // Reset settings to defaults
  const handleResetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      setSettings({
        theme: 'light',
        fontSize: 'medium',
        language: 'en',
        notifications: {
          browser: true,
          email: false,
          breaking: true,
          daily: true
        },
        privacy: {
          shareData: false,
          saveHistory: true,
          locationAccess: true
        }
      });
    }
  };
  
  return (
    <div className="py-4">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Settings</h1>
        <p className="text-gray-600">Customize your News Navigator experience</p>
      </div>
      
      {/* Settings Container */}
      <div className="bg-white rounded-lg shadow-md">
        {/* Display Settings */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FiSun className="mr-2" /> Display Settings
          </h2>
          
          <div className="space-y-6">
            {/* Theme Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Theme
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="theme"
                    checked={settings.theme === 'light'}
                    onChange={() => handleSettingChange(null, 'theme', 'light')}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <FiSun className="mr-1" />
                  Light
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="theme"
                    checked={settings.theme === 'dark'}
                    onChange={() => handleSettingChange(null, 'theme', 'dark')}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <FiMoon className="mr-1" />
                  Dark
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="theme"
                    checked={settings.theme === 'system'}
                    onChange={() => handleSettingChange(null, 'theme', 'system')}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  System Default
                </label>
              </div>
            </div>
            
            {/* Font Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Font Size
              </label>
              <select
                value={settings.fontSize}
                onChange={(e) => handleSettingChange(null, 'fontSize', e.target.value)}
                className="w-full md:w-64 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-20"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
                <option value="x-large">Extra Large</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Language Settings */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FiGlobe className="mr-2" /> Language & Region
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select
                value={settings.language}
                onChange={(e) => handleSettingChange(null, 'language', e.target.value)}
                className="w-full md:w-64 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-20"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="zh">中文</option>
                <option value="ja">日本語</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Notification Settings */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FiBell className="mr-2" /> Notification Settings
          </h2>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700">Browser Notifications</label>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  name="browser-notifications"
                  id="browser-notifications"
                  checked={settings.notifications.browser}
                  onChange={(e) => handleSettingChange('notifications', 'browser', e.target.checked)}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <label
                  htmlFor="browser-notifications"
                  className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                    settings.notifications.browser ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                ></label>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700">Email Notifications</label>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  name="email-notifications"
                  id="email-notifications"
                  checked={settings.notifications.email}
                  onChange={(e) => handleSettingChange('notifications', 'email', e.target.checked)}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <label
                  htmlFor="email-notifications"
                  className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                    settings.notifications.email ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                ></label>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700">Breaking News Alerts</label>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  name="breaking-news"
                  id="breaking-news"
                  checked={settings.notifications.breaking}
                  onChange={(e) => handleSettingChange('notifications', 'breaking', e.target.checked)}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <label
                  htmlFor="breaking-news"
                  className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                    settings.notifications.breaking ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                ></label>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700">Daily Digest</label>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  name="daily-digest"
                  id="daily-digest"
                  checked={settings.notifications.daily}
                  onChange={(e) => handleSettingChange('notifications', 'daily', e.target.checked)}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <label
                  htmlFor="daily-digest"
                  className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                    settings.notifications.daily ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                ></label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Privacy Settings */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FiLock className="mr-2" /> Privacy Settings
          </h2>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700">Share Usage Data</label>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  name="share-data"
                  id="share-data"
                  checked={settings.privacy.shareData}
                  onChange={(e) => handleSettingChange('privacy', 'shareData', e.target.checked)}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <label
                  htmlFor="share-data"
                  className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                    settings.privacy.shareData ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                ></label>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700">Save Browsing History</label>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  name="save-history"
                  id="save-history"
                  checked={settings.privacy.saveHistory}
                  onChange={(e) => handleSettingChange('privacy', 'saveHistory', e.target.checked)}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <label
                  htmlFor="save-history"
                  className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                    settings.privacy.saveHistory ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                ></label>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700">Location Access</label>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  name="location-access"
                  id="location-access"
                  checked={settings.privacy.locationAccess}
                  onChange={(e) => handleSettingChange('privacy', 'locationAccess', e.target.checked)}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <label
                  htmlFor="location-access"
                  className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                    settings.privacy.locationAccess ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                ></label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Account Settings Placeholder */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FiUser className="mr-2" /> Account Settings
          </h2>
          
          <div className="py-4 text-gray-500">
            <p>Account settings would be available in a real application.</p>
          </div>
        </div>
        
        {/* Settings Actions */}
        <div className="p-6 flex justify-between">
          <button
            onClick={handleResetSettings}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center"
          >
            <FiRefreshCw className="mr-2" />
            Reset to Default
          </button>
          
          <button
            onClick={handleSaveSettings}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <FiSave className="mr-2" />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;

// Add CSS for toggle switches
const style = document.createElement('style');
style.textContent = `
  .toggle-checkbox:checked {
    right: 0;
    border-color: #ffffff;
  }
  .toggle-checkbox:checked + .toggle-label {
    background-color: #3b82f6;
  }
  .toggle-label {
    transition: background-color 0.2s ease;
  }
  .toggle-checkbox {
    right: 0;
    transition: all 0.2s ease;
  }
`;
document.head.appendChild(style);
