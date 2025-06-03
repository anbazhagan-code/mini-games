import React, { useState, useEffect } from 'react';
import '../assets/SnakeGame.css';

const GRID_SIZE = 15;

const getRandomPosition = () => ({
  x: Math.floor(Math.random() * GRID_SIZE),
  y: Math.floor(Math.random() * GRID_SIZE),
});

const SnakeGame = () => {
  const [snake, setSnake] = useState([{ x: 5, y: 5 }]);
  const [food, setFood] = useState(getRandomPosition());
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x !== -1) setDirection({ x: 1, y: 0 });
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    const gameLoop = setInterval(() => {
      setSnake((prevSnake) => {
        const newHead = {
          x: (prevSnake[0].x + direction.x + GRID_SIZE) % GRID_SIZE,
          y: (prevSnake[0].y + direction.y + GRID_SIZE) % GRID_SIZE,
        };

        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          setFood(getRandomPosition());
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 150);

    if (gameOver) {
      clearInterval(gameLoop);
    }

    return () => clearInterval(gameLoop);
  }, [direction, food, gameOver]);

  return (
    <div className="snake-game-container">
      {gameOver && <div className="game-over-message">Game Over!</div>}
      <div className="snake-grid">
        {Array.from({ length: GRID_SIZE }).map((_, row) => (
          <div className="snake-row" key={row}>
            {Array.from({ length: GRID_SIZE }).map((_, col) => {
              const isSnake = snake.some(segment => segment.x === col && segment.y === row);
              const isFood = food.x === col && food.y === row;
              return (
                <div
                  key={col}
                  className={`snake-cell ${isSnake ? 'snake-body' : ''} ${isFood ? 'snake-food' : ''}`}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SnakeGame;
