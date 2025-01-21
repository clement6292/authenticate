import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h2 className="text-4xl font-bold mb-4">Bienvenu sur ma Page d'accueil!</h2>
            <h5 className="text-lg mb-6 text-center">
            Ceci est votre Page d'accueil. Veuillez vous connecter ou vous inscrire pour continuer.
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg px-4">
                <Link to="/login" className="w-full">
                    <button className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700">
                        Login
                    </button>
                </Link>
                <Link to="/register" className="w-full">
                    <button className="w-full border border-gray-300 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-200">
                        Register
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default Home;