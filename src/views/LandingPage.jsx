import React from 'react';
import { Link } from 'react-router-dom';
import { FiFileText, FiSettings, FiGlobe, FiArrowRight } from 'react-icons/fi';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header/Navigation */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-blue-600">News</span>
            <span className="text-2xl font-bold text-gray-800">Navigator</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
            <Link to="/home" className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Enter App
            </Link>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              News Navigator UI Framework
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              A modular and reusable UI foundation built with React and Tailwind CSS for navigating news and information with ease.
            </p>
            <Link to="/home" className="bg-blue-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center">
              Get Started <FiArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* Three Main Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* News Feed UI */}
            <div className="bg-blue-50 rounded-lg p-8 shadow-lg transition-transform hover:-translate-y-1">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mb-6 mx-auto">
                <FiFileText className="text-blue-600" size={36} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">News Feed UI</h3>
              <p className="text-gray-600 text-center">
                Displays structured content such as news articles with customizable layouts and dynamic filtering options.
              </p>
              
              <div className="mt-8 bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="grid grid-cols-2 gap-4 p-4">
                  <div>
                    <div className="h-24 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                  <div>
                    <div className="h-24 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* User Preferences UI */}
            <div className="bg-blue-50 rounded-lg p-8 shadow-lg transition-transform hover:-translate-y-1">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mb-6 mx-auto">
                <FiSettings className="text-blue-600" size={36} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">User Preferences UI</h3>
              <p className="text-gray-600 text-center">
                Allows users to adjust settings and customize content with intuitive controls and real-time updates.
              </p>
              
              <div className="mt-8 bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                </div>
                <div className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="w-12 h-6 bg-blue-600 rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="w-12 h-6 bg-gray-200 rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="w-12 h-6 bg-blue-600 rounded-full"></div>
                  </div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
            
            {/* Interactive World UI */}
            <div className="bg-blue-50 rounded-lg p-8 shadow-lg transition-transform hover:-translate-y-1">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mb-6 mx-auto">
                <FiGlobe className="text-blue-600" size={36} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">Interactive World UI</h3>
              <p className="text-gray-600 text-center">
                Explore news and information in a geographic context with an interactive map-based visualization.
              </p>
              
              <div className="mt-8 bg-white shadow-md rounded-lg overflow-hidden">
                <div className="h-36 bg-blue-100 relative">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white rounded-full flex items-center justify-center">
                    <FiGlobe className="text-blue-600" size={32} />
                  </div>
                  <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="absolute bottom-1/3 right-1/3 w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-red-500 rounded-full"></div>
                </div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Explore News Navigator?</h2>
          <Link to="/home" className="bg-white text-blue-600 px-8 py-3 rounded-md text-lg font-medium hover:bg-blue-50 transition-colors inline-flex items-center">
            Try It Now <FiArrowRight className="ml-2" />
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <span className="text-xl font-bold text-blue-400">News</span>
            <span className="text-xl font-bold text-white">Navigator</span>
          </div>
          <p className="text-gray-400 text-sm">
            &copy; 2025 News Navigator UI Framework. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
