import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    axios
      .post("http://127.0.0.1:8000/register", {
        username,
        email,
        password,
      })
      .then((response) => {
        console.log(response.data);
        navigate("/login");
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 mx-4 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold mb-8 text-center">Register</h1>
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="block text-lg font-semibold">Name</label>
            <input
              type="text"
              className="w-full border border-gray-300 px-4 py-2 rounded-lg"
              placeholder="Enter your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-lg font-semibold">Email Address</label>
            <input
              type="email"
              className="w-full border border-gray-300 px-4 py-2 rounded-lg"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-lg font-semibold">Password</label>
            <input
              type="password"
              className="w-full border border-gray-300 px-4 py-2 rounded-lg"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 w-full"
          >
            Register
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link to="/login" className="text-black hover:underline">
            Already have an account? 
            <span className="text-blue-500">Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
