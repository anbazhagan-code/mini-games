import React, { useState, useEffect, useRef } from 'react';
import '../assets/WhackAMole.css';

const WhackAMole = () => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [moles, setMoles] = useState(Array(9).fill(false));
  const [gameSpeed, setGameSpeed] = useState(1000);
  const timerRef = useRef(null);
  const gameAreaRef = useRef(null);

  // Start a new game
  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setIsPlaying(true);
    setGameSpeed(1000);
    setMoles(Array(9).fill(false));
  };

  // Handle mole whacking
  const whackMole = (index) => {
    if (!isPlaying || !moles[index]) return;
    
    setScore(prevScore => {
      const newScore = prevScore + 1;
      // Increase speed every 5 points
      if (newScore % 5 === 0 && gameSpeed > 300) {
        setGameSpeed(prevSpeed => Math.max(300, prevSpeed - 50));
      }
      return newScore;
    });
    
    // Hide the mole immediately when hit
    setMoles(prev => prev.map((_, i) => i === index ? false : prev[i]));
  };

  // Game timer countdown
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsPlaying(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying]);

  // Mole popping logic
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * 9);
      setMoles(prev => {
        const newMoles = [...prev];
        newMoles[randomIndex] = true;
        return newMoles;
      });

      // Automatically hide the mole after a delay
      const visibleTime = Math.max(500, gameSpeed - 100); // ⬅️ Give user enough time
      setTimeout(() => {
        setMoles(prev => {
          const newMoles = [...prev];
          newMoles[randomIndex] = false;
          return newMoles;
        });
      }, visibleTime);
    }, gameSpeed);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, gameSpeed]);

  // Update high score when game ends
  useEffect(() => {
    if (!isPlaying && timeLeft === 0 && score > highScore) {
      setHighScore(score);
    }
  }, [isPlaying, timeLeft, score, highScore]);

  // Hammer cursor effect
  useEffect(() => {
    const gameArea = gameAreaRef.current;
    if (!gameArea) return;

    const handleMouseMove = (e) => {
      gameArea.style.setProperty('--cursor-x', `${e.clientX}px`);
      gameArea.style.setProperty('--cursor-y', `${e.clientY}px`);
    };

    gameArea.addEventListener('mousemove', handleMouseMove);
    return () => gameArea.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="whack-a-mole-container" ref={gameAreaRef}>
      <h1>Whack-A-Mole!</h1>
      
      <div className="game-info">
        <div className="info-box">
          <span>Time:</span>
          <span className="value">{timeLeft}s</span>
        </div>
        <div className="info-box">
          <span>Score:</span>
          <span className="value">{score}</span>
        </div>
        <div className="info-box">
          <span>High Score:</span>
          <span className="value">{highScore}</span>
        </div>
      </div>

      {!isPlaying ? (
        <button 
          className="start-button" 
          onClick={startGame}
        >
          {timeLeft === 0 ? 'Play Again' : 'Start Game'}
        </button>
      ) : (
        <div className="grid">
          {moles.map((isMoleUp, index) => (
            <div
              key={index}
              className={`hole ${isMoleUp ? 'mole-up' : ''}`}
              onClick={() => whackMole(index)}
            >
              {isMoleUp && (
                <div className="mole">
                  <div className="eyes">
                    <div className="eye"></div>
                    <div className="eye"></div>
                  </div>
                  <div className="nose"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="game-tips">
        {!isPlaying && timeLeft === 0 && (
          <p className="game-over">Game Over! Your score: {score}</p>
        )}
        <p>Click on moles as they appear to score points!</p>
      </div>
    </div>
  );
};

export default WhackAMole;