import React from 'react';
import useUIStore from '../../store/uiStore';
import Card from '../cards/Card';

/**
 * GridLayout Component
 * Displays items in either a grid or list format based on the current layout type
 * 
 * @param {Object} props - Component props
 * @param {Array} props.items - Array of items to display in the grid/list
 * @param {boolean} props.loading - Loading state
 * @param {string} props.emptyMessage - Message to display when items array is empty
 */
const GridLayout = ({ items = [], loading = false, emptyMessage = 'No items to display' }) => {
  const { layoutType } = useUIStore();
  const isGrid = layoutType === 'grid';
  
  // Loading states
  if (loading) {
    return (
      <div className="py-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
        <p className="text-center text-gray-500 mt-4">Loading content...</p>
      </div>
    );
  }
  
  // Empty state
  if (items.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-600">{emptyMessage}</p>
      </div>
    );
  }
  
  return (
    <div 
      className={
        isGrid 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" 
          : "flex flex-col space-y-4"
      }
    >
      {items.map((item) => (
        <Card
          key={item.id}
          title={item.title}
          description={item.description}
          image={item.image}
          category={item.category}
          date={item.date}
          location={item.location}
          variant={layoutType}
          onClick={() => console.log('Clicked item:', item.id)}
        />
      ))}
    </div>
  );
};

export default GridLayout;
