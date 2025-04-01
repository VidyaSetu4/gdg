import React, { ReactNode, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Sidebar from './components/Sidebar.tsx';
import TeacherSidebar from './components/Teacher_Sidebar.tsx';
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
import TeacherOnlineClasses from './pages/Teacher_Meetings.tsx';
import TeacherUpload from './pages/Teacher_Materials.tsx';
import CreateSAQTest from './pages/Teacher_tests.tsx';
import TeacherProfile from './pages/Teacher_profile.tsx';
import TeacherAnalytics from './pages/Teacher_Analytics.tsx';
import TeacherDashboard from './pages/Teacher_Dashboard.tsx';
import AttemptSAQ from './pages/AttemptSAQ.tsx';
import TeacherSAQSubmissions from './pages/TeacherSAQSubmissions.tsx';
import StudentSubmissions from './pages/StudentSubmission.tsx';
import TeacherSAQAnalytics from './pages/TeacherSAQAnalytics.tsx';

interface LayoutProps {
  children: ReactNode;
  userRole: string;
}

function Layout({ children, userRole }:LayoutProps) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState('/dashboard');

  const hideSidebar = ['/signup/student', '/signup/teacher', '/login'].includes(location.pathname);

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
      {!hideSidebar && userRole === 'student' && (
        <div className={`fixed inset-y-0 w-64 bg-white shadow-lg lg:block z-10 ${mobileMenuOpen ? 'block' : 'hidden'}`}>
          <Sidebar activePage={activePage} setActivePage={setActivePage} />
        </div>
      )}
      {!hideSidebar && userRole === 'teacher' && (
        <div className={`fixed inset-y-0 w-64 bg-white shadow-lg lg:block z-10 ${mobileMenuOpen ? 'block' : 'hidden'}`}>
          <TeacherSidebar activePage={activePage} setActivePage={setActivePage} />
        </div>
      )}

      {/* Main content */}
      <div className={`flex-1 ${!hideSidebar ? 'lg:ml-64 p-4' : ''} overflow-auto`}>{children}</div>
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      verifyToken(token);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error(`API returned status ${response.status}`);

      const result = await response.json();
      setIsAuthenticated(true);
      setUserRole(result.role);
    } catch (error) {
      console.error("Error verifying token:", error);
      setIsAuthenticated(false);
      setUserRole(null);
    }
  };

  if (isAuthenticated === null) {
    return <div className="h-screen w-screen flex justify-center items-center text-xl">Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup/student" element={<SignupPage />} />
        <Route path="/signup/teacher" element={<TeacherSignup />} />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />

        {/* Protected Routes */}
        {isAuthenticated ? (
          userRole === 'student' ? (
            <>
              <Route path="/dashboard" element={<Layout userRole={userRole}><Dashboard setIsAuthenticated={setIsAuthenticated} /></Layout>} />
              <Route path="/onlineClasses" element={<Layout userRole={userRole}><OnlineClasses /></Layout>} />
              <Route path="/materials" element={<Layout userRole={userRole}><Materials /></Layout>} />
              <Route path="/tests" element={<Layout userRole={userRole}><Tests /></Layout>} />
              <Route path="/attempt-saq/:testId" element={<Layout userRole={userRole}><AttemptSAQ /></Layout>} />
              <Route path="/student/submissions" element={<Layout userRole={userRole}><StudentSubmissions /></Layout>} />
              <Route path="/progress" element={<Layout userRole={userRole}><Progress /></Layout>} />
              <Route path="/profile" element={<Layout userRole={userRole}><Profile /></Layout>} />
              <Route path="/chatbot" element={<Layout userRole={userRole}><Chatbot /></Layout>} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </>
          ) : (
            <>
              <Route path="/dashboard" element={<Layout userRole={userRole ?? ''}><TeacherDashboard setIsAuthenticated={setIsAuthenticated} /></Layout>} />
              <Route path="/materials" element={<Layout userRole={userRole ?? ''}><TeacherUpload /></Layout>} />
              <Route path="/onlineClasses" element={<Layout userRole={userRole ?? ''}><TeacherOnlineClasses /></Layout>} />
              <Route path="/tests" element={<Layout userRole={userRole ?? ''}><CreateSAQTest /></Layout>} />
              <Route path="teacher/saq/:saqId/submissions" element={<Layout userRole={userRole ?? ''}><TeacherSAQSubmissions /></Layout>} />
              <Route path="teacher/saq/:saqId/analytics" element={<Layout userRole={userRole ?? ''}><TeacherSAQAnalytics /></Layout>} />
              <Route path="/profile" element={<Layout userRole={userRole ?? ''}><TeacherProfile /></Layout>} />     
              <Route path="/progress" element={<Layout userRole={userRole ?? ''}><TeacherAnalytics /></Layout>} />
              <Route path="*" element={<Navigate to="/onlineClasses" />} />
            </>
          )
        ) : (
          <Route path="*" element={<Navigate to="/" />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
