import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Video, 
  FileText, 
  MessageSquare, 
  ClipboardList, 
  BarChart2, 
  Calendar,
  Clock,
  BookOpen,
  LogOut
} from 'lucide-react';

const Dashboard = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    // Update authentication state
    setIsAuthenticated(false);
    // Redirect to LandingPage
    navigate('/');
  };

  const upcomingClasses = [
    { id: 1, subject: 'Mathematics', topic: 'Algebra Basics', time: '10:00 AM', date: 'Today', teacher: 'Dr. Sharma' },
    { id: 2, subject: 'Science', topic: 'Cell Structure', time: '2:00 PM', date: 'Today', teacher: 'Mrs. Gupta' },
    { id: 3, subject: 'English', topic: 'Grammar Rules', time: '11:30 AM', date: 'Tomorrow', teacher: 'Mr. Patel' },
  ];

  const recentTests = [
    { id: 1, subject: 'Mathematics', score: '85/100', date: 'Yesterday' },
    { id: 2, subject: 'Science', score: '92/100', date: '3 days ago' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm">
          <Calendar size={18} className="text-primary" />
          <span className="text-gray-600">June 15, 2025</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-2">Welcome back, Student!</h2>
        <p className="opacity-90 mb-4">Continue your learning journey with VidyaSetu.</p>
        <div className="flex items-center gap-2 text-sm bg-white/20 w-fit px-3 py-1.5 rounded-full">
          <Clock size={16} />
          <span>Your next class starts in 45 minutes</span>
        </div>
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Video size={20} className="text-blue-600" />
            </div>
            <h3 className="font-medium">Online Classes</h3>
          </div>
          <p className="text-sm text-gray-600">Join live classes or watch recordings</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <FileText size={20} className="text-green-600" />
            </div>
            <h3 className="font-medium">Study Materials</h3>
          </div>
          <p className="text-sm text-gray-600">Access and download learning resources</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <ClipboardList size={20} className="text-purple-600" />
            </div>
            <h3 className="font-medium">Take Tests</h3>
          </div>
          <p className="text-sm text-gray-600">Assess your knowledge and get ranked</p>
        </div>
      </div>

      {/* Upcoming Classes */}
      <div className="bg-white p-5 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Upcoming Classes</h2>
          <button className="text-primary text-sm font-medium">View All</button>
        </div>
        <div className="space-y-3">
          {upcomingClasses.map(classItem => (
            <div key={classItem.id} className="flex items-center gap-4 p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
              <div className="p-3 bg-primary/10 rounded-lg">
                <BookOpen size={20} className="text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{classItem.subject}: {classItem.topic}</h3>
                <p className="text-sm text-gray-600">By {classItem.teacher}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{classItem.time}</p>
                <p className="text-sm text-gray-600">{classItem.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Tests & Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Tests</h2>
          <div className="space-y-3">
            {recentTests.map(test => (
              <div key={test.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <ClipboardList size={18} className="text-orange-600" />
                  </div>
                  <span>{test.subject}</span>
                </div>
                <div className="text-right">
                  <p className="font-medium">{test.score}</p>
                  <p className="text-xs text-gray-600">{test.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Progress</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Mathematics</span>
                <span className="text-sm text-gray-600">85%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Science</span>
                <span className="text-sm text-gray-600">92%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">English</span>
                <span className="text-sm text-gray-600">78%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;