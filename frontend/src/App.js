import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import DataExploration from './pages/DataExploration';
import Visualizations from './pages/Visualizations';
import Conclusion from './pages/Conclusion';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/exploration" element={<DataExploration />} />
            <Route path="/visualizations" element={<Visualizations />} />
            <Route path="/conclusion" element={<Conclusion />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;