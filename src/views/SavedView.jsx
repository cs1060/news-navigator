import React, { useState } from 'react';
import GridLayout from '../components/grid/GridLayout';
import { FiTrash2, FiFolder, FiFolderPlus } from 'react-icons/fi';

// Mock saved articles data
const mockSavedArticles = [
  {
    id: 1,
    title: 'New Renewable Energy Plant Opens',
    description: 'A state-of-the-art renewable energy plant has opened in California, promising to power over 100,000 homes.',
    image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    category: 'environment',
    location: { lat: 37.7749, lng: -122.4194 },
    date: '2025-03-10',
    folder: 'Environment'
  },
  {
    id: 2,
    title: 'Tech Company Announces New AI Features',
    description: 'Leading tech company reveals groundbreaking AI capabilities in their latest product lineup.',
    image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    category: 'technology',
    location: { lat: 47.6062, lng: -122.3321 },
    date: '2025-03-12',
    folder: 'Technology'
  },
  {
    id: 5,
    title: 'Breakthrough in Medical Research',
    description: 'Scientists announce major breakthrough in treatment for chronic diseases.',
    image: 'https://images.unsplash.com/photo-1576671081837-49000212a370?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    category: 'health',
    location: { lat: 42.3601, lng: -71.0589 },
    date: '2025-03-13',
    folder: 'Health'
  }
];

// Mock folders
const mockFolders = [
  { id: 'all', name: 'All Saved' },
  { id: 'Technology', name: 'Technology' },
  { id: 'Environment', name: 'Environment' },
  { id: 'Health', name: 'Health' }
];

const SavedView = () => {
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [articles, setArticles] = useState(mockSavedArticles);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  
  // Filter articles by selected folder
  const filteredArticles = selectedFolder === 'all' 
    ? articles 
    : articles.filter(article => article.folder === selectedFolder);
  
  // Create a new folder
  const handleCreateFolder = (e) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      // In a real app, this would call an API to create a folder
      console.log('Creating folder:', newFolderName);
      setNewFolderName('');
      setShowCreateFolder(false);
    }
  };
  
  // Delete an article from saved list
  const handleDeleteArticle = (articleId) => {
    // In a real app, this would call an API to remove the article
    setArticles(articles.filter(article => article.id !== articleId));
  };
  
  return (
    <div className="py-4">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Saved Articles</h1>
        <p className="text-gray-600">Access your bookmarked articles</p>
      </div>
      
      {/* Folder Selection */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-700">Folders</h2>
          <button 
            onClick={() => setShowCreateFolder(!showCreateFolder)}
            className="text-blue-600 hover:text-blue-700 flex items-center text-sm font-medium"
          >
            <FiFolderPlus className="mr-1" />
            New Folder
          </button>
        </div>
        
        {/* Create Folder Form */}
        {showCreateFolder && (
          <form onSubmit={handleCreateFolder} className="mb-4 p-4 bg-gray-50 rounded-md">
            <label htmlFor="folder-name" className="block text-sm font-medium text-gray-700 mb-2">
              Folder Name
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="folder-name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Enter folder name"
                className="flex-grow py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Create
              </button>
            </div>
          </form>
        )}
        
        {/* Folder List */}
        <div className="flex flex-wrap gap-2">
          {mockFolders.map((folder) => (
            <button
              key={folder.id}
              onClick={() => setSelectedFolder(folder.id)}
              className={`flex items-center px-4 py-2 rounded-md ${
                selectedFolder === folder.id
                  ? 'bg-blue-100 text-blue-700 border border-blue-300'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FiFolder className="mr-2" />
              <span>{folder.name}</span>
              {folder.id !== 'all' && (
                <span className="ml-2 bg-gray-200 text-gray-700 text-xs px-1.5 py-0.5 rounded-full">
                  {articles.filter(a => a.folder === folder.id).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      
      {/* Saved Articles Count */}
      <div className="mb-4">
        <p className="text-gray-600">
          {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} saved
          {selectedFolder !== 'all' ? ` in ${selectedFolder}` : ''}
        </p>
      </div>
      
      {/* Articles Grid */}
      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <div key={article.id} className="relative group">
              {/* Delete Button */}
              <button
                onClick={() => handleDeleteArticle(article.id)}
                className="absolute top-2 right-2 z-10 bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity text-gray-600 hover:text-red-600"
                aria-label="Delete saved article"
              >
                <FiTrash2 size={16} />
              </button>
              
              {/* Article Card */}
              <div className="h-full">
                <article className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
                  {/* Image */}
                  <div 
                    className="h-40 bg-cover bg-center"
                    style={{ backgroundImage: `url(${article.image})` }}
                  >
                    <div className="flex justify-between p-2">
                      <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                        {article.category}
                      </span>
                      <span className="bg-white text-gray-700 text-xs px-2 py-1 rounded">
                        {article.folder}
                      </span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-4 flex-grow">
                    <h3 className="font-bold text-gray-800 mb-2">{article.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{article.description}</p>
                    <div className="text-xs text-gray-500 mt-auto pt-2 border-t border-gray-100">
                      Saved on {article.date}
                    </div>
                  </div>
                </article>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-gray-600">No saved articles in this folder</p>
          <button 
            className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
            onClick={() => setSelectedFolder('all')}
          >
            View all saved articles
          </button>
        </div>
      )}
    </div>
  );
};

export default SavedView;
