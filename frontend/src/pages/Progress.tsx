import React, { useState } from 'react';
import { 
  BarChart2, 
  TrendingUp, 
  Calendar, 
  BookOpen, 
  CheckCircle, 
  Clock, 
  Award,
  ClipboardList,
  Video,
  FileText
} from 'lucide-react';

const Progress = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  
  const subjects = [
    { id: 'math', name: 'Mathematics', progress: 85, color: 'bg-blue-500' },
    { id: 'science', name: 'Science', progress: 92, color: 'bg-green-500' },
    { id: 'english', name: 'English', progress: 78, color: 'bg-purple-500' },
    { id: 'history', name: 'History', progress: 65, color: 'bg-orange-500' },
    { id: 'geography', name: 'Geography', progress: 70, color: 'bg-pink-500' },
  ];
  
  const recentActivities = [
    { id: 1, type: 'test', subject: 'Science', detail: 'Completed Physics Test', score: '92/100', date: 'June 5, 2025' },
    { id: 2, type: 'class', subject: 'Mathematics', detail: 'Attended Algebra Class', duration: '45 minutes', date: 'June 4, 2025' },
    { id: 3, type: 'material', subject: 'English', detail: 'Downloaded Grammar Notes', date: 'June 3, 2025' },
    { id: 4, type: 'test', subject: 'History', detail: 'Completed Ancient Civilizations Test', score: '78/100', date: 'May 28, 2025' },
  ];
  
  const achievements = [
    { id: 1, title: 'Science Star', description: 'Scored 90+ in 3 consecutive Science tests', date: 'June 5, 2025', icon: <Award size={20} className="text-yellow-500" /> },
    { id: 2, title: 'Perfect Attendance', description: 'Attended all classes for 30 days', date: 'May 30, 2025', icon: <CheckCircle size={20} className="text-green-500" /> },
    { id: 3, title: 'Quick Learner', description: 'Completed 10 lessons ahead of schedule', date: 'May 15, 2025', icon: <TrendingUp size={20} className="text-blue-500" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Your Progress</h1>
        
        <div className="flex items-center bg-white rounded-lg shadow-sm p-1">
          <button
            className={`px-3 py-1.5 text-sm rounded-md ${
              selectedPeriod === 'week' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setSelectedPeriod('week')}
          >
            Week
          </button>
          <button
            className={`px-3 py-1.5 text-sm rounded-md ${
              selectedPeriod === 'month' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setSelectedPeriod('month')}
          >
            Month
          </button>
          <button
            className={`px-3 py-1.5 text-sm rounded-md ${
              selectedPeriod === 'year' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setSelectedPeriod('year')}
          >
            Year
          </button>
        </div>
      </div>
      
      {/* Overall Progress */}
      <div className="bg-white p-5 rounded-lg shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <BarChart2 size={20} className="text-primary" />
          <h2 className="text-lg font-semibold">Overall Progress</h2>
        </div>
        
        <div className="space-y-4">
          {subjects.map(subject => (
            <div key={subject.id}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">{subject.name}</span>
                <span className="text-sm text-gray-600">{subject.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`${subject.color} h-2.5 rounded-full`} 
                  style={{ width: `${subject.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Average Progress</span>
            <span className="text-lg font-semibold text-primary">78%</span>
          </div>
        </div>
      </div>
      
      {/* Recent Activities & Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white p-5 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={20} className="text-primary" />
            <h2 className="text-lg font-semibold">Recent Activities</h2>
          </div>
          
          <div className="space-y-4">
            {recentActivities.map(activity => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  activity.type === 'test' ? 'bg-purple-100' : 
                  activity.type === 'class' ? 'bg-blue-100' : 'bg-green-100'
                }`}>
                  {activity.type === 'test' ? (
                    <ClipboardList size={18} className="text-purple-600" />
                  ) : activity.type === 'class' ? (
                    <Video size={18} className="text-blue-600" />
                  ) : (
                    <FileText size={18} className="text-green-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{activity.detail}</h3>
                    <span className="text-xs text-gray-500">{activity.date}</span>
                  </div>
                  <p className="text-sm text-gray-600">{activity.subject}</p>
                  {activity.score && (
                    <p className="text-sm font-medium text-purple-600 mt-1">Score: {activity.score}</p>
                  )}
                  {activity.duration && (
                    <p className="text-sm text-gray-600 mt-1">Duration: {activity.duration}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Achievements */}
        <div className="bg-white p-5 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Award size={20} className="text-primary" />
            <h2 className="text-lg font-semibold">Achievements</h2>
          </div>
          
          <div className="space-y-4">
            {achievements.map(achievement => (
              <div key={achievement.id} className="flex items-start gap-3 p-3 border border-gray-100 rounded-lg">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  {achievement.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{achievement.title}</h3>
                    <span className="text-xs text-gray-500">{achievement.date}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-4 py-2 text-primary font-medium border border-primary rounded-lg hover:bg-primary/5 transition-colors">
            View All Achievements
          </button>
        </div>
      </div>
      
      {/* Learning Time */}
      <div className="bg-white p-5 rounded-lg shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Clock size={20} className="text-primary" />
          <h2 className="text-lg font-semibold">Learning Time</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-100 rounded-lg text-center">
            <p className="text-sm text-gray-600 mb-1">This Week</p>
            <p className="text-2xl font-bold text-primary">12h 30m</p>
            <p className="text-xs text-green-600 mt-1">↑ 15% from last week</p>
          </div>
          
          <div className="p-4 border border-gray-100 rounded-lg text-center">
            <p className="text-sm text-gray-600 mb-1">This Month</p>
            <p className="text-2xl font-bold text-primary">45h 15m</p>
            <p className="text-xs text-green-600 mt-1">↑ 8% from last month</p>
          </div>
          
          <div className="p-4 border border-gray-100 rounded-lg text-center">
            <p className="text-sm text-gray-600 mb-1">Total</p>
            <p className="text-2xl font-bold text-primary">320h 45m</p>
            <p className="text-xs text-gray-600 mt-1">Since joining</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;