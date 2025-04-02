import React, { useState } from 'react';
import { Video, Calendar, Clock, Download } from 'lucide-react';
import axios from 'axios';
import API_BASE_URL from "../../config";

interface ClassItem {
  id: number;
  title: string;
  date: string;
  time: string;
  meetLink: string;
  recording?: string;
}

interface FormData {
  title: string;
  date: string;
  time: string;
  duration: string;
}

const TeacherOnlineClasses = () => {
  const [classes, setClasses] = useState<ClassItem[]>([
    {
      id: 1,
      title: 'Mathematics - Algebra Basics',
      date: '2024-03-20',
      time: '10:00 AM',
      meetLink: 'https://meet.google.com/abc-defg-hij',
      recording: 'https://example.com/recording1.mp4',
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    date: '',
    time: '',
    duration: '',
  });
  const [meetLink, setMeetLink] = useState('');
  const [error, setError] = useState('');
  const [token, setToken] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(''); // Reset error before making the request
    setToken(localStorage.getItem('token') || '');

    const {title, date, time, duration } = formData;
    const startTime = new Date(`${date}T${time}`).toISOString();
    const endTime = new Date(new Date(startTime).getTime() + parseInt(duration) * 60000).toISOString();

    try {
      const response = await axios.post<{ meetLink: string }>(`${API_BASE_URL}/api/meet/create-meet`, {
        token,
        summary: title,
        startTime,
        endTime,
      });

      setMeetLink(response.data.meetLink);
      setClasses([...classes, { id: classes.length + 1, ...formData, meetLink: response.data.meetLink }]);
      setShowForm(false);
      setFormData({ title: '', date: '', time: '', duration: '' }); // Clear form after submission
    } catch (error) {
      setError('Failed to create Google Meet link. Please try again.');
      console.error('Error creating Google Meet link:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Online Classes</h1>
        <button
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          onClick={() => setShowForm(!showForm)}
        >
          Schedule New Class
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Time</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
            Create Meet Link
          </button>
        </form>
      )}

      {error && <div className="bg-red-100 p-4 rounded-lg text-red-800 mb-6">{error}</div>}

      {meetLink && (
        <div className="bg-green-100 p-4 rounded-lg text-green-800 mb-6">
          Google Meet Link: <a href={meetLink} target="_blank" rel="noopener noreferrer">{meetLink}</a>
        </div>
      )}

      <div className="grid gap-6">
        {classes.map((classItem) => (
          <div key={classItem.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
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
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherOnlineClasses;
