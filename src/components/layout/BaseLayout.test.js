import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import BaseLayout from './BaseLayout';

// Mock any components/hooks we're not testing directly
jest.mock('../../store/uiStore', () => ({
  useUIStore: () => ({
    currentSection: 'home',
    sidebarVisible: true,
    toggleSidebar: jest.fn()
  })
}));

// Mock any child components
jest.mock('../navigation/Navbar', () => () => <div data-testid="navbar">Navbar Mock</div>);
jest.mock('../navigation/Sidebar', () => () => <div data-testid="sidebar">Sidebar Mock</div>);

describe('BaseLayout Component', () => {
  test('renders without crashing and contains children', () => {
    const { getByTestId, getByText } = render(
      <BrowserRouter>
        <BaseLayout>
          <div>Test Content</div>
        </BaseLayout>
      </BrowserRouter>
    );
    
    // Check for mocked components
    expect(getByTestId('navbar')).toBeInTheDocument();
    expect(getByTestId('sidebar')).toBeInTheDocument();
    
    // Check for children content
    expect(getByText('Test Content')).toBeInTheDocument();
  });
});
