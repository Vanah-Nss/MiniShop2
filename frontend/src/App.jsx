
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import Produits from './components/Produits';
import Commandes from './components/Commandes';
import TableauDeBord from './components/TableauDeBord';
import Clients from './components/Clients';
import Stats from './components/Stats';

function App() {
  

  return (
    <Router>
      <Routes>
      
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

       
        <Route path="/dashboard" element={<Dashboard><TableauDeBord /></Dashboard>} />
        <Route path="/produits" element={<Dashboard><Produits /></Dashboard>} />
        <Route path="/commandes" element={<Dashboard><Commandes /></Dashboard>} />


        <Route path="/clients" element={<Dashboard><Clients /></Dashboard>} />
        <Route path="/stats" element={<Dashboard><Stats /></Dashboard>} />

        
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
