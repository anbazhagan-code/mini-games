import React, { useState, useEffect, useCallback } from 'react';
import { FaRedo, FaFlag, FaBomb } from 'react-icons/fa';
import '../assets/Minesweeper.css';

const Minesweeper = () => {
  const [difficulty, setDifficulty] = useState('medium');
  const [gridSize, setGridSize] = useState(10);
  const [mineCount, setMineCount] = useState(15);
  const [grid, setGrid] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [firstClick, setFirstClick] = useState(true);

  // Initialize empty grid
  const initializeGame = useCallback(() => {
    const newGrid = Array(gridSize).fill().map(() => 
      Array(gridSize).fill().map(() => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0,
      }))
    );
    setGrid(newGrid);
    setGameOver(false);
    setGameWon(false);
    setFirstClick(true);
  }, [gridSize]);

  // Set difficulty settings
  useEffect(() => {
    switch (difficulty) {
      case 'easy':
        setGridSize(8);
        setMineCount(10);
        break;
      case 'hard':
        setGridSize(12);
        setMineCount(24);
        break;
      default: // medium
        setGridSize(10);
        setMineCount(15);
    }
  }, [difficulty]);

  // Initialize game when settings change
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Place mines after first click
  const placeMines = useCallback((safeRow, safeCol) => {
    setGrid(prevGrid => {
      const newGrid = JSON.parse(JSON.stringify(prevGrid));
      let minesPlaced = 0;

      while (minesPlaced < mineCount) {
        const row = Math.floor(Math.random() * gridSize);
        const col = Math.floor(Math.random() * gridSize);

        // Ensure first click and surrounding cells are safe
        const isSafeZone = 
          Math.abs(row - safeRow) <= 1 && 
          Math.abs(col - safeCol) <= 1;

        if (!newGrid[row][col].isMine && !isSafeZone) {
          newGrid[row][col].isMine = true;
          minesPlaced++;
        }
      }

      // Calculate adjacent mines for each cell
      for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
          if (!newGrid[row][col].isMine) {
            let count = 0;
            for (let r = Math.max(0, row - 1); r <= Math.min(gridSize - 1, row + 1); r++) {
              for (let c = Math.max(0, col - 1); c <= Math.min(gridSize - 1, col + 1); c++) {
                if (newGrid[r][c].isMine) count++;
              }
            }
            newGrid[row][col].neighborMines = count;
          }
        }
      }

      return newGrid;
    });
    setFirstClick(false);
  }, [gridSize, mineCount]);

  // Reveal all mines when game is lost
  const revealAllMines = useCallback(() => {
    setGrid(prevGrid => 
      prevGrid.map(row => 
        row.map(cell => ({
          ...cell,
          isRevealed: cell.isMine ? true : cell.isRevealed
        }))
      )
    );
  }, []);

  // Reveal cells recursively
  const revealCells = useCallback((row, col) => {
    setGrid(prevGrid => {
      const newGrid = JSON.parse(JSON.stringify(prevGrid));
      const cellsToReveal = [[row, col]];
      let revealedCells = 0;

      while (cellsToReveal.length > 0) {
        const [r, c] = cellsToReveal.pop();
        
        if (r < 0 || r >= gridSize || c < 0 || c >= gridSize || 
            newGrid[r][c].isRevealed || newGrid[r][c].isFlagged) {
          continue;
        }

        newGrid[r][c].isRevealed = true;
        revealedCells++;

        if (newGrid[r][c].neighborMines === 0) {
          // Reveal all adjacent cells if this is an empty cell
          for (let nr = r - 1; nr <= r + 1; nr++) {
            for (let nc = c - 1; nc <= c + 1; nc++) {
              if (nr >= 0 && nr < gridSize && nc >= 0 && nc < gridSize) {
                cellsToReveal.push([nr, nc]);
              }
            }
          }
        }
      }

      // Check win condition
      const totalRevealed = newGrid.flat().filter(cell => cell.isRevealed).length;
      if (totalRevealed === gridSize * gridSize - mineCount) {
        setGameWon(true);
      }

      return newGrid;
    });
  }, [gridSize, mineCount]);

  // Handle cell click
  const handleCellClick = (row, col) => {
    if (gameOver || gameWon || grid[row][col].isFlagged) return;

    if (firstClick) {
      placeMines(row, col);
    }

    if (grid[row][col].isMine) {
      revealAllMines();
      setGameOver(true);
      return;
    }

    revealCells(row, col);
  };

  // Handle right click (flag)
  const handleRightClick = (e, row, col) => {
    e.preventDefault();
    if (gameOver || gameWon || grid[row][col].isRevealed) return;

    setGrid(prevGrid => {
      const newGrid = [...prevGrid];
      newGrid[row][col].isFlagged = !newGrid[row][col].isFlagged;
      return newGrid;
    });
  };

  // Get color for numbers
  const getNumberColor = (count) => {
    const colors = [
      'transparent',
      '#1976D2', // blue
      '#388E3C', // green
      '#D32F2F', // red
      '#7B1FA2', // purple
      '#F57C00', // orange
      '#0097A7', // teal
      '#5D4037', // brown
      '#000000', // black
    ];
    return colors[count];
  };

  // Calculate remaining mines
  const remainingMines = mineCount - grid.flat().filter(cell => cell.isFlagged).length;

  return (
    <div className="minesweeper">
      <h1>Minesweeper</h1>
      
      <div className="controls">
        <div className="difficulty">
          <button 
            className={difficulty === 'easy' ? 'active' : ''}
            onClick={() => setDifficulty('easy')}
          >
            Easy
          </button>
          <button 
            className={difficulty === 'medium' ? 'active' : ''}
            onClick={() => setDifficulty('medium')}
          >
            Medium
          </button>
          <button 
            className={difficulty === 'hard' ? 'active' : ''}
            onClick={() => setDifficulty('hard')}
          >
            Hard
          </button>
        </div>
        
        <button className="reset" onClick={initializeGame}>
          <FaRedo /> New Game
        </button>
      </div>

      <div className="game-info">
        <div className="mines-count">
          <FaBomb /> {remainingMines}
        </div>
        <div className={`status ${gameOver ? 'lost' : ''} ${gameWon ? 'won' : ''}`}>
          {gameOver ? 'Game Over!' : gameWon ? 'You Win!' : ' '}
        </div>
      </div>

      <div className="board" style={{ '--size': gridSize }}>
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={`cell ${cell.isRevealed ? 'revealed' : ''} ${gameOver && cell.isMine ? 'mine' : ''}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                onContextMenu={(e) => handleRightClick(e, rowIndex, colIndex)}
              >
                {cell.isRevealed ? (
                  cell.isMine ? (
                    <FaBomb className="bomb" />
                  ) : (
                    <span style={{ color: getNumberColor(cell.neighborMines) }}>
                      {cell.neighborMines > 0 ? cell.neighborMines : ''}
                    </span>
                  )
                ) : cell.isFlagged ? (
                  <FaFlag className="flag" />
                ) : null}
              </div>
            ))}
          </div>
        ))}
      </div>

      {(gameOver || gameWon) && (
        <div className="game-overlay">
          <div className="message">
            <h2>{gameWon ? '🎉 You Won! 🎉' : '💥 Game Over! 💥'}</h2>
            <button onClick={initializeGame}>Play Again</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Minesweeper;