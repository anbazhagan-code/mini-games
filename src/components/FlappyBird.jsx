import React, { useState, useEffect, useRef } from 'react';
import '../assets/FlappyBird.css';

const GRAVITY = 0.8;
const JUMP_STRENGTH = -10;
const PIPE_GAP = 160;
const PIPE_WIDTH = 60;
const BIRD_WIDTH = 40;
const GAME_HEIGHT = 500;
const GAME_WIDTH = 400;

const FlappyBird = () => {
  const [birdY, setBirdY] = useState(GAME_HEIGHT / 2);
  const [velocity, setVelocity] = useState(0);
  const [pipes, setPipes] = useState([]);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const gameRef = useRef();
  const intervalRef = useRef();

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
    const addPipe = () => {
      const topHeight = Math.floor(Math.random() * 200) + 50;
      setPipes((prev) => [
        ...prev,
        {
          left: GAME_WIDTH,
          topHeight,
          bottomY: topHeight + PIPE_GAP,
        },
      ]);
    };

    const pipeInterval = setInterval(addPipe, 2000);
    return () => clearInterval(pipeInterval);
  }, []);

  useEffect(() => {
    if (isGameOver) return;

    intervalRef.current = setInterval(() => {
      setBirdY((y) => Math.min(GAME_HEIGHT - BIRD_WIDTH, y + velocity));
      setVelocity((v) => v + GRAVITY);

      setPipes((prev) =>
        prev
          .map((pipe) => ({ ...pipe, left: pipe.left - 4 }))
          .filter((pipe) => pipe.left + PIPE_WIDTH > 0)
      );
    }, 30);

    return () => clearInterval(intervalRef.current);
  }, [velocity, isGameOver]);

  useEffect(() => {
    pipes.forEach((pipe) => {
      const inPipeX = pipe.left < BIRD_WIDTH + 50 && pipe.left + PIPE_WIDTH > 50;
      const hitTop = birdY < pipe.topHeight;
      const hitBottom = birdY + BIRD_WIDTH > pipe.bottomY;

      if (inPipeX && (hitTop || hitBottom)) {
        setIsGameOver(true);
        clearInterval(intervalRef.current);
      }

      if (pipe.left + PIPE_WIDTH === 50) {
        setScore((s) => s + 1);
      }
    });

    if (birdY + BIRD_WIDTH >= GAME_HEIGHT || birdY <= 0) {
      setIsGameOver(true);
      clearInterval(intervalRef.current);
    }
  }, [pipes, birdY]);

  return (
    <div className="flappy-wrapper">
      <div className="game-area" ref={gameRef} onClick={jump}>
        <div className="bird" style={{ top: birdY }}></div>

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
