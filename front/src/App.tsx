/* eslint-disable react/jsx-pascal-case */
import React from 'react';
import './App.css';
import { Route, Routes, Link, useNavigate } from 'react-router-dom';
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Product from './components/Product';
import Product_create from './components/Product_create';
import axios from 'axios';
import { Navigate, Outlet } from 'react-router-dom';

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
                    <div className="flex items-center">
                        <Link to="/product" className="text-xl mr-4">
                            Produits
                        </Link>
                        <Link to="/product_create" className="text-xl mr-4">
                          Creer un produit 
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="border border-gray-300 bg-green-400 text-white hover:bg-red-500 rounded-lg py-2 px-4"
                        >
                            Déconnexion
                        </button>
                    </div>
                )}
            </header>

            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path="/dashboard" element={<ProtectedRoute />}>
                    <Route path="" element={<Dashboard />} />
                </Route>
                <Route path="/product" element={<ProtectedRoute />}>
                    <Route path="" element={<Product />} /> {/* Route protégée pour le produit */}
                </Route>
                <Route path="/product_create" element={<ProtectedRoute />}>
                    <Route path="" element={<Product_create />} /> {/* Route protégée pour le produit */}
                </Route>
            </Routes>
        </>
    );
}

export default App;