import React, { useState, useEffect } from 'react';
import { FaRedo, FaFlag, FaBomb } from 'react-icons/fa';
import '../assets/Minesweeper.css';

function Minesweeper() {
  const [gridSize, setGridSize] = useState(10);
  const [mineCount, setMineCount] = useState(15);
  const [grid, setGrid] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [revealedCount, setRevealedCount] = useState(0);
  const [firstClick, setFirstClick] = useState(true);

  useEffect(() => {
    initializeGame();
  }, [gridSize, mineCount]);

  const initializeGame = () => {
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
    setRevealedCount(0);
    setFirstClick(true);
  };

  const placeMines = (clickRow, clickCol) => {
    const newGrid = JSON.parse(JSON.stringify(grid));
    let minesPlaced = 0;

    while (minesPlaced < mineCount) {
      const row = Math.floor(Math.random() * gridSize);
      const col = Math.floor(Math.random() * gridSize);

      const isSafeZone = 
        Math.abs(row - clickRow) <= 1 && 
        Math.abs(col - clickCol) <= 1;

      if (!newGrid[row][col].isMine && !isSafeZone) {
        newGrid[row][col].isMine = true;
        minesPlaced++;
      }
    }

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

    setGrid(newGrid);
  };

  const handleCellClick = (row, col) => {
    if (gameOver || gameWon || grid[row][col].isRevealed || grid[row][col].isFlagged) {
      return;
    }

    if (firstClick) {
      placeMines(row, col);
      setFirstClick(false);
    }

    const newGrid = [...grid];
    
    if (newGrid[row][col].isMine) {
      revealAllMines(newGrid);
      setGameOver(true);
      return;
    }

    revealCells(newGrid, row, col);
  };

  const revealAllMines = (grid) => {
    const newGrid = [...grid];
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (newGrid[r][c].isMine) {
          newGrid[r][c].isRevealed = true;
        }
      }
    }
    setGrid(newGrid);
  };

  const revealCells = (grid, row, col) => {
    const newGrid = [...grid];
    const cellsToReveal = [[row, col]];
    let revealed = 0;

    while (cellsToReveal.length > 0) {
      const [r, c] = cellsToReveal.pop();
      
      if (r < 0 || r >= gridSize || c < 0 || c >= gridSize || 
          newGrid[r][c].isRevealed || newGrid[r][c].isFlagged) {
        continue;
      }

      newGrid[r][c].isRevealed = true;
      revealed++;

      if (newGrid[r][c].neighborMines === 0) {
        for (let nr = r - 1; nr <= r + 1; nr++) {
          for (let nc = c - 1; nc <= c + 1; nc++) {
            if (nr >= 0 && nr < gridSize && nc >= 0 && nc < gridSize) {
              cellsToReveal.push([nr, nc]);
            }
          }
        }
      }
    }

    setGrid(newGrid);
    setRevealedCount(prev => prev + revealed);

    if (revealedCount + revealed === gridSize * gridSize - mineCount) {
      setGameWon(true);
    }
  };

  const handleRightClick = (row, col, e) => {
    e.preventDefault();
    if (gameOver || gameWon || grid[row][col].isRevealed) return;

    const newGrid = [...grid];
    newGrid[row][col].isFlagged = !newGrid[row][col].isFlagged;
    setGrid(newGrid);
  };

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

  return (
    <div className="game-container">
      <h2 className="game-title">Minesweeper</h2>
      
      <div className="game-controls">
        <div className="difficulty-selector">
          <button 
            className={`difficulty-btn ${gridSize === 8 ? 'active' : ''}`}
            onClick={() => { setGridSize(8); setMineCount(10); }}
          >
            Easy
          </button>
          <button 
            className={`difficulty-btn ${gridSize === 10 ? 'active' : ''}`}
            onClick={() => { setGridSize(10); setMineCount(15); }}
          >
            Medium
          </button>
          <button 
            className={`difficulty-btn ${gridSize === 12 ? 'active' : ''}`}
            onClick={() => { setGridSize(12); setMineCount(24); }}
          >
            Hard
          </button>
        </div>
        
        <button className="reset-btn" onClick={initializeGame}>
          <FaRedo /> New Game
        </button>
      </div>

      <div className="game-info">
        <div className="mines-remaining">
          <FaFlag /> {mineCount - grid.flat().filter(cell => cell.isFlagged).length}
        </div>
        <div className={`game-status ${gameOver ? 'game-over' : ''} ${gameWon ? 'game-won' : ''}`}>
          {gameOver ? 'Game Over!' : gameWon ? 'You Win!' : ' '}
        </div>
      </div>

      <div className="game-board" style={{ '--grid-size': gridSize }}>
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="board-row">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={`board-cell ${cell.isRevealed ? 'revealed' : ''} ${gameOver && cell.isMine ? 'mine' : ''}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                onContextMenu={(e) => handleRightClick(rowIndex, colIndex, e)}
              >
                {cell.isRevealed ? (
                  cell.isMine ? (
                    <FaBomb className="mine-icon" />
                  ) : (
                    <span style={{ color: getNumberColor(cell.neighborMines) }}>
                      {cell.neighborMines > 0 ? cell.neighborMines : ''}
                    </span>
                  )
                ) : cell.isFlagged ? (
                  <FaFlag className="flag-icon" />
                ) : null}
              </div>
            ))}
          </div>
        ))}
      </div>

      {(gameOver || gameWon) && (
        <div className="game-result-overlay">
          <div className="game-result">
            <h3>{gameWon ? '🎉 You Won! 🎉' : '💥 Game Over! 💥'}</h3>
            <p>Final Score: {revealedCount} cells cleared</p>
            <button onClick={initializeGame}>Play Again</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Minesweeper;