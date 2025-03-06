import React, { useState } from 'react';
import { Video, Calendar, Clock, Download } from 'lucide-react';

const TeacherOnlineClasses = () => {
  const [classes] = useState([
    {
      id: 1,
      title: 'Mathematics - Algebra Basics',
      date: '2024-03-20',
      time: '10:00 AM',
      meetLink: 'https://meet.google.com/abc-defg-hij',
      recording: 'https://example.com/recording1.mp4',
    },
    // Add more classes as needed
  ]);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Online Classes</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
          Schedule New Class
        </button>
      </div>

      <div className="grid gap-6">
        {classes.map((classItem) => (
          <div
            key={classItem.id}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">{classItem.title}</h3>
                <div className="flex items-center space-x-4 text-gray-600">
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-2" />
                    {classItem.date}
                  </div>
                  <div className="flex items-center">
                    <Clock size={16} className="mr-2" />
                    {classItem.time}
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <a
                  href={classItem.meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Video size={16} className="mr-2" />
                  Join Class
                </a>
                {classItem.recording && (
                  <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                    <Download size={16} className="mr-2" />
                    Recording
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherOnlineClasses;