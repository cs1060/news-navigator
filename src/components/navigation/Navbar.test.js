import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './Navbar';

// Mock any components/hooks we're not testing directly
jest.mock('../../store/uiStore', () => ({
  useUIStore: () => ({
    currentSection: 'home',
    setCurrentSection: jest.fn(),
    sidebarVisible: true,
    toggleSidebar: jest.fn()
  })
}));

// Mock any icons if needed
jest.mock('react-icons/fi', () => ({
  FiMenu: () => <div data-testid="menu-icon">Menu Icon</div>,
  FiHome: () => <div data-testid="home-icon">Home Icon</div>
}));

describe('Navbar Component', () => {
  test('renders without crashing', () => {
    const { getByTestId } = render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    
    // Check if the component rendered successfully by looking for expected elements
    // This can be adjusted based on actual Navbar implementation
    expect(getByTestId('menu-icon')).toBeInTheDocument();
  });
});
