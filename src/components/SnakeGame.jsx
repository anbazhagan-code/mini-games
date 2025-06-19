import React, { useState, useEffect, useCallback, useRef } from 'react';
import '../assets/SnakeGame.css';

const GRID_SIZE = 15;
const CELL_SIZE = window.innerWidth < 500 ? 20 : 25;
const GAME_SPEED = 300;

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
  const [bigFood, setBigFood] = useState(null);
  const [bigFoodTimer, setBigFoodTimer] = useState(null);
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [nextDirection, setNextDirection] = useState({ x: 1, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [smallFoodEatenCount, setSmallFoodEatenCount] = useState(0);

  const touchStartRef = useRef(null);

  const resetGame = useCallback(() => {
    setSnake([{ x: 5, y: 5 }]);
    setFood(getRandomPosition());
    setBigFood(null);
    if (bigFoodTimer) clearTimeout(bigFoodTimer);
    setDirection({ x: 1, y: 0 });
    setNextDirection({ x: 1, y: 0 });
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
    setGameStarted(false);
    setSmallFoodEatenCount(0);
  }, [bigFoodTimer]);

  const checkCollision = useCallback((head, body) => {
    return body.some(segment => segment.x === head.x && segment.y === head.y);
  }, []);

  const handleDirectionChange = (newDirection) => {
    if ((newDirection.x !== -direction.x || newDirection.y !== -direction.y)) {
      setNextDirection(newDirection);
      if (!gameStarted) setGameStarted(true);
    }
  };

  const handleKeyDown = useCallback((e) => {
    let newDirection = null;
    switch (e.key) {
      case 'ArrowUp':
        newDirection = { x: 0, y: -1 };
        break;
      case 'ArrowDown':
        newDirection = { x: 0, y: 1 };
        break;
      case 'ArrowLeft':
        newDirection = { x: -1, y: 0 };
        break;
      case 'ArrowRight':
        newDirection = { x: 1, y: 0 };
        break;
      case ' ':
        setIsPaused(prev => !prev);
        break;
      default:
        break;
    }

    if (newDirection && (newDirection.x !== -direction.x || newDirection.y !== -direction.y)) {
      setNextDirection(newDirection);
      if (!gameStarted) setGameStarted(true);
    }
  }, [direction, gameStarted]);

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e) => {
    if (!gameStarted) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 30) handleDirectionChange({ x: 1, y: 0 });
      else if (deltaX < -30) handleDirectionChange({ x: -1, y: 0 });
    } else {
      if (deltaY > 30) handleDirectionChange({ x: 0, y: 1 });
      else if (deltaY < -30) handleDirectionChange({ x: 0, y: -1 });
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (!gameStarted || gameOver || isPaused) return;

    const gameLoop = setInterval(() => {
      setSnake(prevSnake => {
        setDirection(nextDirection);

        const newHead = {
          x: (prevSnake[0].x + nextDirection.x + GRID_SIZE) % GRID_SIZE,
          y: (prevSnake[0].y + nextDirection.y + GRID_SIZE) % GRID_SIZE,
        };

        const newSnake = [newHead, ...prevSnake];

        if (checkCollision(newHead, prevSnake)) {
          setGameOver(true);
          return prevSnake;
        }

        let ateFood = false;
        let ateBigFood = false;

        if (newHead.x === food.x && newHead.y === food.y) {
          ateFood = true;
          setFood(getRandomPosition());
          setScore(prev => prev + 5);

          setSmallFoodEatenCount(prev => {
            const newCount = prev + 1;
            if (newCount % 5 === 0) {
              const newBigFood = getRandomPosition(pos => pos.x % 4 === 0 && pos.y % 4 === 0);
              setBigFood(newBigFood);

              if (bigFoodTimer) clearTimeout(bigFoodTimer);
              const timer = setTimeout(() => setBigFood(null), 10000);
              setBigFoodTimer(timer);
            }
            return newCount;
          });
        }

        if (bigFood && newHead.x === bigFood.x && newHead.y === bigFood.y) {
          ateBigFood = true;
          setScore(prev => prev + 25);
          setBigFood(null);
          if (bigFoodTimer) clearTimeout(bigFoodTimer);
        }

        if (!ateFood && !ateBigFood) {
          newSnake.pop();
        }

        return newSnake;
      });
    }, GAME_SPEED);

    return () => clearInterval(gameLoop);
  }, [nextDirection, food, bigFood, gameOver, isPaused, checkCollision, gameStarted, bigFoodTimer]);

  return (
    <div className="snake-game-container" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <div className="score-display">Score: {score}</div>
      <div className="game-header">
        <h1>🐍 Snake Game</h1>
      </div>

      {!gameStarted ? (
        <div className="start-screen">
          <button className="restart-btn" onClick={() => setGameStarted(true)}>Play</button>
        </div>
      ) : gameOver ? (
        <div className="game-over-screen">
          <h2>Game Over 😢</h2>
          <p>Final Score: {score}</p>
          <button className="restart-btn" onClick={resetGame}>Play Again</button>
        </div>
      ) : (
        <div className="game-board-container">
          <div
            className="snake-grid"
            style={{ width: GRID_SIZE * CELL_SIZE, height: GRID_SIZE * CELL_SIZE }}
          >
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
                      className={`snake-cell 
                        ${isSnake ? 'snake-body' : ''} 
                        ${isHead ? 'snake-head' : ''} 
                        ${isFood ? 'snake-food' : ''} 
                        ${isBigFood ? 'big-food' : ''}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mobile-controls">
        <button onClick={() => handleDirectionChange({ x: 0, y: -1 })} className="control-btn up">↑</button>
        <div className="horizontal-controls">
          <button onClick={() => handleDirectionChange({ x: -1, y: 0 })} className="control-btn left">←</button>
          <button onClick={() => handleDirectionChange({ x: 0, y: 1 })} className="control-btn down">↓</button>
          <button onClick={() => handleDirectionChange({ x: 1, y: 0 })} className="control-btn right">→</button>
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
