import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Mock any components we're not testing directly
jest.mock('./views/LandingPage', () => () => <div data-testid="landing-page">Landing Page Mock</div>);

describe('App Component', () => {
  test('renders without crashing', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    // App renders successfully if it doesn't crash
    expect(screen.getByTestId('landing-page')).toBeInTheDocument();
  });
});
