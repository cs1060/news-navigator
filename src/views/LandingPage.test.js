import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LandingPage from './LandingPage';

// Mock the react-icons
jest.mock('react-icons/fi', () => ({
  FiFileText: () => <div data-testid="file-icon" />,
  FiSettings: () => <div data-testid="settings-icon" />,
  FiGlobe: () => <div data-testid="globe-icon" />,
  FiArrowRight: () => <div data-testid="arrow-icon" />
}));

describe('LandingPage Component', () => {
  const renderWithRouter = (ui) => {
    return render(
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    );
  };

  test('renders without crashing', () => {
    renderWithRouter(<LandingPage />);
    
    // Verify the landing page title is rendered
    expect(screen.getByText('News Navigator UI Framework')).toBeInTheDocument();
  });

  test('displays all three UI components', () => {
    renderWithRouter(<LandingPage />);
    
    // Check for the three main UI component sections
    expect(screen.getByText('News Feed UI')).toBeInTheDocument();
    expect(screen.getByText('User Preferences UI')).toBeInTheDocument();
    expect(screen.getByText('Interactive World UI')).toBeInTheDocument();
  });

  test('contains the correct action buttons', () => {
    renderWithRouter(<LandingPage />);
    
    // Check for CTA buttons
    const getStartedButton = screen.getByText(/Get Started/i);
    expect(getStartedButton).toBeInTheDocument();
    
    const enterAppButton = screen.getByText(/Enter App/i);
    expect(enterAppButton).toBeInTheDocument();
  });

  test('displays correct icons for each feature', () => {
    renderWithRouter(<LandingPage />);
    
    // Check if icons are rendered
    expect(screen.getByTestId('file-icon')).toBeInTheDocument();
    expect(screen.getByTestId('settings-icon')).toBeInTheDocument();
    expect(screen.getByTestId('globe-icon')).toBeInTheDocument();
    expect(screen.getByTestId('arrow-icon')).toBeInTheDocument();
  });
});
