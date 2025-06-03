import React, { useState, useEffect, useRef } from 'react';
import '../assets/BubbleShooter.css';

const COLORS = ['#FF5252', '#4CAF50', '#2196F3', '#FFEB3B', '#9C27B0', '#FF9800'];
const BUBBLE_RADIUS = 20;
const GRID_ROW_HEIGHT = BUBBLE_RADIUS * Math.sqrt(3);
const GRID_COL_WIDTH = BUBBLE_RADIUS * 2;
const CONTAINER_WIDTH = GRID_COL_WIDTH * 10;
const CONTAINER_HEIGHT = GRID_ROW_HEIGHT * 14;
const SHOOTER_WIDTH = 60;

const BubbleShooter = () => {
  const [grid, setGrid] = useState([]);
  const [shooterColor, setShooterColor] = useState(getRandomColor());
  const [shooterAngle, setShooterAngle] = useState(90);
  const [shootingBubble, setShootingBubble] = useState(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const containerRef = useRef(null);

  // Initialize the game
  useEffect(() => {
    initializeGrid();
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleShoot);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleShoot);
    };
  }, []);

  function getRandomColor() {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
  }

  function initializeGrid() {
    const newGrid = Array(12).fill().map(() => Array(10).fill(null));
    
    // Fill the top 4 rows with random bubbles
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 10; col++) {
        // Offset every other row
        if (row % 2 === 1 && col === 9) continue; // Skip last column in odd rows
        newGrid[row][col] = {
          row,
          col,
          color: getRandomColor(),
          x: col * GRID_COL_WIDTH + (row % 2 ? GRID_COL_WIDTH / 2 : 0),
          y: row * GRID_ROW_HEIGHT + BUBBLE_RADIUS,
        };
      }
    }
    setGrid(newGrid);
  }

  function handleMouseMove(e) {
    if (!containerRef.current || gameOver || gameWon) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const centerX = containerRect.left + containerRect.width / 2;
    const centerY = containerRect.bottom - SHOOTER_WIDTH / 2;
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    // Calculate angle between shooter and mouse position
    const angle = Math.atan2(centerX - mouseX, centerY - mouseY) * (180 / Math.PI);
    setShooterAngle(Math.max(10, Math.min(170, angle)));
  }

  function handleShoot() {
    if (shootingBubble || gameOver || gameWon) return;
    
    const newBubble = {
      id: Date.now(),
      color: shooterColor,
      x: CONTAINER_WIDTH / 2 - BUBBLE_RADIUS,
      y: CONTAINER_HEIGHT - SHOOTER_WIDTH,
      angle: shooterAngle,
      speed: 8,
    };
    
    setShootingBubble(newBubble);
    setShooterColor(getRandomColor());
  }

  useEffect(() => {
    if (!shootingBubble) return;

    const moveInterval = setInterval(() => {
      setShootingBubble(prev => {
        if (!prev) return null;
        
        // Calculate new position based on angle
        const angleRad = (prev.angle * Math.PI) / 180;
        const newX = prev.x - Math.sin(angleRad) * prev.speed;
        const newY = prev.y - Math.cos(angleRad) * prev.speed;

        // Check for wall collisions
        if (newX < BUBBLE_RADIUS || newX > CONTAINER_WIDTH - BUBBLE_RADIUS) {
          return {
            ...prev,
            angle: 180 - prev.angle, // bounce off wall
          };
        }

        // Check for ceiling collision
        if (newY < BUBBLE_RADIUS) {
          return {
            ...prev,
            angle: 360 - prev.angle, // bounce off ceiling
          };
        }

        // Check for bubble collisions
        const collision = checkCollision(newX, newY, prev.color);
        if (collision) {
          const { newGrid, poppedCount } = collision;
          setGrid(newGrid);
          setScore(s => s + poppedCount * 10);
          
          // Check if all bubbles are cleared
          if (isGridCleared(newGrid)) {
            setGameWon(true);
          }
          
          return null;
        }

        // Check if bubble went below the shooter (game over)
        if (newY > CONTAINER_HEIGHT + BUBBLE_RADIUS) {
          setGameOver(true);
          return null;
        }

        return {
          ...prev,
          x: newX,
          y: newY,
        };
      });
    }, 30);

    return () => clearInterval(moveInterval);
  }, [shootingBubble]);

  function isGridCleared(grid) {
    return grid.every(row => row.every(cell => cell === null));
  }

  function checkCollision(x, y, color) {
    // Find the closest grid position
    const row = Math.round((y - BUBBLE_RADIUS) / GRID_ROW_HEIGHT);
    let col = Math.round((x - (row % 2 ? GRID_COL_WIDTH / 2 : 0)) / GRID_COL_WIDTH);
    
    // Ensure col is within bounds
    col = Math.max(0, Math.min(9, col));
    // Adjust for odd rows
    if (row % 2 === 1 && col === 9) col = 8;

    // Check if position is valid and empty
    if (row >= 0 && row < 12 && !grid[row][col]) {
      const newGrid = JSON.parse(JSON.stringify(grid));
      newGrid[row][col] = { row, col, color, x, y: row * GRID_ROW_HEIGHT + BUBBLE_RADIUS };
      
      // Check for matches
      const matches = findMatches(newGrid, row, col, color);
      if (matches.length >= 3) {
        // Remove matched bubbles
        matches.forEach(([r, c]) => {
          newGrid[r][c] = null;
        });
        
        // Check for floating bubbles
        const floating = findFloatingBubbles(newGrid);
        floating.forEach(([r, c]) => {
          newGrid[r][c] = null;
        });

        return {
          newGrid,
          poppedCount: matches.length + floating.length,
        };
      }

      return { newGrid, poppedCount: 0 };
    }

    // Check for direct collision with existing bubbles
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[r].length; c++) {
        const bubble = grid[r][c];
        if (bubble) {
          const dx = bubble.x - x;
          const dy = bubble.y - y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < BUBBLE_RADIUS * 1.8) {
            // Find the adjacent empty position
            const adjacent = findAdjacentPosition(bubble.row, bubble.col);
            if (adjacent) {
              const [adjRow, adjCol] = adjacent;
              const newGrid = JSON.parse(JSON.stringify(grid));
              newGrid[adjRow][adjCol] = { 
                row: adjRow, 
                col: adjCol, 
                color, 
                x: adjCol * GRID_COL_WIDTH + (adjRow % 2 ? GRID_COL_WIDTH / 2 : 0),
                y: adjRow * GRID_ROW_HEIGHT + BUBBLE_RADIUS
              };
              
              // Check for matches
              const matches = findMatches(newGrid, adjRow, adjCol, color);
              if (matches.length >= 3) {
                matches.forEach(([r, c]) => {
                  newGrid[r][c] = null;
                });
                
                const floating = findFloatingBubbles(newGrid);
                floating.forEach(([r, c]) => {
                  newGrid[r][c] = null;
                });

                return {
                  newGrid,
                  poppedCount: matches.length + floating.length,
                };
              }

              return { newGrid, poppedCount: 0 };
            }
          }
        }
      }
    }

    return null;
  }

  function findAdjacentPosition(row, col) {
    // Check all 6 possible adjacent positions in hexagonal grid
    const directions = [
      [0, -1], [0, 1],   // left, right
      [-1, 0], [1, 0],   // top, bottom
      row % 2 ? 
        [[-1, -1], [1, -1]] : // top-left, bottom-left for odd rows
        [[-1, 1], [1, 1]]     // top-right, bottom-right for even rows
    ].flat();

    for (const [dr, dc] of directions) {
      const newRow = row + dr;
      let newCol = col + dc;
      
      // Adjust for grid boundaries
      if (newRow < 0 || newRow >= 12) continue;
      if (newCol < 0 || newCol >= 10) continue;
      // Adjust for odd rows
      if (newRow % 2 === 1 && newCol === 9) continue;
      
      if (!grid[newRow][newCol]) {
        return [newRow, newCol];
      }
    }
    
    return null;
  }

  function findMatches(grid, row, col, color) {
    const visited = new Set();
    const matches = [];
    
    function check(r, c) {
      if (r < 0 || r >= 12 || c < 0 || c >= 10) return;
      if (visited.has(`${r},${c}`)) return;
      if (!grid[r][c] || grid[r][c].color !== color) return;
      
      visited.add(`${r},${c}`);
      matches.push([r, c]);
      
      // Check all 6 directions
      check(r, c - 1); // left
      check(r, c + 1); // right
      check(r - 1, c); // top
      check(r + 1, c); // bottom
      if (r % 2 === 1) {
        check(r - 1, c - 1); // top-left for odd rows
        check(r + 1, c - 1); // bottom-left for odd rows
      } else {
        check(r - 1, c + 1); // top-right for even rows
        check(r + 1, c + 1); // bottom-right for even rows
      }
    }
    
    check(row, col);
    return matches;
  }

  function findFloatingBubbles(grid) {
    const visited = new Set();
    const floating = [];
    
    // Mark all bubbles connected to the ceiling
    for (let c = 0; c < 10; c++) {
      if (grid[0][c]) {
        markConnected(grid, 0, c, visited);
      }
    }
    
    // Any unvisited bubbles are floating
    for (let r = 0; r < 12; r++) {
      for (let c = 0; c < 10; c++) {
        if (grid[r][c] && !visited.has(`${r},${c}`)) {
          floating.push([r, c]);
        }
      }
    }
    
    return floating;
  }

  function markConnected(grid, row, col, visited) {
    if (row < 0 || row >= 12 || col < 0 || col >= 10) return;
    if (!grid[row][col]) return;
    if (visited.has(`${row},${col}`)) return;
    
    visited.add(`${row},${col}`);
    
    // Check all 6 directions
    markConnected(grid, row, col - 1, visited); // left
    markConnected(grid, row, col + 1, visited); // right
    markConnected(grid, row - 1, col, visited); // top
    markConnected(grid, row + 1, col, visited); // bottom
    if (row % 2 === 1) {
      markConnected(grid, row - 1, col - 1, visited); // top-left for odd rows
      markConnected(grid, row + 1, col - 1, visited); // bottom-left for odd rows
    } else {
      markConnected(grid, row - 1, col + 1, visited); // top-right for even rows
      markConnected(grid, row + 1, col + 1, visited); // bottom-right for even rows
    }
  }

  function restartGame() {
    setGrid([]);
    setShootingBubble(null);
    setScore(0);
    setGameOver(false);
    setGameWon(false);
    initializeGrid();
    setShooterColor(getRandomColor());
  }

  return (
    <div className="game-container">
      <h2>Bubble Shooter - Score: {score}</h2>
      <div 
        ref={containerRef} 
        className="bubble-container"
        style={{ 
          width: CONTAINER_WIDTH,
          height: CONTAINER_HEIGHT
        }}
      >
        {grid.map((row, rowIndex) =>
          row.map((bubble, colIndex) =>
            bubble && (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="bubble"
                style={{
                  left: bubble.x - BUBBLE_RADIUS,
                  top: bubble.y - BUBBLE_RADIUS,
                  backgroundColor: bubble.color,
                  width: BUBBLE_RADIUS * 2,
                  height: BUBBLE_RADIUS * 2,
                }}
              />
            )
          )
        )}
        
        {shootingBubble && (
          <div
            className="bubble shooting"
            style={{
              left: shootingBubble.x - BUBBLE_RADIUS,
              top: shootingBubble.y - BUBBLE_RADIUS,
              backgroundColor: shootingBubble.color,
              width: BUBBLE_RADIUS * 2,
              height: BUBBLE_RADIUS * 2,
            }}
          />
        )}
        
        <div
          className="shooter"
          style={{
            left: CONTAINER_WIDTH / 2 - SHOOTER_WIDTH / 2,
            top: CONTAINER_HEIGHT - SHOOTER_WIDTH / 2,
            width: SHOOTER_WIDTH,
            height: SHOOTER_WIDTH,
            backgroundColor: shooterColor,
            transform: `rotate(${shooterAngle - 90}deg)`,
          }}
        >
          <div className="shooter-arrow" />
        </div>
        
        {gameOver && (
          <div className="game-overlay">
            <div className="game-message">
              <h3>Game Over!</h3>
              <p>Final Score: {score}</p>
              <button onClick={restartGame}>Play Again</button>
            </div>
          </div>
        )}
        
        {gameWon && (
          <div className="game-overlay">
            <div className="game-message">
              <h3>You Win!</h3>
              <p>Final Score: {score}</p>
              <button onClick={restartGame}>Play Again</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BubbleShooter;