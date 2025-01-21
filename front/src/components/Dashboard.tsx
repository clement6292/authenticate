import React from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            console.error("Token is null or not found");
            return;
        }
        try {
            const response = await axios.post("http://127.0.0.1:8000/logout", {}, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                localStorage.removeItem('token');
                navigate('/login');
            } else {
                console.error("Erreur lors de la déconnexion", response.statusText);
            }
        } catch (error) {
            console.error("Erreur lors de l'appel à la méthode de déconnexion", error);
        }
    };

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen">
            <button
                onClick={handleLogout}
                className="absolute top-4 right-4 border bg-blue-600 border-gray-300 text-white hover:bg-red-600 rounded-lg py-2 px-4"
            >
                Déconnexion
            </button>
            <div className="text-center p-8">
                <h2 className="text-4xl font-bold mb-4">Bienvenue sur votre tableau de bord !</h2>
                <h5 className="text-lg mb-6">Vous êtes connecté. Profitez de votre expérience.</h5>
            </div>
        </div>
    );
};
export default Dashboard;