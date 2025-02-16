import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import AdminDashboard from './pages/AdminDashboard';
import Orders from './pages/Orders';

const App = () => {
  return (
    <Router>
      {/* Navbar */}
      <Navbar />

      {/* Routes */}
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>
    </Router>
  );
};

export default App;