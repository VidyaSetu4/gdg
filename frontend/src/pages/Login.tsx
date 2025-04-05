import React, { useState } from "react";
import { FiMail, FiLock, FiArrowRight } from "react-icons/fi"; // Importing the FiMail, FiLock, and FiArrowRight icons from react-icons
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../../config";
import { Link } from "react-router-dom";

interface LoginProps {
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log("email: ", email);
    console.log("password: ", password);
    try {
      const response = await axios.post( `${API_BASE_URL}/api/auth/login`, {
        email,
        password,
      });
      console.log("Response:", response.data);
      console.log(response.data.token);
      localStorage.setItem("users", response.data);
      localStorage.setItem("token", response.data.token);
      setIsAuthenticated(true);
      navigate("/dashboard");
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <div className="flex min-h-screen">
      {/* Left Column - App Info */}
      <div className="hidden lg:flex flex-col w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 p-12 text-white justify-center">
        <div className="max-w-md mx-auto">
          <h1 className="text-4xl font-bold mb-6">Welcome to VidyaSetu</h1>
          <p className="text-xl opacity-90 mb-8">Experience the next generation of productivity and collaboration tools designed for modern teams.</p>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="h-8 w-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-4 mt-1">
                <span className="text-white text-lg">✓</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Personalized Learning</h3>
                <p className="text-white text-opacity-80">Uses AI to tailor content based on each student's needs in underserved communities.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="h-8 w-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-4 mt-1">
                <span className="text-white text-lg">✓</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Real-Time Support</h3>
                <p className="text-white text-opacity-80">Connects students with teachers for live interaction, feedback, and progress tracking.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="h-8 w-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-4 mt-1">
                <span className="text-white text-lg">✓</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Interactive Content</h3>
                <p className="text-white text-opacity-80"> Offers engaging videos, quizzes, and exercises to make learning more effective and fun.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Column - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Log in to your account</h2>
            <p className="text-gray-600 mt-3">Welcome back! Please enter your details</p>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <FiMail size={16} /> Email address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  className="block w-full p-3 pl-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FiLock size={16} /> Password
                </label>
              </div>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  className="block w-full p-3 pl-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            
            <button
              type="submit"
              className="flex items-center justify-center w-full py-3 px-4 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
            >
              Sign in <FiArrowRight size={16} className="ml-2" />
            </button>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
              </div>
            </div>
            
            <div className="flex justify-center">
              <button
                type="button"
                className="inline-flex justify-center items-center py-2.5 px-8 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Google
              </button>
            </div>
            
            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                Don't have an account?
                <Link to="/" className="text-blue-600 hover:underline">
                  Sign up for free
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;