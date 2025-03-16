import React, { useState } from 'react';
import { Switch, Route } from 'react-router-dom';
import Header from './components/Header';
import WorldMapPrototype from './pages/WorldMapPrototype';
import NewsFeed from './pages/NewsFeed';
import CountryNews from './pages/CountryNews';
import SavedArticles from './pages/SavedArticles';
import UserProfile from './pages/UserProfile';

function App() {
  const [user, setUser] = useState(null);
  const [savedArticles, setSavedArticles] = useState([]);
  const [userInterests, setUserInterests] = useState(['politics', 'technology', 'health']);
  
  // Function to save an article
  const saveArticle = (article) => {
    if (!savedArticles.some(a => a.id === article.id)) {
      setSavedArticles([...savedArticles, article]);
    }
  };
  
  // Function to remove a saved article
  const removeSavedArticle = (articleId) => {
    setSavedArticles(savedArticles.filter(article => article.id !== articleId));
  };
  
  // Function to update user interests
  const updateInterests = (interests) => {
    setUserInterests(interests);
  };
  
  // Login function
  const login = (userData) => {
    setUser(userData);
  };
  
  // Logout function
  const logout = () => {
    setUser(null);
  };
  
  return (
    <div className="app">
      <Header user={user} onLogin={login} onLogout={logout} />
      
      <main className="main-content">
        <Switch>
          <Route exact path="/">
            <WorldMapPrototype />
          </Route>
          <Route path="/news-feed">
            <NewsFeed interests={userInterests} />
          </Route>
          <Route path="/country/:countryCode">
            <CountryNews onSaveArticle={saveArticle} />
          </Route>
          <Route path="/saved-articles">
            <SavedArticles 
              savedArticles={savedArticles} 
              onRemoveArticle={removeSavedArticle} 
            />
          </Route>
          <Route path="/profile">
            <UserProfile 
              user={user} 
              interests={userInterests} 
              onUpdateInterests={updateInterests} 
            />
          </Route>
        </Switch>
      </main>
      
      <footer className="footer bg-dark text-light py-4 mt-5">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h5>News Navigator</h5>
              <p className="small">
                A news recommendation platform designed to provide users with news articles 
                from multiple sources while highlighting potential biases.
              </p>
            </div>
            <div className="col-md-6 text-md-end">
              <p className="small">© 2025 News Navigator</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
