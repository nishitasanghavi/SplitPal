import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import NewGroup from './components/NewGroup';
import AddPayment from './components/AddPayment';
import Auth from './components/Auth';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/new-group" element={<NewGroup />} />
          <Route path="/add-payment" element={<AddPayment />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
