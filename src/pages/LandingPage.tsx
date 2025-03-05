import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [showSignupModal, setShowSignupModal] = useState(false);

  const handleSignupClick = () => {
    setShowSignupModal(true);
  };

  const handleSignupTypeSelect = (type: 'student' | 'teacher') => {
    setShowSignupModal(false);
    navigate(`/signup/${type}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 relative">
      <h1 className="text-4xl font-bold mb-8">Welcome to VidyaSetu</h1>
      <div className="space-x-4">
        <button
          onClick={handleSignupClick}
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

      {/* Signup Type Modal */}
      {showSignupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-96 text-center">
            <h2 className="text-2xl font-bold mb-6">Choose Signup Type</h2>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => handleSignupTypeSelect('student')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex flex-col items-center"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="48" 
                  height="48" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="mb-2"
                >
                  <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2z"/>
                  <path d="M9 12h6"/>
                  <path d="M12 9v6"/>
                </svg>
                Student
              </button>
              <button
                onClick={() => handleSignupTypeSelect('teacher')}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex flex-col items-center"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="48" 
                  height="48" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="mb-2"
                >
                  <path d="M17 6.1H3"/>
                  <path d="M21 12.5H3"/>
                  <path d="M15.1 18H3"/>
                  <path d="m17 12 5-3-5-3v6z"/>
                </svg>
                Teacher
              </button>
            </div>
            <button
              onClick={() => setShowSignupModal(false)}
              className="mt-6 text-gray-500 hover:text-gray-700 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;