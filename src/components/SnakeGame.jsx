import React, { useState, useEffect, useCallback } from 'react';
import '../assets/SnakeGame.css';

const GRID_SIZE = 15;
const CELL_SIZE = window.innerWidth < 500 ? 20 : 25;
const GAME_SPEED = 200;

const getRandomPosition = (filterFn = () => true) => {
  let position;
  do {
    position = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (!filterFn(position));
  return position;
};

const SnakeGame = () => {
  const [snake, setSnake] = useState([{ x: 5, y: 5 }]);
  const [food, setFood] = useState(getRandomPosition());
  const [bigFood, setBigFood] = useState(null); // NEW
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [smallFoodEatenCount, setSmallFoodEatenCount] = useState(0); // NEW

  const resetGame = useCallback(() => {
    setSnake([{ x: 5, y: 5 }]);
    setFood(getRandomPosition());
    setBigFood(null);
    setDirection({ x: 1, y: 0 });
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
    setGameStarted(true);
    setSmallFoodEatenCount(0);
  }, []);

  const checkCollision = useCallback((head, snake) => {
    return snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
  }, []);

  const handleKeyDown = useCallback((e) => {
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
      case ' ':
        setIsPaused(prev => !prev);
        break;
      default:
        break;
    }
  }, [direction]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (!gameStarted || gameOver || isPaused) return;

    const gameLoop = setInterval(() => {
      setSnake((prevSnake) => {
        const newHead = {
          x: (prevSnake[0].x + direction.x + GRID_SIZE) % GRID_SIZE,
          y: (prevSnake[0].y + direction.y + GRID_SIZE) % GRID_SIZE,
        };

        if (checkCollision(newHead, prevSnake)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];
        let ateFood = false;
        let ateBigFood = false;

        if (newHead.x === food.x && newHead.y === food.y) {
          ateFood = true;
          setFood(getRandomPosition());
          setScore(prev => prev + 5);
          setSmallFoodEatenCount(prev => {
            const newCount = prev + 1;
            if (newCount % 5 === 0) {
              // Spawn big food at (4,4) positions
              setBigFood(getRandomPosition(pos => pos.x % 4 === 0 && pos.y % 4 === 0));
            }
            return newCount;
          });
        }

        if (bigFood && newHead.x === bigFood.x && newHead.y === bigFood.y) {
          ateBigFood = true;
          setScore(prev => prev + 25);
          setBigFood(null);
        }

        if (!ateFood && !ateBigFood) {
          newSnake.pop();
        }

        return newSnake;
      });
    }, GAME_SPEED);

    return () => clearInterval(gameLoop);
  }, [direction, food, bigFood, gameOver, isPaused, checkCollision, gameStarted]);

  const handleDirectionChange = (newDirection) => {
    if (!gameStarted) setGameStarted(true);
    if (
      (newDirection.x === 0 && newDirection.y === -1 && direction.y !== 1) ||
      (newDirection.x === 0 && newDirection.y === 1 && direction.y !== -1) ||
      (newDirection.x === -1 && newDirection.y === 0 && direction.x !== 1) ||
      (newDirection.x === 1 && newDirection.y === 0 && direction.x !== -1)
    ) {
      setDirection(newDirection);
    }
  };

  return (
    <div className="snake-game-container">
      <div className="game-header">
        <h1>Snake Game</h1>
        <div className="score-display">Score: {score}</div>
      </div>

      {!gameStarted ? (
        <div className="start-screen">
          <h2>Press any arrow to start</h2>
        </div>
      ) : gameOver ? (
        <div className="game-over-screen">
          <h2>Game Over!</h2>
          <p>Final Score: {score}</p>
          <button className="restart-btn" onClick={resetGame}>Play Again</button>
        </div>
      ) : (
        <div className="game-board-container">
          <div className="snake-grid">
            {Array.from({ length: GRID_SIZE }).map((_, row) => (
              <div className="snake-row" key={row}>
                {Array.from({ length: GRID_SIZE }).map((_, col) => {
                  const isSnake = snake.some(segment => segment.x === col && segment.y === row);
                  const isHead = snake[0].x === col && snake[0].y === row;
                  const isFood = food.x === col && food.y === row;
                  const isBigFood = bigFood && bigFood.x === col && bigFood.y === row;
                  return (
                    <div
                      key={col}
                      className={`snake-cell ${isSnake ? 'snake-body' : ''} ${isHead ? 'snake-head' : ''} ${isFood ? 'snake-food' : ''} ${isBigFood ? 'big-food' : ''}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mobile-controls">
        <button onClick={() => handleDirectionChange({ x: 0, y: -1 })} className="control-btn">↑</button>
        <div className="horizontal-controls">
          <button onClick={() => handleDirectionChange({ x: -1, y: 0 })} className="control-btn">←</button>
          <button onClick={() => handleDirectionChange({ x: 0, y: 1 })} className="control-btn">↓</button>
          <button onClick={() => handleDirectionChange({ x: 1, y: 0 })} className="control-btn">→</button>
        </div>
      </div>

      <div className="game-actions">
        <button onClick={() => setIsPaused(prev => !prev)} className="action-btn" disabled={!gameStarted || gameOver}>
          {isPaused ? 'Resume' : 'Pause'}
        </button>
        <button onClick={resetGame} className="action-btn">Restart</button>
      </div>
    </div>
  );
};

export default SnakeGame;
