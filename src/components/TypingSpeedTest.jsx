import React, { useState, useEffect, useRef } from 'react';
import '../assets/TypingSpeedTest.css';

// ✨ Human-like, non-computerized word list
const wordList = [
  "apple", "banana", "guitar", "castle", "sunset", "elephant", "forest", "magic", "ocean", "river",
  "mountain", "breeze", "cloud", "summer", "winter", "autumn", "spring", "travel", "planet", "daisy",
  "coffee", "garden", "puzzle", "mirror", "candle", "feather", "velvet", "smile", "laughter", "parrot",
  "storm", "whisper", "dream", "jungle", "flame", "shadow", "raindrop", "moonlight", "sunshine", "honey",
  "pebble", "bamboo", "silent", "golden", "twilight", "canyon", "glimmer", "echo", "freedom", "adventure",
  "island", "meadow", "tulip", "carousel", "blanket", "painter", "fiction", "lantern", "musical", "storybook",
  "village", "lighthouse", "harvest", "fountain", "marble", "treasure", "ginger", "ribbon", "acorn", "sketch",
  "pillow", "serene", "sparkle", "dragon", "butterfly", "crystal", "cotton", "firefly", "sunrise", "sapphire",
  "mystery", "fortune", "blossom", "journey", "violin", "fairy", "legend", "sunbeam", "midnight", "balloon"
];

// 👇 Random non-repeating word generator
const generateWordList = (count) => {
  const shuffled = [...wordList].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

function TypingSpeedTest() {
  const [words, setWords] = useState([]);
  const [input, setInput] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [testEnded, setTestEnded] = useState(false);
  const [wpm, setWpm] = useState(0);
  const inputRef = useRef();

  useEffect(() => {
    setWords(generateWordList(90));
    inputRef.current.focus();
  }, []);

  useEffect(() => {
    if (startTime && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
        calculateWpm();
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setTestEnded(true);
    }
  }, [startTime, timeLeft]);

  const calculateWpm = () => {
    if (startTime) {
      const minutes = (60 - timeLeft) / 60;
      const calculatedWpm = Math.round(correctCount / minutes);
      setWpm(isFinite(calculatedWpm) ? calculatedWpm : 0);
    }
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setInput(val);

    if (!startTime) {
      setStartTime(Date.now());
    }

    if (val.endsWith(' ')) {
      const trimmed = val.trim();
      const expected = words[currentWordIndex];

      if (trimmed.toLowerCase() === expected.toLowerCase()) {
        setCorrectCount((prev) => prev + 1);
      }

      setCurrentWordIndex((prev) => prev + 1);
      setInput('');

      // Auto-scroll
      if (currentWordIndex % 10 === 0) {
        const wordBox = document.querySelector('.word-box');
        if (wordBox) wordBox.scrollTop += 30;
      }
    }
  };

  const restartTest = () => {
    setWords(generateWordList(90));
    setInput('');
    setCurrentWordIndex(0);
    setCorrectCount(0);
    setStartTime(null);
    setTimeLeft(60);
    setTestEnded(false);
    setWpm(0);
    inputRef.current.focus();
  };

  const accuracy = Math.round((correctCount / Math.max(1, currentWordIndex)) * 100);

  return (
    <div className="typing-container">
      <h1>Typing Speed Test</h1>

      <div className="word-box">
        {words.map((word, index) => {
          const isActive = index === currentWordIndex;
          const isCorrect =
            index < currentWordIndex &&
            word.toLowerCase() === words[index].toLowerCase();
          const isIncorrect = index < currentWordIndex && !isCorrect;

          return (
            <span
              key={index}
              className={`word ${isActive ? 'active-word' : ''} ${
                isCorrect ? 'correct' : isIncorrect ? 'incorrect' : ''
              }`}
            >
              {word}
            </span>
          );
        })}
      </div>

      <input
        type="text"
        value={input}
        onChange={handleChange}
        disabled={testEnded}
        ref={inputRef}
        placeholder={testEnded ? 'Test completed' : 'Start typing...'}
        className="typing-input"
      />

      <div className="stats-container">
        <div className="stat">
          <span className="stat-label">Time:</span>
          <span className="stat-value">{timeLeft}s</span>
        </div>
        <div className="stat">
          <span className="stat-label">WPM:</span>
          <span className="stat-value">{wpm}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Accuracy:</span>
          <span className="stat-value">{accuracy}%</span>
        </div>
        <div className="stat">
          <span className="stat-label">Correct:</span>
          <span className="stat-value">
            {correctCount}/{currentWordIndex}
          </span>
        </div>
      </div>

      <p className="note">
        📝 Note: After typing a word, press the <strong>spacebar</strong> to move to the next word.
      </p>

      {testEnded && (
        <div className="result-modal">
          <h2>Test Results</h2>
          <div className="result-stats">
            <p>Words Per Minute: <strong>{wpm}</strong></p>
            <p>Accuracy: <strong>{accuracy}%</strong></p>
            <p>Correct Words: <strong>{correctCount}/{currentWordIndex}</strong></p>
          </div>
          <button onClick={restartTest} className="restart-button">
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}

export default TypingSpeedTest;
