import React, { useState } from 'react';
import { FiMenu, FiX, FiSearch, FiUser, FiBell } from 'react-icons/fi';
import useMockData from '../../hooks/useMockData';
import useUIStore from '../../store/uiStore';

/**
 * Navbar Component
 * Top-level navigation for the application
 */
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { toggleSidebar } = useUIStore();
  const { data: navItems } = useMockData('navItems');
  const { currentSection, setCurrentSection } = useUIStore();

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavItemClick = (itemId) => {
    setCurrentSection(itemId);
    setIsMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Search query:', searchQuery);
    // In a real app, this would trigger a search
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo and sidebar toggle */}
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="mr-3 text-gray-600 hover:text-gray-800 focus:outline-none"
              aria-label="Toggle sidebar"
            >
              <FiMenu size={24} />
            </button>
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">News</span>
              <span className="text-2xl font-bold text-gray-800">Navigator</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavItemClick(item.id)}
                className={`py-2 px-1 font-medium text-sm transition-colors ${
                  currentSection === item.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-blue-500'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Search, notifications, profile */}
          <div className="flex items-center space-x-4">
            <form onSubmit={handleSearch} className="hidden md:flex relative">
              <input
                type="text"
                placeholder="Search news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="py-2 pl-10 pr-4 w-64 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
            </form>
            <button
              className="text-gray-600 hover:text-gray-800 focus:outline-none"
              aria-label="Notifications"
            >
              <FiBell size={20} />
            </button>
            <button
              className="text-gray-600 hover:text-gray-800 focus:outline-none"
              aria-label="User profile"
            >
              <FiUser size={20} />
            </button>
            <button
              className="md:hidden text-gray-600 hover:text-gray-800 focus:outline-none"
              onClick={handleMenuToggle}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search news..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <FiSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
            </form>
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavItemClick(item.id)}
                  className={`py-2 px-4 rounded-md font-medium text-sm transition-colors ${
                    currentSection === item.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
