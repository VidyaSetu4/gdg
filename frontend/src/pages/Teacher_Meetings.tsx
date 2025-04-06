import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Loader,
  ExternalLink,
  Video,
  Play,
  Plus,
} from "lucide-react";
import axios from "axios";
import API_BASE_URL from "../../config";

interface ClassItem {
  id: string;
  summary: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  hostName: string;
  meetLink: string;
  isRecorded?: boolean;
}

interface FormData {
  title: string;
  date: string;
  time: string;
  duration: string;
}

const TeacherOnlineClasses = () => {
  const [activeTab, setActiveTab] = useState<"upcoming" | "recorded">("upcoming");
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/meet/meetings`);
        setClasses(res.data.reverse());
      } catch (err: any) {
        setError("Failed to fetch classes.");
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

      const newClass: ClassItem = {
        id: (classes.length + 1).toString(),
        summary: title,
        startTime,
        endTime,
        duration: parseInt(duration),
        hostName: response.data.hostName,
        meetLink: response.data.meetLink,
        isRecorded: false,
      };

      setClasses([...classes, newClass]);
      setMeetLink(response.data.meetLink);
      setShowForm(false);
      setFormData({ title: "", date: "", time: "", duration: "" });
    } catch (error) {
      setError("Failed to create Google Meet link. Please try again.");
      console.error(error);
    }
  };

  const formatDateTime = (isoString: string): { date: string; time: string } => {
    const dateObj = new Date(isoString);
    return {
      date: dateObj.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      time: dateObj.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };
  };

  const filteredClasses = classes.filter((item) =>
    activeTab === "upcoming" ? !item.isRecorded : item.isRecorded
  );

  return (
    <div className="w-full mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          Manage Online Classes
        </h1>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-blue-700 text-white font-medium rounded-lg shadow"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus size={18} />
          <span>Create Class</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          className={`py-3 px-6 font-medium transition-all duration-200 ease-in-out relative ${
            activeTab === "upcoming" ? "text-primary" : "text-gray-500 hover:text-gray-800"
          }`}
          onClick={() => setActiveTab("upcoming")}
        >
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <span>Upcoming</span>
          </div>
          {activeTab === "upcoming" && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-lg"></div>
          )}
        </button>
        <button
          className={`py-3 px-6 font-medium transition-all duration-200 ease-in-out relative ${
            activeTab === "recorded" ? "text-primary" : "text-gray-500 hover:text-gray-800"
          }`}
          onClick={() => setActiveTab("recorded")}
        >
          <div className="flex items-center gap-2">
            <Play size={16} />
            <span>Recorded</span>
          </div>
          {activeTab === "recorded" && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-lg"></div>
          )}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6"
        >
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
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Create Meet Link
          </button>
        </form>
      )}

      {error && <div className="bg-red-100 p-4 rounded-lg text-red-800 mb-6">{error}</div>}

      {/* Loader */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader size={36} className="text-primary animate-spin mb-4" />
          <p className="text-gray-600 font-medium">Loading classes...</p>
        </div>
      ) : filteredClasses.length > 0 ? (
        filteredClasses.map((classItem) => {
          const { date, time } = formatDateTime(classItem.startTime);
          return (
            <div
              key={classItem.id}
              className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex-1 space-y-3">
                  <div className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                    <Calendar size={14} className="text-blue-500" />
                    <span>{date}</span>
                  </div>
                  <div className="inline-flex flex-wrap items-center gap-4 text-sm text-gray-600 ml-3">
                    <div className="flex items-center gap-1">
                      <Clock size={16} className="text-gray-400" />
                      <span>{time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                      <span>{classItem.duration} minutes</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">{classItem.summary}</h3>
                  
                  <div className="text-gray-700">
                    Hosted by 
                    <span className="font-medium text-gray-900"> {classItem.hostName}</span>
                  </div>
                </div>
                <a
                  href={classItem.meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200 shadow-sm hover:shadow whitespace-nowrap"
                >
                  {activeTab === "upcoming" ? (
                    <>
                      <Video size={18} />
                      <span>Join Class</span>
                    </>
                  ) : (
                    <>
                      <Play size={18} />
                      <span>Watch Recording</span>
                    </>
                  )}
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          );
        })
      ) : (
        <div className="bg-gray-50 rounded-xl p-12 text-center text-gray-600 font-medium">
          {activeTab === "upcoming"
            ? "No upcoming classes scheduled yet."
            : "No recorded classes available."}
        </div>
      )}
    </div>
  );
};

export default TeacherOnlineClasses;
