import React, { useState } from 'react';
import { ClipboardList, Clock, Calendar, Trophy, BarChart2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const Tests = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  
  const upcomingTests = [
    { 
      id: 1, 
      subject: 'Mathematics', 
      topic: 'Algebra and Equations', 
      date: 'June 18, 2025',
      time: '10:00 AM', 
      duration: '45 minutes',
      totalMarks: 100,
      status: 'upcoming'
    },
    { 
      id: 2, 
      subject: 'Science', 
      topic: 'Cell Biology', 
      date: 'June 20, 2025',
      time: '2:00 PM', 
      duration: '60 minutes',
      totalMarks: 100,
      status: 'upcoming'
    },
    { 
      id: 3, 
      subject: 'English', 
      topic: 'Grammar and Comprehension', 
      date: 'June 25, 2025',
      time: '11:30 AM', 
      duration: '45 minutes',
      totalMarks: 50,
      status: 'upcoming'
    },
  ];

  const completedTests = [
    { 
      id: 1, 
      subject: 'Mathematics', 
      topic: 'Number Systems', 
      date: 'June 10, 2025',
      score: 85,
      totalMarks: 100,
      rank: 12,
      totalParticipants: 250,
      status: 'completed'
    },
    { 
      id: 2, 
      subject: 'Science', 
      topic: 'Physics Basics', 
      date: 'June 5, 2025',
      score: 92,
      totalMarks: 100,
      rank: 5,
      totalParticipants: 250,
      status: 'completed'
    },
    { 
      id: 3, 
      subject: 'History', 
      topic: 'Ancient Civilizations', 
      date: 'May 28, 2025',
      score: 78,
      totalMarks: 50,
      rank: 35,
      totalParticipants: 250,
      status: 'completed'
    },
  ];

  const nationalRankings = [
    { id: 1, name: 'Rahul Sharma', school: 'Delhi Public School, Delhi', score: 98, rank: 1 },
    { id: 2, name: 'Priya Patel', school: 'St. Xavier\'s High School, Mumbai', score: 97, rank: 2 },
    { id: 3, name: 'Arjun Singh', school: 'Kendriya Vidyalaya, Bangalore', score: 96, rank: 3 },
    { id: 4, name: 'Ananya Reddy', school: 'DAV Public School, Hyderabad', score: 95, rank: 4 },
    { id: 5, name: 'Vikram Mehta', school: 'City Montessori School, Lucknow', score: 94, rank: 5 },
    { id: 6, name: 'You', school: 'Your School', score: 92, rank: 6, isCurrentUser: true },
    { id: 7, name: 'Neha Gupta', school: 'Ryan International School, Chandigarh', score: 91, rank: 7 },
    { id: 8, name: 'Rohan Kumar', school: 'DPS RK Puram, Delhi', score: 90, rank: 8 },
    { id: 9, name: 'Sanya Joshi', school: 'Bhavan\'s Vidya Mandir, Kochi', score: 89, rank: 9 },
    { id: 10, name: 'Aditya Verma', school: 'The Bishop\'s School, Pune', score: 88, rank: 10 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Tests & Assessments</h1>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === 'upcoming'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-600 hover:text-gray-800'
          }`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming Tests
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === 'completed'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-600 hover:text-gray-800'
          }`}
          onClick={() => setActiveTab('completed')}
        >
          Completed Tests
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === 'rankings'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-600 hover:text-gray-800'
          }`}
          onClick={() => setActiveTab('rankings')}
        >
          National Rankings
        </button>
      </div>
      
      {/* Upcoming Tests */}
      {activeTab === 'upcoming' && (
        <div className="space-y-4">
          {upcomingTests.map(test => (
            <div key={test.id} className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <Calendar size={14} />
                    <span>{test.date}</span>
                    <span className="mx-1">•</span>
                    <Clock size={14} />
                    <span>{test.time}</span>
                    <span className="mx-1">•</span>
                    <span>{test.duration}</span>
                  </div>
                  <h3 className="text-lg font-medium">{test.subject}: {test.topic}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <span>Total Marks: {test.totalMarks}</span>
                  </div>
                </div>
                <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                  Take Test
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Completed Tests */}
      {activeTab === 'completed' && (
        <div className="space-y-4">
          {completedTests.map(test => (
            <div key={test.id} className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <Calendar size={14} />
                    <span>{test.date}</span>
                  </div>
                  <h3 className="text-lg font-medium">{test.subject}: {test.topic}</h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm mt-2">
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle size={16} />
                      <span>Score: {test.score}/{test.totalMarks}</span>
                    </div>
                    <div className="flex items-center gap-1 text-blue-600">
                      <Trophy size={16} />
                      <span>Rank: {test.rank}/{test.totalParticipants}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                    View Report
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* National Rankings */}
      {activeTab === 'rankings' && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 bg-primary/5 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Trophy size={20} className="text-primary" />
              <h2 className="font-medium">National Rankings - Science Test (June 5, 2025)</h2>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Rank</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Student</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">School</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {nationalRankings.map(student => (
                  <tr 
                    key={student.id} 
                    className={`${student.isCurrentUser ? 'bg-primary/5' : 'hover:bg-gray-50'}`}
                  >
                    <td className="px-4 py-3 text-sm">
                      {student.rank <= 3 ? (
                        <div className="flex items-center gap-1">
                          <Trophy size={16} className="text-yellow-500" />
                          <span className="font-medium">{student.rank}</span>
                        </div>
                      ) : (
                        <span>{student.rank}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${student.isCurrentUser ? 'text-primary' : ''}`}>
                          {student.name}
                        </span>
                        {student.isCurrentUser && (
                          <span className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">You</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{student.school}</td>
                    <td className="px-4 py-3 text-sm text-right font-medium">{student.score}/100</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tests;