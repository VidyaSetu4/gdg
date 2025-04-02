import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Video, 
  FileText, 
  MessageSquare, 
  ClipboardList, 
  BarChart2, 
  Calendar,
  Clock,
  BookOpen,
  LogOut,
  ChevronRight,
  Award,
  Loader2,
  AlertCircle
} from 'lucide-react';
import API_BASE_URL from "../../config";

interface DashboardProps {
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

interface Submission {
  saqId: string;
  title: string;
  course: {
    name: string;
    subject: string;
  };
  attemptsAllowed: number;
  attemptsUsed: number;
  submittedAt: string;
  answers: {
    questionId: string;
    answerText: string;
    score: string | number;
    feedback: string;
  }[];
  totalScore: number;
  percentageEarned?: number;
}

const Dashboard: React.FC<DashboardProps> = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const upcomingClasses = [
    { id: 1, subject: 'Mathematics', topic: 'Algebra Basics', time: '10:00 AM', date: 'Today', teacher: 'Dr. Sharma' },
    { id: 2, subject: 'Science', topic: 'Cell Structure', time: '2:00 PM', date: 'Today', teacher: 'Mrs. Gupta' },
    { id: 3, subject: 'English', topic: 'Grammar Rules', time: '11:30 AM', date: 'Tomorrow', teacher: 'Mr. Patel' },
  ];

  const recentTests = [
    { id: 1, subject: 'Mathematics', score: '85/100', date: 'Yesterday' },
    { id: 2, subject: 'Science', score: '92/100', date: '3 days ago' },
  ];

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Unauthorized: Please log in");
          navigate("/login");
          return;
        }

        const response = await axios.get<{ submissions: Submission[] }>(
          `${API_BASE_URL}/api/saq/student/submissions`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Calculate percentage earned for each submission
        const processedSubmissions = response.data.submissions.map(sub => {
          const questionCount = sub.answers.length;
          
          // Calculate sum of all question scores
          const totalMarksEarned = sub.answers.reduce((sum, answer) => {
            const score = typeof answer.score === 'string' ? parseFloat(answer.score) : answer.score;
            return sum + score;
          }, 0);
          
          // Calculate percentage as (totalMarksEarned / (questionCount * 10)) * 100
          const percentageEarned = questionCount > 0 
            ? (totalMarksEarned / (questionCount * 10)) * 100 
            : 0;
          
          return {
            ...sub,
            percentageEarned: Math.round(percentageEarned * 10) / 10 // Round to 1 decimal place
          };
        });

        setSubmissions(processedSubmissions);
      } catch (err: any) {
        if (err.response?.status === 401) {
          setError("Session expired. Please log in again.");
          navigate("/login");
        } else {
          setError("Failed to fetch submissions");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [navigate]);

  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('users');

    // Update authentication state
    setIsAuthenticated(false);
    // Redirect to LandingPage
    navigate('/');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm">
          <Calendar size={18} className="text-primary" />
          <span className="text-gray-600">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
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
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-2">Welcome back, Student</h2>
        <p className="opacity-90 mb-4">Continue your learning journey with VidyaSetu.</p>
        <div className="flex items-center gap-2 text-sm bg-white/20 w-fit px-3 py-1.5 rounded-full">
          <Clock size={16} />
          <span>Your next class starts in 45 minutes</span>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-white p-5 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <BarChart2 className="w-5 h-5 mr-2 text-blue-500" />
            <h2 className="text-lg font-semibold text-gray-800">Your Performance Overview</h2>
          </div>
          <button 
            onClick={() => navigate("/student/submissions")}
            className="flex items-center text-blue-600 text-sm font-medium hover:underline"
          >
            View All Submissions
            <ChevronRight size={16} />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-600">Loading your performance data...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start">
            <AlertCircle className="w-5 h-5 mr-2 mt-0.5" />
            <div>
              <p className="font-medium">Error: {error}</p>
              <p className="text-sm mt-1">Please try refreshing the page or log in again.</p>
            </div>
          </div>
        ) : (
          <>
            {submissions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-md">
                  <p className="text-sm text-blue-700 mb-1">Average Percentage</p>
                  <p className="text-2xl font-bold">
                    {submissions.length > 0 
                      ? (submissions.reduce((acc, sub) => acc + (sub.percentageEarned || 0), 0) / submissions.length).toFixed(1)
                      : "0"}%
                  </p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-md">
                  <p className="text-sm text-green-700 mb-1">Highest Percentage</p>
                  <p className="text-2xl font-bold">
                    {submissions.length > 0 
                      ? Math.max(...submissions.map(sub => sub.percentageEarned || 0)).toFixed(1)
                      : "0"}%
                  </p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-md">
                  <p className="text-sm text-purple-700 mb-1">Tests Completed</p>
                  <p className="text-2xl font-bold">{submissions.length}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="bg-blue-50 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Award className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-xl font-medium text-gray-700 mb-2">No Test Data Available</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-4">
                  You haven't completed any tests yet. Take tests to track your performance.
                </p>
                <button 
                  onClick={() => navigate("/tests")} 
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Take a Test
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div 
          onClick={() => navigate("/onlineClasses")}
          className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Video size={20} className="text-blue-600" />
            </div>
            <h3 className="font-medium">Online Classes</h3>
          </div>
          <p className="text-sm text-gray-600">Join live classes or watch recordings</p>
        </div>
        
        <div 
          onClick={() => navigate("/materials")}
          className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <FileText size={20} className="text-green-600" />
            </div>
            <h3 className="font-medium">Study Materials</h3>
          </div>
          <p className="text-sm text-gray-600">Access and download learning resources</p>
        </div>
        
        <div 
          onClick={() => navigate("/tests")}
          className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        >
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
          <button 
            onClick={() => navigate("/onlineClasses")}
            className="flex items-center text-blue-600 text-sm font-medium hover:underline"
          >
            View All
            <ChevronRight size={16} />
          </button>
        </div>
        <div className="space-y-3">
          {upcomingClasses.map(classItem => (
            <div 
              key={classItem.id} 
              onClick={() => navigate("/onlineClasses")}
              className="flex items-center gap-4 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpen size={20} className="text-blue-600" />
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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Recent Tests</h2>
            <button 
              onClick={() => navigate("/student/submissions")} 
              className="flex items-center text-blue-600 text-sm font-medium hover:underline"
            >
              View All
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="space-y-3">
            {recentTests.map(test => (
              <div 
                key={test.id} 
                onClick={() => navigate("/student/submissions")}
                className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Your Progress</h2>
            <button 
              onClick={() => navigate("/progress")}
              className="flex items-center text-blue-600 text-sm font-medium hover:underline"
            >
              Details
              <ChevronRight size={16} />
            </button>
          </div>
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

      {/* Additional Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          onClick={() => navigate("/chatbot")}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-5 rounded-lg shadow-sm hover:shadow-md transition cursor-pointer"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <MessageSquare size={20} className="text-white" />
            </div>
            <h3 className="font-medium">AI Chatbot Assistant</h3>
          </div>
          <p className="text-sm opacity-90">Get instant help with your studies and assignments</p>
        </div>
        
        <div 
          onClick={() => navigate("/profile")}
          className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-5 rounded-lg shadow-sm hover:shadow-md transition cursor-pointer"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Award size={20} className="text-white" />
            </div>
            <h3 className="font-medium">Your Profile</h3>
          </div>
          <p className="text-sm opacity-90">View and update your personal information</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;