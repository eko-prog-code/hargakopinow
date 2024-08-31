// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Detail from './components/Detail'; // Make sure Detail.js exists
import Income from './components/Income'; // Make sure Income.js exists
import Outcome from './components/Outcome'; // Make sure Outcome.js exists
import CashFlow from './components/CashFlow';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/detail" element={<Detail />} />
        <Route path="/CashFlow" element={<CashFlow />} /> {/* Use element here */}
        <Route path="/income" element={<Income />} />
        <Route path="/outcome" element={<Outcome />} />
      </Routes>
    </Router>
  );
};

export default App;
