import React from 'react';
import useUIStore from '../../store/uiStore';
import Navbar from '../navigation/Navbar';
import Sidebar from '../sidebar/Sidebar';

/**
 * BaseLayout Component
 * Serves as the foundation for all page layouts
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content to be rendered inside the layout
 * @param {string} props.layoutType - Layout type: 'grid', 'list', or 'full-width'
 */
const BaseLayout = ({ children, layoutType = 'grid' }) => {
  const { isSidebarOpen } = useUIStore();
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <Navbar />
      
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Content Area */}
        <main 
          className={`flex-1 p-4 transition-all duration-300 overflow-y-auto ${
            isSidebarOpen ? 'md:ml-64' : 'ml-0'
          }`}
        >
          <div 
            className={`container mx-auto ${
              layoutType === 'full-width' ? 'max-w-full' : 'max-w-7xl'
            }`}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default BaseLayout;
