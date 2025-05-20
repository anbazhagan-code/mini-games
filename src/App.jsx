// App.js
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import { games } from './gamesConfig';
import './App.css';

// Lazy load components (better performance)
const BackToHome = () => (
  <Link to="/mini-games" className="back-home-btn">
    <FaHome className="icon" /> Back to Home
  </Link>
);

function App() {
  return (
    <Router>
      <div className="app">
        <main className="app-main">
          <Routes>
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
            
            {/* Dynamically generate routes for each game */}
            {games.map((game) => (
              <Route
                key={game.id}
                path={game.path}
                element={
                  <Suspense fallback={<div>Loading...</div>}>
                    <BackToHome />
                    {React.createElement(lazy(game.component))}
                  </Suspense>
                }
              />
            ))}
          </Routes>
        </main>

        <footer className="app-footer">
         <p>© {new Date().getFullYear()} Developed by Anbazhagan. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;