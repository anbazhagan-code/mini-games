import React, { useState, useEffect } from 'react';
import '../assets/Game2048.css';

const SIZE = 4;

const getInitialBoard = () => {
  const board = Array(SIZE)
    .fill(null)
    .map(() => Array(SIZE).fill(0));
  addRandomTile(board);
  addRandomTile(board);
  return board;
};

const addRandomTile = (board) => {
  const emptyPositions = [];
  board.forEach((row, r) => {
    row.forEach((val, c) => {
      if (val === 0) emptyPositions.push([r, c]);
    });
  });
  if (emptyPositions.length === 0) return false;
  const [r, c] = emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
  board[r][c] = Math.random() < 0.9 ? 2 : 4;
  return true;
};

const cloneBoard = (board) => board.map(row => [...row]);

const transpose = (board) => {
  return board[0].map((_, i) => board.map(row => row[i]));
};

const reverseRows = (board) => {
  return board.map(row => [...row].reverse());
};

const combineRow = (row) => {
  let newRow = row.filter(val => val !== 0);
  let scoreGained = 0;
  for (let i = 0; i < newRow.length - 1; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2;
      scoreGained += newRow[i];
      newRow[i + 1] = 0;
    }
  }
  newRow = newRow.filter(val => val !== 0);
  while (newRow.length < SIZE) newRow.push(0);
  return { row: newRow, score: scoreGained };
};

const moveLeft = (board) => {
  let scoreGained = 0;
  const newBoard = board.map(row => {
    const { row: newRow, score } = combineRow(row);
    scoreGained += score;
    return newRow;
  });
  return { board: newBoard, score: scoreGained };
};

const moveRight = (board) => {
  const reversed = reverseRows(board);
  const { board: moved, score } = moveLeft(reversed);
  return { board: reverseRows(moved), score };
};

const moveUp = (board) => {
  const transposed = transpose(board);
  const { board: moved, score } = moveLeft(transposed);
  return { board: transpose(moved), score };
};

const moveDown = (board) => {
  const transposed = transpose(board);
  const { board: moved, score } = moveRight(transposed);
  return { board: transpose(moved), score };
};

const boardsEqual = (b1, b2) => {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (b1[r][c] !== b2[r][c]) return false;
    }
  }
  return true;
};

export default function Game2048() {
  const [board, setBoard] = useState(getInitialBoard());
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('highScore')) || 0;
  });

  const checkGameOver = (board) => {
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (board[r][c] === 0) return false;
        if (c < SIZE - 1 && board[r][c] === board[r][c + 1]) return false;
        if (r < SIZE - 1 && board[r][c] === board[r + 1][c]) return false;
      }
    }
    return true;
  };

  const handleMove = (moveFn) => {
    if (gameOver || won) return;
    const { board: newBoard, score: gained } = moveFn(cloneBoard(board));
    if (!boardsEqual(board, newBoard)) {
      addRandomTile(newBoard);
      const newScore = score + gained;
      setScore(newScore);
      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem('highScore', newScore.toString());
      }
      setBoard(newBoard);

      if (newBoard.some(row => row.includes(2048))) {
        setWon(true);
      } else if (checkGameOver(newBoard)) {
        setGameOver(true);
      }
    }
  };

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowLeft':
        handleMove(moveLeft);
        break;
      case 'ArrowRight':
        handleMove(moveRight);
        break;
      case 'ArrowUp':
        handleMove(moveUp);
        break;
      case 'ArrowDown':
        handleMove(moveDown);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const restartGame = () => {
    setBoard(getInitialBoard());
    setGameOver(false);
    setWon(false);
    setScore(0);
  };

  const getTileClass = (value) => {
    return `tile tile-${value}`;
  };

  return (
    <div className="game-2048">
      <h2 className="game-2048__title">2048 Game</h2>
      <div className="game-2048__scoreboard">
        <div className="score-box">Score: {score}</div>
        <div className="score-box">High Score: {highScore}</div>
      </div>
      <div className="game-2048__board">
        {board.map((row, r) => (
          <div className="game-2048__row" key={r}>
            {row.map((value, c) => (
              <div className={getTileClass(value)} key={c}>
                {value !== 0 ? value : ''}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="game-2048__controls">
        <button onClick={() => handleMove(moveUp)} className="control-btn">↑</button>
        <div style={{ display: 'flex', gap: '5rem' }}>
          <button onClick={() => handleMove(moveLeft)} className="control-btn">←</button>
          <button onClick={() => handleMove(moveRight)} className="control-btn">→</button>
        </div>
        <button onClick={() => handleMove(moveDown)} className="control-btn">↓</button>
      </div>
      {(gameOver || won) && (
        <div className="game-2048__overlay">
          <div className="game-2048__message">
            {won ? '🎉 You Win! 🎉' : 'Game Over 😞'}
            <button className="game-2048__restart-btn" onClick={restartGame}>Restart</button>
          </div>
        </div>
      )}
    </div>
  );
}
