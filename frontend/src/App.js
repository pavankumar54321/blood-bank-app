import React, { useState, useEffect } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import Search from './components/Search';
import Profile from './components/Profile';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
    if (loggedIn) {
      setCurrentView('search');
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setCurrentView('search');
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('donorData');
    setIsLoggedIn(false);
    setCurrentView('login');
  };

  const renderView = () => {
    if (!isLoggedIn) {
      switch (currentView) {
        case 'register':
          return <Register onSwitchToLogin={() => setCurrentView('login')} />;
        case 'login':
        default:
          return <Login onSwitchToRegister={() => setCurrentView('register')} onLoginSuccess={handleLoginSuccess} />;
      }
    } else {
      switch (currentView) {
        case 'search':
          return <Search />;
        case 'profile':
          return <Profile />;
        default:
          return <Search />;
      }
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>Blood Bank Dictionary</h1>
        <p>Find blood donors in your area</p>
      </header>

      {isLoggedIn && (
        <nav className="app-nav">
          <div className="nav-buttons">
            <button
              className={`nav-button ${currentView === 'search' ? 'active' : ''}`}
              onClick={() => setCurrentView('search')}
            >
              Search Donors
            </button>
            <button
              className={`nav-button ${currentView === 'profile' ? 'active' : ''}`}
              onClick={() => setCurrentView('profile')}
            >
              My Profile
            </button>
            <button
              className="logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </nav>
      )}

      <main className="app-main">
        {renderView()}
      </main>
    </div>
  );
}

export default App;