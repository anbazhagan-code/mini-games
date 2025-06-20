import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import { games } from './gamesConfig';
import './App.css';

const BackToHome = () => (
  <Link to="/mini-games" className="back-home-btn">
    <FaHome className="icon" />
    <span className="btn-text">Back to Home</span>
  </Link>
);

const LoadingSpinner = () => (
  <div className="loading-container">
    <div className="spinner"></div>
    <p>Loading your game...</p>
  </div>
);

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const showFooter = location.pathname.startsWith("/mini-games");

  return (
    <div className="app">
      <main className="app-main">
        <Routes>
          {/* Home Route */}
          <Route
            path="/mini-games"
            element={
              <div className="home-container">
                <h2 className="welcome-message">Welcome to Mini Games!</h2>
                <p className="intro-text">Select a game to start playing</p>
                <div className="game-grid">
                  {games.map((game) => (
                    <Link key={game.id} to={game.path} className="game-card">
                      <div className="game-icon">{game.icon}</div>
                      <h3>{game.name}</h3>
                      <p>{game.description}</p>
                    </Link>
                  ))}
                </div>
              </div>
            }
          />

          {/* Game Routes */}
          {games.map((game) => (
            <Route
              key={game.id}
              path={game.path}
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <BackToHome />
                  {React.createElement(lazy(game.component))}
                </Suspense>
              }
            />
          ))}

          {/* Catch-all redirect to /mini-games */}
          <Route path="*" element={<Navigate to="/mini-games" replace />} />
        </Routes>
      </main>

      {showFooter && (
        <footer className="app-footer">
          <p>© {new Date().getFullYear()} Developed by Anbazhagan. All rights reserved.</p>
        </footer>
      )}
    </div>
  );
}

export default App;
