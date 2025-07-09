import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import IndividualPage from './Pages/IndividualPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/IndividualPage" element={<IndividualPage />} />
        
      </Routes>
    </Router>
  );
}

export default App;
