import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Detail from './components/Detail'; // Pastikan Detail.js sudah dibuat

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/detail" element={<Detail />} />
      </Routes>
    </Router>
  );
};

export default App;
