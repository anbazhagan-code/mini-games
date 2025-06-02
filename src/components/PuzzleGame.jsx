import React, { useState, useEffect, useRef } from 'react';
import '../assets/PuzzleGame.css';

function PuzzleGame() {
  const [size, setSize] = useState(4); // Default 4x4
  const [tiles, setTiles] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  // Initialize on size change
  useEffect(() => {
    resetGame(size);
  }, [size]);

  // Timer logic
  useEffect(() => {
    if (isRunning && !isComplete) {
      timerRef.current = setInterval(() => setTime(t => t + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, isComplete]);

  useEffect(() => {
    if (checkWin(tiles)) {
      setIsComplete(true);
      setIsRunning(false);
    }
  }, [tiles]);

  function handleTileClick(index) {
    if (isComplete) return;

    const emptyIndex = tiles.indexOf(null);
    if (isMovable(index, emptyIndex)) {
      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
      setTiles(newTiles);
      if (!isRunning) setIsRunning(true); // Start timer on first move
    }
  }

  function isMovable(index, emptyIndex) {
    const row = Math.floor(index / size);
    const col = index % size;
    const emptyRow = Math.floor(emptyIndex / size);
    const emptyCol = emptyIndex % size;
    return (
      (row === emptyRow && Math.abs(col - emptyCol) === 1) ||
      (col === emptyCol && Math.abs(row - emptyRow) === 1)
    );
  }

  function generateShuffledTiles(size) {
    let arr;
    do {
      arr = [...Array(size * size - 1).keys()].map(n => n + 1).concat(null);
      arr.sort(() => Math.random() - 0.5);
    } while (!isSolvable(arr, size));
    return arr;
  }

  function isSolvable(arr, size) {
    const invCount = arr.reduce((count, val, i) => {
      if (val === null) return count;
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[j] !== null && val > arr[j]) count++;
      }
      return count;
    }, 0);
    const emptyRow = size - Math.floor(arr.indexOf(null) / size);
    return (size % 2 === 1)
      ? invCount % 2 === 0
      : (emptyRow % 2 === 0) ? invCount % 2 === 1 : invCount % 2 === 0;
  }

  function checkWin(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] !== i + 1) return false;
    }
    return arr[arr.length - 1] === null;
  }

  function resetGame(newSize = size) {
    setTiles(generateShuffledTiles(newSize));
    setIsComplete(false);
    setTime(0);
    setIsRunning(false);
  }

  const formatTime = (sec) => {
    const m = String(Math.floor(sec / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="puzzle-container">
      <h2>{size * size - 1} Number Puzzle</h2>
      
      <div className="controls">
        <label>
          Size: 
          <select value={size} onChange={e => setSize(Number(e.target.value))}>
            <option value={3}>3x3</option>
            <option value={4}>4x4</option>
            <option value={5}>5x5</option>
          </select>
        </label>
        <span>⏱ Time: {formatTime(time)}</span>
        <button onClick={() => resetGame()}>Restart</button>
      </div>

      <div
        className="grid"
        style={{
          '--size': size,
          gridTemplateColumns: `repeat(${size}, minmax(50px, 80px))`,
          gridTemplateRows: `repeat(${size}, minmax(50px, 80px))`
        }}
      >
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

      {isComplete && (
        <div className="win-message">
          🎉 Puzzle solved in {formatTime(time)}!
        </div>
      )}
    </div>
  );
}

export default PuzzleGame;
