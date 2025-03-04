import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Welcome to VidyaSetu</h1>
      <div className="space-x-4">
        <button
          onClick={() => navigate('/signup')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          Signup
        </button>
        <button
          onClick={() => navigate('/login')}
          className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default LandingPage;