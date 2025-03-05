import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Sidebar from './components/Sidebar.tsx';
import Dashboard from './pages/Dashboard';
import OnlineClasses from './pages/OnlineClasses';
import Materials from './pages/Materials';
import Chatbot from './pages/Chatbot';
import Tests from './pages/Tests';
import Progress from './pages/Progress';
import Profile from './pages/Profile';
import SignupPage from './pages/Signup.tsx';
import Login from './pages/Login.tsx';
import LandingPage from './pages/LandingPage.tsx';
import TeacherSignup from './pages/TeacherSignup.tsx';

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState('dashboard'); // <-- Added state for Sidebar

  const hideSidebar = location.pathname === '/signup' || location.pathname === '/login';

  if (hideSidebar) {
    return <div className="h-screen w-screen flex justify-center items-center">{children}</div>;
  }

  return (
    <div className="relative flex h-screen bg-gray-100">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-20">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-md bg-primary text-white"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      {!hideSidebar && (
        <div className={`fixed inset-y-0 w-64 bg-white shadow-lg lg:block z-10 ${mobileMenuOpen ? 'block' : 'hidden'}`}>
          <Sidebar activePage={activePage} setActivePage={setActivePage} /> 
        </div>
      )}

      {/* Main content */}
      <div className={`flex-1 ${!hideSidebar ? 'lg:ml-64 p-4' : ''} overflow-auto`}>{children}</div>
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      console.log("token exists");
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup/student" element={<SignupPage />} />
        <Route path="/signup/teacher" element={<TeacherSignup/>} />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        
        {/* Protected Routes */}
        {isAuthenticated ? (
        <Route
          path="*"
          element={
            <Layout>
              <Routes>
                <Route path="/dashboard" element={<Dashboard setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="/onlineClasses" element={<OnlineClasses />} />
                <Route path="/materials" element={<Materials />} />
                <Route path="/chatbot" element={<Chatbot />} />
                <Route path="/tests" element={<Tests />} />
                <Route path="/progress" element={<Progress />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<Navigate to="/dashboard" />} />
              </Routes>
            </Layout>
          }
        />
      ) : (
        <Route path="*" element={<Navigate to="/dashboard" />} />
      )}

      </Routes>
    </Router>
  );
}

export default App;
