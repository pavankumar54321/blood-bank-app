import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Search from './components/Search';
import Profile from './components/Profile';
import AdminPanel from './components/AdminPanel';
import './App.css';

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
    
    if (loggedIn) {
      try {
        const donorData = JSON.parse(localStorage.getItem('donorData') || '{}');
        setIsAdmin(!!donorData.isAdmin || !!donorData.admin);
      } catch (e) {
        setIsAdmin(false);
      }
    }
  }, [location.pathname]); // Re-check when route changes

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    try {
      const donorData = JSON.parse(localStorage.getItem('donorData') || '{}');
      setIsAdmin(!!donorData.isAdmin || !!donorData.admin);
    } catch (e) {
      setIsAdmin(false);
    }
    navigate('/search');
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('donorData');
    setIsLoggedIn(false);
    navigate('/login');
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
            <Link
              to="/search"
              className={`nav-button ${location.pathname === '/search' ? 'active' : ''}`}
              style={{ textDecoration: 'none' }}
            >
              Search Donors
            </Link>
            <Link
              to="/profile"
              className={`nav-button ${location.pathname === '/profile' ? 'active' : ''}`}
              style={{ textDecoration: 'none' }}
            >
              My Profile
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className={`nav-button ${location.pathname === '/admin' ? 'active' : ''}`}
                style={{ textDecoration: 'none', background: '#343a40', color: 'white', borderColor: '#343a40' }}
              >
                ⚙️ Admin Panel
              </Link>
            )}
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
        <Routes>
          <Route 
            path="/login" 
            element={isLoggedIn ? <Navigate to="/search" /> : <Login onLoginSuccess={handleLoginSuccess} />} 
          />
          <Route 
            path="/register" 
            element={isLoggedIn ? <Navigate to="/search" /> : <Register />} 
          />
          <Route 
            path="/search" 
            element={isLoggedIn ? <Search /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/profile" 
            element={isLoggedIn ? <Profile /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/admin" 
            element={isLoggedIn && isAdmin ? <AdminPanel /> : <Navigate to={isLoggedIn ? "/search" : "/login"} />} 
          />
          <Route 
            path="*" 
            element={<Navigate to={isLoggedIn ? "/search" : "/login"} />} 
          />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;