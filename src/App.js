import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BaseLayout from './components/layout/BaseLayout';
import HomeView from './views/HomeView';
import ExploreView from './views/ExploreView';
import MapView from './views/MapView';
import SavedView from './views/SavedView';
import SettingsView from './views/SettingsView';
import LandingPage from './views/LandingPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={
          <BaseLayout>
            <HomeView />
          </BaseLayout>
        } />
        <Route path="/explore" element={
          <BaseLayout>
            <ExploreView />
          </BaseLayout>
        } />
        <Route path="/map" element={
          <BaseLayout>
            <MapView />
          </BaseLayout>
        } />
        <Route path="/saved" element={
          <BaseLayout>
            <SavedView />
          </BaseLayout>
        } />
        <Route path="/settings" element={
          <BaseLayout>
            <SettingsView />
          </BaseLayout>
        } />
      </Routes>
    </Router>
  );
}

export default App;
