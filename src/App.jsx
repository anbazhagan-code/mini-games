// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
// Import your game pages here

const App = () => {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        {/* Add links to games here */}
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Add routes to games here */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
