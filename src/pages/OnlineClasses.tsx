import React, { useState } from 'react';
import { Video, Calendar, Clock, ExternalLink, Download, Play, User } from 'lucide-react';

const OnlineClasses = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  
  const upcomingClasses = [
    { 
      id: 1, 
      subject: 'Mathematics', 
      topic: 'Algebra Basics', 
      time: '10:00 AM', 
      date: 'Today', 
      teacher: 'Dr. Sharma',
      duration: '45 minutes',
      meetLink: 'https://meet.google.com/abc-defg-hij'
    },
    { 
      id: 2, 
      subject: 'Science', 
      topic: 'Cell Structure', 
      time: '2:00 PM', 
      date: 'Today', 
      teacher: 'Mrs. Gupta',
      duration: '60 minutes',
      meetLink: 'https://meet.google.com/xyz-uvwx-yz'
    },
    { 
      id: 3, 
      subject: 'English', 
      topic: 'Grammar Rules', 
      time: '11:30 AM', 
      date: 'Tomorrow', 
      teacher: 'Mr. Patel',
      duration: '45 minutes',
      meetLink: 'https://meet.google.com/lmn-opqr-stu'
    },
  ];

  const recordedClasses = [
    { 
      id: 1, 
      subject: 'Mathematics', 
      topic: 'Introduction to Algebra', 
      date: 'June 10, 2025', 
      teacher: 'Dr. Sharma',
      duration: '45 minutes',
      thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      views: 245
    },
    { 
      id: 2, 
      subject: 'Science', 
      topic: 'Introduction to Biology', 
      date: 'June 8, 2025', 
      teacher: 'Mrs. Gupta',
      duration: '60 minutes',
      thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      views: 189
    },
    { 
      id: 3, 
      subject: 'English', 
      topic: 'Basic Grammar', 
      date: 'June 5, 2025', 
      teacher: 'Mr. Patel',
      duration: '45 minutes',
      thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      views: 312
    },
    { 
      id: 4, 
      subject: 'History', 
      topic: 'Ancient Civilizations', 
      date: 'June 3, 2025', 
      teacher: 'Ms. Reddy',
      duration: '50 minutes',
      thumbnail: 'https://images.unsplash.com/photo-1461360228754-6e81c478b882?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      views: 178
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Online Classes</h1>
      
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
          Upcoming Classes
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === 'recorded'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-600 hover:text-gray-800'
          }`}
          onClick={() => setActiveTab('recorded')}
        >
          Recorded Classes
        </button>
      </div>
      
      {/* Upcoming Classes */}
      {activeTab === 'upcoming' && (
        <div className="space-y-4">
          {upcomingClasses.map(classItem => (
            <div key={classItem.id} className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <Calendar size={14} />
                    <span>{classItem.date}</span>
                    <span className="mx-1">•</span>
                    <Clock size={14} />
                    <span>{classItem.time}</span>
                    <span className="mx-1">•</span>
                    <span>{classItem.duration}</span>
                  </div>
                  <h3 className="text-lg font-medium">{classItem.subject}: {classItem.topic}</h3>
                  <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                    <User size={14} />
                    <span>{classItem.teacher}</span>
                  </div>
                </div>
                <a 
                  href={classItem.meetLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Video size={18} />
                  <span>Join Class</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Recorded Classes */}
      {activeTab === 'recorded' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recordedClasses.map(classItem => (
            <div key={classItem.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
              <div className="relative">
                <img 
                  src={classItem.thumbnail} 
                  alt={classItem.topic} 
                  className="w-full h-40 object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <button className="p-3 bg-white rounded-full">
                    <Play size={24} className="text-primary" />
                  </button>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {classItem.duration}
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                  <span>{classItem.subject}</span>
                  <span>{classItem.date}</span>
                </div>
                <h3 className="font-medium mb-2">{classItem.topic}</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <User size={14} />
                    <span>{classItem.teacher}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">{classItem.views} views</span>
                    <button className="text-primary hover:text-primary/80">
                      <Download size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OnlineClasses;