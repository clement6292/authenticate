import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard  from "./components/Dashboard";
import { Navigate, Outlet } from 'react-router-dom';

function App() {
  const ProtectedRoute = () => {
    const isAuthenticated = localStorage.getItem('token') !== null;

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

  return (
  <>
  <Routes>
    <Route path='/' element={<Home />} />
    <Route path='/login' element={<Login />} />
    <Route path='/register' element={<Register />} />
    <Route path="/dashboard" element={<ProtectedRoute />}>
        <Route path="" element={<Dashboard />} />
    </Route>
  </Routes>
  </>
  );
}

export default App;
