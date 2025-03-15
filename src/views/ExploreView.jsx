import React, { useState } from 'react';
import GridLayout from '../components/grid/GridLayout';
import useMockData from '../hooks/useMockData';
import { FiSearch, FiFilter } from 'react-icons/fi';

const ExploreView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { data: categories } = useMockData('categories');
  const { data: articles, loading } = useMockData('articles', {
    category: selectedCategory,
    search: searchQuery
  });

  const handleSearch = (e) => {
    e.preventDefault();
    // In a real app, this would trigger a search with the API
    console.log('Searching for:', searchQuery);
  };

  return (
    <div className="py-4">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Explore News</h1>
        <p className="text-gray-600">Search and explore news from various sources</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search for news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-3 pl-12 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <FiSearch className="absolute left-4 top-3.5 text-gray-400" size={20} />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <FiSearch className="mr-2" />
            Search
          </button>
        </form>
      </div>

      {/* Category Filters */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex space-x-2 pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results Stats */}
      {!loading && (
        <div className="mb-4 flex justify-between items-center">
          <p className="text-gray-600">
            {articles.length} results {selectedCategory !== 'all' && `in ${
              categories.find(c => c.id === selectedCategory)?.name || selectedCategory
            }`}
            {searchQuery && ` for "${searchQuery}"`}
          </p>
          <button className="flex items-center text-gray-600 hover:text-blue-600">
            <FiFilter className="mr-2" />
            More Filters
          </button>
        </div>
      )}

      {/* Content Grid */}
      <GridLayout
        items={articles}
        loading={loading}
        emptyMessage={
          searchQuery
            ? `No results found for "${searchQuery}"`
            : "No articles available for the selected filters"
        }
      />
    </div>
  );
};

export default ExploreView;
