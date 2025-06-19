import React, { useState, useEffect, useRef } from 'react';
import '../assets/FlappyBird.css';
import birdImg from '../assets/bird.png';

const GRAVITY = 0.5;
const JUMP_STRENGTH = -7;
const PIPE_GAP = 180;
const PIPE_WIDTH = 60;
const BIRD_SIZE = 40;
const GAME_HEIGHT = 500;
const GAME_WIDTH = 400;

const FlappyBird = () => {
  const [birdY, setBirdY] = useState(GAME_HEIGHT / 2);
  const [velocity, setVelocity] = useState(0);
  const [pipes, setPipes] = useState([]);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const gameRef = useRef();
  const gameInterval = useRef();

  const jump = () => {
    if (!isGameOver) setVelocity(JUMP_STRENGTH);
  };

  const resetGame = () => {
    setBirdY(GAME_HEIGHT / 2);
    setVelocity(0);
    setPipes([]);
    setScore(0);
    setIsGameOver(false);
  };

  useEffect(() => {
    if (isGameOver) return;

    const generatePipe = () => {
    const minPipeHeight = 100; // avoid tiny top pipes
    const maxPipeHeight = 250; // avoid huge top pipes
    const topHeight = Math.floor(Math.random() * (maxPipeHeight - minPipeHeight)) + minPipeHeight;

    setPipes((prev) => [
      ...prev,
      {
        left: GAME_WIDTH,
        topHeight,
        bottomY: topHeight + PIPE_GAP,
        scored: false
      },
    ]);
  };

    const pipeInterval = setInterval(generatePipe, 2000);
    return () => clearInterval(pipeInterval);
  }, [isGameOver]);

  useEffect(() => {
    if (isGameOver) return;

    gameInterval.current = setInterval(() => {
      setBirdY((y) => Math.min(GAME_HEIGHT - BIRD_SIZE, y + velocity));
      setVelocity((v) => v + GRAVITY);

      setPipes((prevPipes) =>
        prevPipes
          .map((pipe) => ({
            ...pipe,
            left: pipe.left - 4,
          }))
          .filter((pipe) => pipe.left + PIPE_WIDTH > 0)
      );
    }, 30);

    return () => clearInterval(gameInterval.current);
  }, [velocity, isGameOver]);

  useEffect(() => {
    pipes.forEach((pipe) => {
      const birdX = 60;
      const birdBottom = birdY + BIRD_SIZE;
      const inPipe = pipe.left < birdX + BIRD_SIZE && pipe.left + PIPE_WIDTH > birdX;

      const hitTop = birdY < pipe.topHeight;
      const hitBottom = birdBottom > pipe.bottomY;

      if (inPipe && (hitTop || hitBottom)) {
        setIsGameOver(true);
        clearInterval(gameInterval.current);
      }

      // Score when passing pipe
      if (!pipe.scored && pipe.left + PIPE_WIDTH < birdX) {
        pipe.scored = true;
        setScore((s) => s + 1);
      }
    });

    if (birdY <= 0 || birdY + BIRD_SIZE >= GAME_HEIGHT) {
      setIsGameOver(true);
      clearInterval(gameInterval.current);
    }
  }, [pipes, birdY]);

  return (
    <div className="flappy-wrapper">
      <div className="game-area" ref={gameRef} onClick={jump}>
        <div className="bird" style={{
    top: birdY,
    backgroundImage: `url(${birdImg})`,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  }}></div>

        {pipes.map((pipe, index) => (
          <React.Fragment key={index}>
            <div
              className="pipe top-pipe"
              style={{ left: pipe.left, height: pipe.topHeight }}
            ></div>
            <div
              className="pipe bottom-pipe"
              style={{
                left: pipe.left,
                top: pipe.bottomY,
                height: GAME_HEIGHT - pipe.bottomY,
              }}
            ></div>
          </React.Fragment>
        ))}

        <div className="score-label">Score: {score}</div>

        {isGameOver && (
          <div className="game-over">
            <p>Game Over!</p>
            <button onClick={resetGame}>Play Again</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlappyBird;
