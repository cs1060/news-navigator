# News Navigator Frontend

The React-based frontend for the News Navigator application, built with Material-UI and modern web technologies, emphasizing accessibility and a consistent design system.

## Technology Stack

- **React**: Modern UI development
- **Material-UI (MUI)**: Component library and design system
- **Redux**: State management
- **Leaflet.js**: Interactive map integration
- **Axios**: API communication

## Design System

- **Material Design**
  - Consistent component styling
  - Typography scale
  - Color system with accessibility in mind
  - Spacing and layout guidelines
  - Interactive states and animations

- **Accessibility Features**
  - ARIA labels and roles
  - Keyboard navigation
  - Screen reader support
  - Color contrast compliance
  - Focus management
  - Responsive text sizing

- **Responsive Design**
  - Mobile-first approach
  - Breakpoint system
  - Flexible grids
  - Adaptive typography
  - Touch-friendly interactions

## Features

- **Modern UI Components**
  - Responsive article cards
  - Interactive world map
  - Bias score indicators
  - Category filters
  - User authentication forms
  - Accessible dialogs and modals

- **State Management**
  - Redux store configuration
  - Authentication state
  - News article management
  - User preferences
  - Error handling

- **User Experience**
  - Mobile-first design
  - Progressive loading
  - Error handling
  - Loading states
  - Responsive layouts
  - Offline capabilities (PWA)

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Navbar.js        # Navigation bar
│   └── ArticleCard.js   # Article display
├── pages/               # Page components
│   ├── Home.js         # Main article feed
│   ├── Map.js          # Geographic view
│   ├── Profile.js      # User settings
│   └── Login.js        # Authentication
├── store/              # Redux state management
│   ├── index.js        # Store configuration
│   └── slices/         # Redux slices
│       ├── authSlice.js
│       └── newsSlice.js
├── theme/              # Material-UI theme customization
│   ├── index.js        # Theme configuration
│   ├── palette.js      # Color system
│   └── typography.js   # Typography scale
└── App.js              # Main component
```

## Design Guidelines

### Colors
- Use theme colors from palette.js
- Ensure sufficient contrast ratios
- Include hover and focus states
- Support light/dark modes
- Use semantic color naming

### Typography
- Follow Material Design type scale
- Use responsive font sizes
- Maintain consistent line heights
- Apply proper text hierarchy
- Support multiple languages

### Components
- Follow atomic design principles
- Ensure keyboard accessibility
- Include loading states
- Handle error states
- Support touch interactions

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   Create a `.env` file:
   ```
   REACT_APP_API_URL=http://localhost:5001/api
   ```

3. **Development Server**
   ```bash
   npm start
   ```
   Access at http://localhost:3000

4. **Build for Production**
   ```bash
   npm run build
   ```

## Available Scripts

- `npm start`: Run development server
- `npm test`: Run tests
- `npm run build`: Build for production
- `npm run eject`: Eject from Create React App

## API Integration

The frontend communicates with the Django backend through these endpoints:

- `/api/articles/`: News article management
- `/api/auth/`: User authentication
- `/api/profiles/`: User profile management
- `/api/saved-articles/`: Saved article features

## Component Guidelines

- Use Material-UI components for consistency
- Follow mobile-first responsive design
- Implement proper loading states
- Handle errors gracefully
- Use Redux for global state
- Keep components focused and reusable
- Ensure keyboard accessibility
- Include ARIA labels
- Support screen readers
- Test with different devices and screen sizes
