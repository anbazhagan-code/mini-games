import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { FaHome, FaGamepad, FaMemory, FaKeyboard, FaPuzzlePiece, FaBasketballBall } from 'react-icons/fa';
import TicTacToe from './components/TicTacToe';
import MemoryMatch from './components/MemoryMatch';
import TypingSpeedTest from './components/TypingSpeedTest';
import PuzzleGame from './components/PuzzleGame';
import CatchTheBall from './components/CatchTheBall';
import './App.css';

// Back button component
const BackToHome = () => {
  return (
    <Link to="/" className="back-home-btn">
      <FaHome className="icon" /> Back to Home
    </Link>
  );
};

function App() {
  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <h1 className="app-title">
            <FaGamepad className="header-icon" /> Mini Games Collection
          </h1>
        </header>
        
        <main className="app-main">
          <Routes>
            <Route path="/" element={
              <div className="home-container">
                <h2 className="welcome-message">Welcome to Mini Games!</h2>
                <p className="intro-text">Select a game to start playing</p>
                <div className="game-grid">
                  <Link to="/tic-tac-toe" className="game-card">
                    <div className="game-icon">
                      <FaGamepad />
                    </div>
                    <h3>Tic Tac Toe</h3>
                    <p>Classic X and O game</p>
                  </Link>
                  <Link to="/memory-match" className="game-card">
                    <div className="game-icon">
                      <FaMemory />
                    </div>
                    <h3>Memory Match</h3>
                    <p>Test your memory skills</p>
                  </Link>
                  <Link to="/typing-speed" className="game-card">
                    <div className="game-icon">
                      <FaKeyboard />
                    </div>
                    <h3>Typing Test</h3>
                    <p>Measure your typing speed</p>
                  </Link>
                  <Link to="/puzzle" className="game-card">
                    <div className="game-icon">
                      <FaPuzzlePiece />
                    </div>
                    <h3>Puzzle</h3>
                    <p>Solve the sliding puzzle</p>
                  </Link>
                  <Link to="/catch-the-ball" className="game-card">
                    <div className="game-icon">
                      <FaBasketballBall />
                    </div>
                    <h3>Catch The Ball</h3>
                    <p>Quick reflexes needed</p>
                  </Link>
                </div>
              </div>
            } />
            <Route path="/tic-tac-toe" element={<><BackToHome /><TicTacToe /></>} />
            <Route path="/memory-match" element={<><BackToHome /><MemoryMatch /></>} />
            <Route path="/typing-speed" element={<><BackToHome /><TypingSpeedTest /></>} />
            <Route path="/puzzle" element={<><BackToHome /><PuzzleGame /></>} />
            <Route path="/catch-the-ball" element={<><BackToHome /><CatchTheBall /></>} />
          </Routes>
        </main>
        
        <footer className="app-footer">
          <p>© {new Date().getFullYear()} Mini Games Collection. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;