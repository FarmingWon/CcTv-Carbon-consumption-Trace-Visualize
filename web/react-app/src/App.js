import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

import Home from './pages/Home';
import About from './pages/About';
import Counter from './pages/Counter';
import Input from './pages/Input';
import Terminal from './pages/Terminal';

function App() {
  return (
    <div className="App">
      <nav>
        <Link to="/">Home</Link> | <Link to="/about">about</Link>|{' '}
        <Link to="/Counter">Counter</Link> | <Link to="/Input">Input</Link> |
        <Link to="/Terminal">Terminal</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/Counter" element={<Counter />} />
        <Route path="/Input" element={<Input />} />
        <Route path="/Terminal" element={<Terminal />} />
      </Routes>
    </div>
  );
}

export default App;
