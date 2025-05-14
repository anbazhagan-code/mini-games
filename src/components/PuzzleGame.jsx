// PuzzleGame.js
import React, { useState, useEffect } from 'react';
import '../assets/PuzzleGame.css';

function PuzzleGame() {
  const [tiles, setTiles] = useState(generateShuffledTiles());
  const [moveCount, setMoveCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (checkWin(tiles)) {
      setIsComplete(true);
    }
  }, [tiles]);

  function handleTileClick(index) {
    if (isComplete) return;
    const emptyIndex = tiles.indexOf(null);
    if (isMovable(index, emptyIndex)) {
      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
      setTiles(newTiles);
      setMoveCount(prev => prev + 1);
    }
  }

  function isMovable(index, emptyIndex) {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const emptyRow = Math.floor(emptyIndex / 4);
    const emptyCol = emptyIndex % 4;
    return (
      (row === emptyRow && Math.abs(col - emptyCol) === 1) ||
      (col === emptyCol && Math.abs(row - emptyRow) === 1)
    );
  }

  function generateShuffledTiles() {
    let arr;
    do {
      arr = [...Array(15).keys()].map(n => n + 1).concat(null);
      arr.sort(() => Math.random() - 0.5);
    } while (!isSolvable(arr));
    return arr;
  }

  function isSolvable(arr) {
    const invCount = arr.reduce((count, val, i) => {
      if (val === null) return count;
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[j] !== null && val > arr[j]) count++;
      }
      return count;
    }, 0);
    const emptyRow = 4 - Math.floor(arr.indexOf(null) / 4);
    return (emptyRow % 2 === 0) ? (invCount % 2 === 1) : (invCount % 2 === 0);
  }

  function checkWin(arr) {
    for (let i = 0; i < 15; i++) {
      if (arr[i] !== i + 1) return false;
    }
    return arr[15] === null;
  }

  function resetGame() {
    setTiles(generateShuffledTiles());
    setMoveCount(0);
    setIsComplete(false);
  }

  return (
    <div className="puzzle-container">
      <h2>15 Number Puzzle</h2>
      <div className="controls">
        <span>Moves: {moveCount}</span>
        <button onClick={resetGame}>Restart</button>
      </div>
      <div className="grid">
        {tiles.map((tile, index) => (
          <div
            key={index}
            className={`tile ${tile === null ? 'empty' : ''}`}
            onClick={() => handleTileClick(index)}
          >
            {tile}
          </div>
        ))}
      </div>
      {isComplete && <div className="win-message">🎉 You solved the puzzle in {moveCount} moves!</div>}
    </div>
  );
}

export default PuzzleGame;
