import React from 'react';
import './App.css';
import { Route, Routes, Link, useNavigate } from 'react-router-dom';
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';

function App() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            console.error("Token is null or not found");
            return;
        }

        try {
            // Optionnel : Appel API pour la déconnexion
            await axios.post("http://127.0.0.1:8000/logout", {}, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            localStorage.removeItem('token');
            navigate('/login');
        } catch (error) {
            console.error("Erreur lors de la déconnexion", error);
        }
    };

    const ProtectedRoute = () => {
        const isAuthenticated = localStorage.getItem('token') !== null;

        return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
    };

    const isAuthenticated = localStorage.getItem('token') !== null;

    return (
        <>
            <header className="flex justify-between p-4 bg-blue-600 text-white">
                <h1 className="text-xl">My App</h1>
                {isAuthenticated && (
                    <button
                        onClick={handleLogout}
                        className="border border-gray-300 bg-green-400 text-white hover:bg-red-500 rounded-lg py-2 px-4"
                    >
                        Déconnexion
                    </button>
                )}
            </header>

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