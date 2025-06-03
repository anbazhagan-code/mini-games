// RockPaperScissors.js
import React, { useState, useEffect } from 'react';
import '../assets/RockPaperScissors.css';

const choices = ['rock', 'paper', 'scissors'];
const choiceIcons = {
  rock: '✊',
  paper: '✋',
  scissors: '✌️',
};

const getResult = (player, computer) => {
  if (player === computer) return 'Draw';
  if (
    (player === 'rock' && computer === 'scissors') ||
    (player === 'paper' && computer === 'rock') ||
    (player === 'scissors' && computer === 'paper')
  ) {
    return 'You Win!';
  }
  return 'You Lose!';
};

function RockPaperScissors() {
  const [playerChoice, setPlayerChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [result, setResult] = useState('');
  const [score, setScore] = useState({ wins: 0, losses: 0, draws: 0 });
  const [isAnimating, setIsAnimating] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const play = (choice) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setPlayerChoice(choice);
    setComputerChoice(null);
    setResult('');
    setCountdown(3);
  };

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 500);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && playerChoice && !computerChoice) {
      const computer = choices[Math.floor(Math.random() * 3)];
      const outcome = getResult(playerChoice, computer);
      
      setComputerChoice(computer);
      setResult(outcome);
      
      // Update score
      setScore(prev => ({
        wins: outcome === 'You Win!' ? prev.wins + 1 : prev.wins,
        losses: outcome === 'You Lose!' ? prev.losses + 1 : prev.losses,
        draws: outcome === 'Draw' ? prev.draws + 1 : prev.draws
      }));
      
      setIsAnimating(false);
    }
  }, [countdown, playerChoice, computerChoice]);

  return (
    <div className="rps-wrapper">
      <h2 className="rps-title">Rock Paper Scissors</h2>
      
      <div className="rps-scoreboard">
        <div className="score wins">Wins: {score.wins}</div>
        <div className="score losses">Losses: {score.losses}</div>
        <div className="score draws">Draws: {score.draws}</div>
      </div>
      
      <div className="rps-choices">
        {choices.map((choice) => (
          <button
            key={choice}
            className={`rps-button ${choice} ${isAnimating ? 'disabled' : ''}`}
            onClick={() => play(choice)}
            disabled={isAnimating}
          >
            <span className="icon">{choiceIcons[choice]}</span>
            <span className="label">{choice}</span>
          </button>
        ))}
      </div>

      <div className="rps-battlefield">
        <div className="player-choice">
          <div className={`choice-display ${playerChoice || 'empty'} ${isAnimating ? 'shaking' : ''}`}>
            {playerChoice ? choiceIcons[playerChoice] : '?'}
          </div>
          <p>You</p>
        </div>
        
        <div className="vs">
          {countdown > 0 ? (
            <div className="countdown">{countdown}</div>
          ) : (
            <span>VS</span>
          )}
        </div>
        
        <div className="computer-choice">
          <div className={`choice-display ${computerChoice || 'empty'} ${countdown > 0 ? 'shaking' : ''}`}>
            {computerChoice ? choiceIcons[computerChoice] : '?'}
          </div>
          <p>Computer</p>
        </div>
      </div>

      {result && (
        <div className={`rps-result ${result.toLowerCase().replace(/\s/g, '-')}`}>
          <h3>{result}</h3>
          <button 
            className="play-again"
            onClick={() => {
              setPlayerChoice(null);
              setComputerChoice(null);
              setResult('');
            }}
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}

export default RockPaperScissors;