import React, { useState, useEffect } from "react";
import { Video, Calendar, Clock, User } from "lucide-react";
import axios from "axios";
import API_BASE_URL from "../../config";

interface ClassItem {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  hostName: string;
  meetLink: string;
}

interface FormData {
  title: string;
  date: string;
  time: string;
  duration: string;
}

const TeacherOnlineClasses = () => {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    date: "",
    time: "",
    duration: "",
  });
  const [meetLink, setMeetLink] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authorization token is missing. Please log in again.");
          return;
        }

        const response = await axios.get<ClassItem[]>(
          `${API_BASE_URL}/api/meet/meetings`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setClasses(response.data);
      } catch (error) {
        setError("Failed to fetch meetings. Please try again.");
        console.error(error);
      }
    };

    fetchMeetings();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authorization token is missing. Please log in again.");
      return;
    }

    const { title, date, time, duration } = formData;
    const startTime = new Date(`${date}T${time}:00`).toISOString();
    const endTime = new Date(new Date(startTime).getTime() + parseInt(duration) * 60000).toISOString();

    try {
      const response = await axios.post<{ meetLink: string; hostName: string }>(
        `${API_BASE_URL}/api/meet/create-meet`,
        { token, summary: title, startTime, endTime },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );

      setMeetLink(response.data.meetLink);
      setClasses([
        ...classes,
        { id: classes.length + 1, title, startTime, endTime, hostName: response.data.hostName, meetLink: response.data.meetLink },
      ]);
      setShowForm(false);
      setFormData({ title: "", date: "", time: "", duration: "" });
    } catch (error) {
      setError("Failed to create Google Meet link. Please try again.");
      console.error(error);
    }
  };

  const formatDateTime = (isoString: string) => {
    return new Date(isoString).toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
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
          Google Meet Link:{" "}
          <a href={meetLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
            {meetLink}
          </a>
        </div>
      )}

      <div className="grid gap-6">
        {classes.map((classItem) => (
          <div key={classItem.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold mb-2">{classItem.title}</h3>
            <div className="text-gray-600 space-y-2">
              <div className="flex items-center">
                <User size={16} className="mr-2" />
                <span className="font-medium">Host:</span> {classItem.hostName}
              </div>
              <div className="flex items-center">
                <Calendar size={16} className="mr-2" />
                <span className="font-medium">Start:</span> {formatDateTime(classItem.startTime)}
              </div>
              <div className="flex items-center">
                <Clock size={16} className="mr-2" />
                <span className="font-medium">End:</span> {formatDateTime(classItem.endTime)}
              </div>
            </div>
            <a href={classItem.meetLink} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              <Video size={16} className="mr-2" />
              Join Class
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherOnlineClasses;
