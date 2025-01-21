import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    axios
      .post("http://127.0.0.1:8000/login", { email, password })
      .then((response) => {
        const { access_token } = response.data;
        localStorage.setItem("token", access_token);
        navigate("/dashboard");
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-4xl font-bold mb-8 text-center">Login</h1>
            <form onSubmit={handleLogin}>
                <div className="mb-4">
                    <label className="block text-lg font-semibold">Username</label>
                    <div className="relative">
                        <input
                            type="text"
                            className="w-full border border-gray-300 px-4 py-2 rounded-lg pr-10"
                            placeholder="Enter your username"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <svg
                            width="20px"
                            height="20px"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                            <path
                                d="M8 7C9.65685 7 11 5.65685 11 4C11 2.34315 9.65685 1 8 1C6.34315 1 5 2.34315 5 4C5 5.65685 6.34315 7 8 7Z"
                                fill="#000000"
                            />
                            <path
                                d="M14 12C14 10.3431 12.6569 9 11 9H5C3.34315 9 2 10.3431 2 12V15H14V12Z"
                                fill="#000000"
                            />
                        </svg>
                    </div>
                </div>
                <div className="mb-6">
                    <label className="block text-lg font-semibold">Password</label>
                    <div className="relative">
                        <input
                            type="password"
                            className="w-full border border-gray-300 px-4 py-2 rounded-lg pr-10"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <svg
                            width="20px"
                            height="20px"
                            viewBox="0 0 48 48"
                            xmlns="http://www.w3.org/2000/svg"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                            <g id="Layer_2" data-name="Layer 2">
                                <g id="invisible_box" data-name="invisible box">
                                    <rect width="48" height="48" fill="none" />
                                </g>
                                <g id="Icons">
                                    <g>
                                        <path d="M3,30.5l-1,.6V39a2,2,0,0,0,2,2H24V37H6V33.4A21.7,21.7,0,0,1,16,31a21.5,21.5,0,0,1,8,1.5V28.3A24.4,24.4,0,0,0,16,27,25.6,25.6,0,0,0,3,30.5Z" />
                                        <path d="M16,5a9,9,0,1,0,9,9A9,9,0,0,0,16,5Zm0,14a5,5,0,1,1,5-5A5,5,0,0,1,16,19Z" />
                                        <path d="M44,28H43V25a6,6,0,0,0-12,0v3H30a2,2,0,0,0-2,2V41a2,2,0,0,0,2,2H44a2,2,0,0,0,2-2V30A2,2,0,0,0,44,28Zm-9-3a2,2,0,0,1,4,0v3H35Zm7,14H32V32H42Z" />
                                    </g>
                                </g>
                            </g>
                        </svg>
                    </div>
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 w-full"
                >
                    Login
                </button>
            </form>
            <div className="mt-4 text-center">
                <Link to="/register" className="text-black hover:underline">
                    Don't have an account?
                    <span className="text-blue-500"> Register</span>
                </Link>
            </div>
        </div>
    </div>
);
};

export default Login;
