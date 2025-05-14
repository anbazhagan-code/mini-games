import React, { useState, useEffect } from 'react';
import '../assets/CatchTheBall.css';

function CatchTheBall() {
  const [ballPosition, setBallPosition] = useState(50); // In percentage
  const [catcherPosition, setCatcherPosition] = useState(50); // In percentage
  const [ballTop, setBallTop] = useState(0); // Ball falling from top
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setBallTop(prev => {
        const nextTop = prev + 2;
        if (nextTop >= 90) {
          if (Math.abs(catcherPosition - ballPosition) <= 10) {
            // Ball caught
            setScore(score + 1);
            setBallTop(0);
            setBallPosition(Math.random() * 90);
          } else {
            setGameOver(true);
          }
        }
        return nextTop >= 100 ? 100 : nextTop;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [ballTop, catcherPosition, ballPosition, gameOver, score]);

  const handleMouseMove = (e) => {
    if (!gameOver) {
      const position = (e.clientX / window.innerWidth) * 100;
      setCatcherPosition(position);
    }
  };

  const resetGame = () => {
    setScore(0);
    setGameOver(false);
    setBallTop(0);
    setBallPosition(Math.random() * 90);
  };

  return (
    <div className="game-wrapper" onMouseMove={handleMouseMove}>
      <h2>Catch The Ball</h2>
      <div className="score">Score: {score}</div>

      <div className="game-area">
        <div
          className="ball"
          style={{
            left: `${ballPosition}%`,
            top: `${ballTop}%`,
          }}
        ></div>

        <div
          className="catcher"
          style={{
            left: `${catcherPosition}%`,
          }}
        ></div>
      </div>

      {gameOver && (
        <div className="game-over">
          <p>Game Over!</p>
          <button onClick={resetGame}>Restart</button>
        </div>
      )}
    </div>
  );
}

export default CatchTheBall;
