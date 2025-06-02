import React, { useState, useEffect, useRef } from 'react';
import '../assets/TypingSpeedTest.css';

// ✅ Replace this list with any domain-specific words if needed
const wordList = [
  "about", "above", "access", "account", "action", "active", "across", "advert", "agency", "almost", "amount",
  "answer", "around", "article", "author", "average", "before", "behind", "benefit", "beyond", "budget", "career",
  "chance", "change", "charge", "choice", "client", "common", "create", "credit", "design", "detail", "device",
  "digital", "editor", "effort", "email", "energy", "engine", "enough", "entire", "family", "feature", "global",
  "growth", "impact", "income", "invest", "latest", "leader", "market", "method", "modern", "mobile", "moment",
  "nation", "nature", "notice", "object", "online", "option", "policy", "portal", "prefer", "profit", "public",
  "report", "result", "review", "search", "sector", "select", "server", "social", "source", "speech", "status",
  "studio", "system", "target", "travel", "update", "upload", "user", "value", "visual", "volume", "website",
  "window", "writer", "zone"
];

const generateWordList = (count) => {
  return Array.from({ length: count }, () => {
    const index = Math.floor(Math.random() * wordList.length);
    return wordList[index];
  });
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
    setWords(generateWordList(50));
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
      if (trimmed === words[currentWordIndex]) {
        setCorrectCount(correctCount + 1);
      }
      setCurrentWordIndex(currentWordIndex + 1);
      setInput('');

      // Auto-scroll
      if (currentWordIndex % 10 === 0) {
        const wordBox = document.querySelector('.word-box');
        wordBox.scrollTop += 30;
      }
    }
  };

  const restartTest = () => {
    setWords(generateWordList(50));
    setInput('');
    setCurrentWordIndex(0);
    setCorrectCount(0);
    setStartTime(null);
    setTimeLeft(60);
    setTestEnded(false);
    setWpm(0);
    inputRef.current.focus();
  };

  const accuracy = Math.round((correctCount / Math.max(1, currentWordIndex)) * 100) || 0;

  return (
    <div className="typing-container">
      <h1>Typing Speed Test</h1>
      <div className="word-box">
        {words.map((word, index) => (
          <span
            key={index}
            className={`word ${
              index === currentWordIndex ? 'active-word' : ''
            } ${
              index < currentWordIndex
                ? words[index] === input.trim()
                  ? 'correct'
                  : 'incorrect'
                : ''
            }`}
          >
            {word}
          </span>
        ))}
      </div>

      <input
        type="text"
        value={input}
        onChange={handleChange}
        disabled={testEnded}
        ref={inputRef}
        placeholder={testEnded ? "Test completed" : "Start typing..."}
        className="typing-input"
      />

      <div className="stats-container">
        <div className="stat"><span className="stat-label">Time:</span><span className="stat-value">{timeLeft}s</span></div>
        <div className="stat"><span className="stat-label">WPM:</span><span className="stat-value">{wpm}</span></div>
        <div className="stat"><span className="stat-label">Accuracy:</span><span className="stat-value">{accuracy}%</span></div>
        <div className="stat"><span className="stat-label">Correct:</span><span className="stat-value">{correctCount}/{currentWordIndex}</span></div>
      </div>
      <p className="note">📝 Note: After typing a word, press the <strong>spacebar</strong> to move to the next word.</p>
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
