// gamesConfig.js
import { FaGamepad, FaMemory, FaKeyboard, FaPuzzlePiece, FaBasketballBall, FaBomb } from 'react-icons/fa';

export const games = [
  {
    id: 'tic-tac-toe',
    path: '/tic-tac-toe',
    name: 'Tic Tac Toe',
    description: 'Classic X and O game',
    icon: <FaGamepad />,
    component: () => import('./components/TicTacToe'),
  },
  {
    id: 'memory-match',
    path: '/memory-match',
    name: 'Memory Match',
    description: 'Test your memory skills',
    icon: <FaMemory />,
    component: () => import('./components/MemoryMatch'),
  },
  {
    id: 'typing-speed',
    path: '/typing-speed',
    name: 'Typing Test',
    description: 'Measure your typing speed',
    icon: <FaKeyboard />,
    component: () => import('./components/TypingSpeedTest'),
  },
  {
    id: 'puzzle',
    path: '/puzzle',
    name: 'Puzzle',
    description: 'Solve the sliding puzzle',
    icon: <FaPuzzlePiece />,
    component: () => import('./components/PuzzleGame'),
  },
  {
    id: 'catch-the-ball',
    path: '/catch-the-ball',
    name: 'Catch The Ball',
    description: 'Quick reflexes needed',
    icon: <FaBasketballBall />,
    component: () => import('./components/CatchTheBall'),
  },
  {
    id: 'minesweeper',
    path: '/minesweeper',
    name: 'Minesweeper',
    description: 'Classic bomb-avoidance puzzle',
    icon: <FaBomb />,
    component: () => import('./components/Minesweeper'),
  }
  // ADD NEW GAMES HERE (Just add a new object)
];