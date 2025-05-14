import React, { useState, useEffect } from 'react';
import { FaTimes, FaCircle, FaRedo, FaRobot, FaUser } from 'react-icons/fa';
import '../assets/TicTacToe.css';

function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameMode, setGameMode] = useState('computer'); // Default is 'computer'
  const [difficulty, setDifficulty] = useState('medium'); // 'easy', 'medium', 'hard'

  const winner = calculateWinner(board);
  const isDraw = !winner && board.every(square => square !== null);
  const status = winner 
    ? `Winner: ${winner.player}` 
    : isDraw 
      ? "Game ended in a draw!" 
      : `Next player: ${isPlayerTurn ? 'You (X)' : gameMode === 'computer' ? 'Computer (O)' : 'Player 2 (O)'}`;

  // Computer makes a move when it's their turn
  useEffect(() => {
    if (gameMode === 'computer' && !isPlayerTurn && !winner && !isDraw) {
      const timer = setTimeout(() => {
        makeComputerMove();
      }, 500); // Small delay for better UX
        
      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, board, gameMode]);

  const handleClick = (index) => {
    if (board[index] || winner || (gameMode === 'computer' && !isPlayerTurn)) return;
    
    const newBoard = [...board];
    newBoard[index] = isPlayerTurn ? 'X' : 'O';
    setBoard(newBoard);
    setIsPlayerTurn(!isPlayerTurn);
  };

  const makeComputerMove = () => {
    let index;
    switch(difficulty) {
      case 'easy':
        index = getRandomMove();
        break;
      case 'medium':
        index = Math.random() > 0.5 ? getRandomMove() : getBestMove();
        break;
      case 'hard':
      default:
        index = getBestMove();
    }
    
    if (index !== null) {
      const newBoard = [...board];
      newBoard[index] = 'O';
      setBoard(newBoard);
      setIsPlayerTurn(true);
    }
  };

  const getRandomMove = () => {
    const emptySquares = board
      .map((square, index) => (square === null ? index : null))
      .filter(val => val !== null);
    
    if (emptySquares.length === 0) return null;
    return emptySquares[Math.floor(Math.random() * emptySquares.length)];
  };

  const getBestMove = () => {
    // Simple AI using minimax algorithm
    let bestScore = -Infinity;
    let bestMove = null;
    
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = 'O';
        const score = minimax(board, 0, false);
        board[i] = null;
        
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }
    
    return bestMove;
  };

  const minimax = (board, depth, isMaximizing) => {
    const result = calculateWinner(board);
    if (result) {
      return result.player === 'O' ? 10 - depth : depth - 10;
    }
    
    if (board.every(square => square !== null)) return 0;
    
    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
          board[i] = 'O';
          const score = minimax(board, depth + 1, false);
          board[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
          board[i] = 'X';
          const score = minimax(board, depth + 1, true);
          board[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
  };

  const changeGameMode = (mode) => {
    setGameMode(mode);
    resetGame();
  };

  const changeDifficulty = (level) => {
    setDifficulty(level);
    resetGame();
  };

  const renderSquare = (index) => {
    const isWinningSquare = winner?.winningSquares.includes(index);
    return (
      <button 
        className={`square ${isWinningSquare ? 'winning' : ''}`}
        onClick={() => handleClick(index)}
        disabled={gameMode === 'computer' && !isPlayerTurn}
        aria-label={`Square ${index + 1} ${board[index] ? `marked ${board[index]}` : 'empty'}`}
      >
        {board[index] === 'X' ? (
          <FaTimes className="x-icon" />
        ) : board[index] === 'O' ? (
          <FaCircle className="o-icon" />
        ) : null}
      </button>
    );
  };

  return (
    <div className="tic-tac-toe-container">
      <h2 className="game-title">Tic Tac Toe</h2>
      
      <div className="game-controls">
        <div className="mode-selector">
          <button 
            className={`mode-btn ${gameMode === 'computer' ? 'active' : ''}`}
            onClick={() => changeGameMode('computer')}
          >
            <FaRobot /> Player vs Computer
          </button>
          <button 
            className={`mode-btn ${gameMode === 'human' ? 'active' : ''}`}
            onClick={() => changeGameMode('human')}
          >
            <FaUser /> Player vs Player
          </button>

        </div>
        
        {gameMode === 'computer' && (
          <div className="difficulty-selector">
            <button 
              className={`difficulty-btn ${difficulty === 'easy' ? 'active' : ''}`}
              onClick={() => changeDifficulty('easy')}
            >
              Easy
            </button>
            <button 
              className={`difficulty-btn ${difficulty === 'medium' ? 'active' : ''}`}
              onClick={() => changeDifficulty('medium')}
            >
              Medium
            </button>
            <button 
              className={`difficulty-btn ${difficulty === 'hard' ? 'active' : ''}`}
              onClick={() => changeDifficulty('hard')}
            >
              Hard
            </button>
          </div>
        )}
      </div>
      
      <p className={`game-status ${winner ? 'winner' : ''} ${isDraw ? 'draw' : ''}`}>
        {status}
      </p>
      
      <div className="board">
        {Array(9).fill(null).map((_, index) => (
          <React.Fragment key={index}>
            {renderSquare(index)}
          </React.Fragment>
        ))}
      </div>
      
      <button 
        className="reset-btn"
        onClick={resetGame}
        aria-label="Reset game"
      >
        <FaRedo className="reset-icon" /> New Game
      </button>
    </div>
  );

  function calculateWinner(board) {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    for (const line of lines) {
      const [a, b, c] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return {
          player: board[a],
          winningSquares: line
        };
      }
    }
    return null;
  }
}

export default TicTacToe;
