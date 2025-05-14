import React, { useState, useEffect } from 'react';
import { FaRedo, FaTrophy } from 'react-icons/fa';
import '../assets/MemoryMatch.css';

const CARD_SYMBOLS = ['🍩', '🧁', '🍰', '🍪', '🍫', '🍦', '🥧', '🍮'];

function MemoryGame() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [bestScore, setBestScore] = useState(Infinity);

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (solved.length === CARD_SYMBOLS.length) {
      setGameComplete(true);
      if (moves < bestScore) setBestScore(moves);
    }
  }, [solved]);

  const initializeGame = () => {
    const symbols = [...CARD_SYMBOLS, ...CARD_SYMBOLS];
    const shuffledCards = symbols
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({ id: index, symbol, flipped: false }));

    setCards(shuffledCards);
    setFlipped([]);
    setSolved([]);
    setMoves(0);
    setGameComplete(false);
  };

  const handleCardClick = (id) => {
    const clickedCard = cards.find((card) => card.id === id);
    if (flipped.length === 2 || clickedCard.flipped || solved.includes(clickedCard.symbol)) return;

    const updatedCards = cards.map((card) =>
      card.id === id ? { ...card, flipped: true } : card
    );
    const updatedFlipped = [...flipped, { id, symbol: clickedCard.symbol }];

    setCards(updatedCards);
    setFlipped(updatedFlipped);

    if (updatedFlipped.length === 2) {
      setMoves((prev) => prev + 1);

      const [first, second] = updatedFlipped;
      if (first.symbol === second.symbol) {
        setSolved([...solved, first.symbol]);
        setFlipped([]);
      } else {
        setTimeout(() => {
          const resetCards = updatedCards.map((card) =>
            card.id === first.id || card.id === second.id
              ? { ...card, flipped: false }
              : card
          );
          setCards(resetCards);
          setFlipped([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="memory-game-container">
      <h2 className="game-title">Memory Match</h2>

      <div className="game-info">
        <div className="moves">Moves: {moves}</div>
        {bestScore < Infinity && (
          <div className="best-score">
            <FaTrophy /> Best: {bestScore}
          </div>
        )}
        <button className="reset-btn" onClick={initializeGame}>
          <FaRedo /> New Game
        </button>
      </div>

      <div className="memory-board">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`memory-card ${card.flipped || solved.includes(card.symbol) ? 'flipped' : ''}`}
            onClick={() => handleCardClick(card.id)}
            aria-label={`Memory card ${card.flipped ? `showing ${card.symbol}` : 'face down'}`}
          >
            <div className="card-front">{card.symbol}</div>
            <div className="card-back"></div>
          </div>
        ))}
      </div>

      {gameComplete && (
        <div className="game-complete">
          <h3>🎉 Congratulations!</h3>
          <p>You completed the game in {moves} moves</p>
          {moves === bestScore && <p>New best score! 🏆</p>}
          <button onClick={initializeGame}>Play Again</button>
        </div>
      )}
    </div>
  );
}

export default MemoryGame;
