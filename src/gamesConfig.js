// gamesConfig.js
import { FaGamepad, FaMemory, FaKeyboard, FaPuzzlePiece, FaBomb, FaHandRock } from 'react-icons/fa';

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
    id: 'minesweeper',
    path: '/minesweeper',
    name: 'Minesweeper',
    description: 'Classic bomb-avoidance puzzle',
    icon: <FaBomb />,
    component: () => import('./components/Minesweeper'),
  },
  {
  id: 'rock-paper-scissors',
  path: '/rock-paper-scissors',
  name: 'Rock Paper Scissors',
  description: 'Play the classic hand game!',
  icon: <FaHandRock />,
  component: () => import('./components/RockPaperScissors'),
},
  // ADD NEW GAMES HERE (Just add a new object)
];