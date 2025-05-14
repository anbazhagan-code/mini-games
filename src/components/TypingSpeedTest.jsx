import React, { useState, useEffect, useRef } from 'react';
import '../assets/TypingSpeedTest.css';

const wordsList = [
  'react', 'component', 'javascript', 'function', 'state', 'props',
  'array', 'object', 'variable', 'random', 'timer', 'score',
  'hooks', 'context', 'redux', 'node', 'express', 'html', 'css',
  'typing', 'speed', 'test', 'keyboard', 'code', 'syntax'
];

function TypingSpeedTest() {
  const [words, setWords] = useState([]);
  const [input, setInput] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [testEnded, setTestEnded] = useState(false);
  const inputRef = useRef();

  useEffect(() => {
    setWords(generateWords(50));
    inputRef.current.focus();
  }, []);

  useEffect(() => {
    if (startTime && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setTestEnded(true);
    }
  }, [startTime, timeLeft]);

  const generateWords = (count) => {
    const shuffled = [...wordsList].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
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
    }
  };

  const accuracy = Math.round((correctCount / currentWordIndex) * 100) || 0;

  return (
    <div className="typing-container">
      <h2>Typing Speed Test</h2>
      <div className="word-box">
        {words.map((word, index) => (
          <span
            key={index}
            className={index === currentWordIndex ? 'active-word' : ''}
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
        placeholder="Start typing..."
      />

      <div className="stats">
        <p>Time left: {timeLeft}s</p>
        <p>Words Typed: {currentWordIndex}</p>
        <p>Correct Words: {correctCount}</p>
        <p>Accuracy: {accuracy}%</p>
      </div>

      {testEnded && (
        <div className="result">
          <h3>Test Finished!</h3>
          <p>You typed {correctCount} correct words out of {currentWordIndex}</p>
          <p>Final Accuracy: {accuracy}%</p>
        </div>
      )}
    </div>
  );
}

export default TypingSpeedTest;
