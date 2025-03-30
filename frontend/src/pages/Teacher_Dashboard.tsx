import React from 'react';
import { Users, Video, FileText, TestTube2, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardProps {
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

const TeacherDashboard: React.FC<DashboardProps> = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('users');

    // Update authentication state
    setIsAuthenticated(false);
    // Redirect to LandingPage
    navigate('/');
  };
  const stats = [
    { icon: Users, label: 'Total Students', value: '250' },
    { icon: Video, label: 'Active Classes', value: '8' },
    { icon: FileText, label: 'Study Materials', value: '45' },
    { icon: TestTube2, label: 'Tests Created', value: '12' },
  ];

  return (
    <div>
      <div className='flex items-center justify-between'>
        <h1 className="text-3xl font-bold mb-8">Welcome to VidyaSetu</h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.label}</p>
                <p className="text-2xl font-semibold mt-1">{stat.value}</p>
              </div>
              <stat.icon className="text-indigo-600" size={24} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4">Upcoming Classes</h2>
          {/* Add upcoming classes list */}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4">Recent Test Results</h2>
          {/* Add recent test results */}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;