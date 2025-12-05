import React, { useEffect, useState } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import RequestsPage from './pages/RequestsPage';
import ChatPage from './pages/ChatPage';
import NavBar from './components/NavBar';
import './App.css';

const App = () => {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('login'); // login | register | profile | requests | chat
  const [loading, setLoading] = useState(true);

  // Check for saved user on app load
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const saved = localStorage.getItem('cashswapUser');
        if (saved) {
          const parsed = JSON.parse(saved);
          setUser(parsed);
          
          // Redirect based on user state
          if (parsed.userId) {
            setPage('profile');
          } else if (parsed.phone) {
            setPage('register');
          } else {
            setPage('login');
          }
        } else {
          setPage('login');
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        localStorage.removeItem('cashswapUser');
        setPage('login');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const handleLoginSuccess = (info) => {
    setUser(info);
    localStorage.setItem('cashswapUser', JSON.stringify(info));
    setPage(info.isNewUser ? 'register' : 'profile');
  };

  const handleGoToRegister = (data) => {
    const updatedUser = { ...(user || {}), phone: data.phone };
    setUser(updatedUser);
    localStorage.setItem('cashswapUser', JSON.stringify(updatedUser));
    setPage('register');
  };

  const handleRegistered = (info) => {
    setUser(info);
    localStorage.setItem('cashswapUser', JSON.stringify(info));
    setPage('profile');
  };

  const handleNavigate = (target) => {
    // Prevent navigation to protected pages without userId
    if (!user?.userId && target !== 'login' && target !== 'register') {
      console.warn('Unauthorized navigation attempt');
      return;
    }
    setPage(target);
  };

  const handleLogout = () => {
    // Clear user data
    localStorage.removeItem('cashswapUser');
    setUser(null);
    setPage('login');
  };

  // Loading state
  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
        <p>Loading CashSwap...</p>
      </div>
    );
  }

  // Public routes (no authentication required)
  if (!user || !user.phone) {
    return (
      <div className="app">
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          onGoToRegister={handleGoToRegister}
        />
      </div>
    );
  }

  // Registration required (phone verified but no userId)
  if (user && user.phone && !user.userId && page === 'register') {
    return (
      <div className="app">
        <RegisterPage user={user} onRegistered={handleRegistered} />
      </div>
    );
  }

  // Protected routes (authenticated users only)
  return (
    <div className="app">
      <NavBar
        currentPage={page}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        user={user}
      />
      <div className="app-content">
        {page === 'profile' && <ProfilePage user={user} />}
        {page === 'requests' && <RequestsPage user={user} />}
        {page === 'chat' && <ChatPage user={user} />}
      </div>
    </div>
  );
};

export default App;
