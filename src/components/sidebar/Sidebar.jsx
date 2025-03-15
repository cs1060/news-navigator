import React from 'react';
import { FiX, FiFilter, FiMap, FiCalendar, FiTag, FiGrid, FiList } from 'react-icons/fi';
import useUIStore from '../../store/uiStore';
import useMockData from '../../hooks/useMockData';

/**
 * Sidebar Component
 * Provides filters, settings, and navigation options
 */
const Sidebar = () => {
  const { isSidebarOpen, toggleSidebar, layoutType, setLayoutType } = useUIStore();
  const { data: categories, loading } = useMockData('categories');

  // Collapsible section component
  const CollapsibleSection = ({ title, icon, children }) => {
    const [isOpen, setIsOpen] = React.useState(true);
    
    return (
      <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center space-x-2">
            {icon}
            <span className="font-medium">{title}</span>
          </div>
          <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>
        {isOpen && <div className="p-3">{children}</div>}
      </div>
    );
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-20 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 md:static md:z-0 md:h-full md:${
        isSidebarOpen ? 'block' : 'hidden'
      }`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-semibold text-gray-800">Filters & Options</h2>
        <button
          onClick={toggleSidebar}
          className="md:hidden text-gray-500 hover:text-gray-700"
          aria-label="Close sidebar"
        >
          <FiX size={20} />
        </button>
      </div>

      {/* Sidebar Content */}
      <div className="p-4 overflow-y-auto h-full pb-20">
        {/* View Toggle */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">View Layout</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setLayoutType('grid')}
              className={`flex items-center justify-center px-4 py-2 rounded-md ${
                layoutType === 'grid'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <FiGrid className="mr-2" />
              Grid
            </button>
            <button
              onClick={() => setLayoutType('list')}
              className={`flex items-center justify-center px-4 py-2 rounded-md ${
                layoutType === 'list'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <FiList className="mr-2" />
              List
            </button>
          </div>
        </div>

        {/* Filters Sections */}
        <CollapsibleSection title="Categories" icon={<FiTag size={18} />}>
          {loading ? (
            <p className="text-gray-500">Loading categories...</p>
          ) : (
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`category-${category.id}`}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor={`category-${category.id}`}
                    className="ml-2 text-sm text-gray-700"
                  >
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
          )}
        </CollapsibleSection>

        <CollapsibleSection title="Date Range" icon={<FiCalendar size={18} />}>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-700 mb-1">From</label>
              <input
                type="date"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">To</label>
              <input
                type="date"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              />
            </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Location" icon={<FiMap size={18} />}>
          <div className="space-y-2">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Distance</label>
              <select className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50">
                <option value="5">Within 5 miles</option>
                <option value="10">Within 10 miles</option>
                <option value="25">Within 25 miles</option>
                <option value="50">Within 50 miles</option>
                <option value="100">Within 100 miles</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">City</label>
              <input
                type="text"
                placeholder="Enter city name"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              />
            </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Advanced Filters" icon={<FiFilter size={18} />}>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="include-images"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="include-images" className="ml-2 text-sm text-gray-700">
                Only with images
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="verified-sources"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="verified-sources" className="ml-2 text-sm text-gray-700">
                Verified sources only
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="include-videos"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="include-videos" className="ml-2 text-sm text-gray-700">
                Include video content
              </label>
            </div>
          </div>
        </CollapsibleSection>

        {/* Apply Filters Button */}
        <button className="w-full mt-4 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition-colors">
          Apply Filters
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
