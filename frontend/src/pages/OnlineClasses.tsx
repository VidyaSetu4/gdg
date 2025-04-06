import React, { useEffect, useState } from "react";
import { Video, Calendar, Clock, ExternalLink, Play, Loader } from "lucide-react";
import API_BASE_URL from "../../config";

interface ClassItem {
  _id: string;
  summary: string;
  startTime: string;
  duration: number;
  hostName: string;
  meetLink: string;
}

const OnlineClasses: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"upcoming" | "recorded">("upcoming");
  const [upcomingClasses, setUpcomingClasses] = useState<ClassItem[]>([]);
  const [recordedClasses, setRecordedClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/meet/meetings`);

        if (!response.ok) {
          throw new Error("Failed to fetch meetings");
        }

        const data = await response.json();
        console.log("Fetched Meetings:", data);
        const sortedData = (data || []).sort(
          (a: ClassItem, b: ClassItem) =>
            new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
        );
        
        setUpcomingClasses(sortedData|| []);
        setRecordedClasses(sortedData|| []);
        
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, []);

  // Function to format date and time
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

  return (
    <div className="w-full mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          Online Classes
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          className={`py-3 px-6 font-medium transition-all duration-200 ease-in-out relative ${
            activeTab === "upcoming"
              ? "text-primary"
              : "text-gray-500 hover:text-gray-800"
          }`}
          onClick={() => setActiveTab("upcoming")}
        >
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <span>Upcoming Classes</span>
          </div>
          {activeTab === "upcoming" && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-lg"></div>
          )}
        </button>
        <button
          className={`py-3 px-6 font-medium transition-all duration-200 ease-in-out relative ${
            activeTab === "recorded"
              ? "text-primary"
              : "text-gray-500 hover:text-gray-800"
          }`}
          onClick={() => setActiveTab("recorded")}
        >
          <div className="flex items-center gap-2">
            <Play size={16} />
            <span>Recorded Classes</span>
          </div>
          {activeTab === "recorded" && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-lg"></div>
          )}
        </button>
      </div>

      {/* Show Error */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <div className="flex items-center">
            <div className="flex-shrink-0 text-red-500">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Show Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader size={36} className="text-primary animate-spin mb-4" />
          <p className="text-gray-600 font-medium">Loading classes...</p>
        </div>
      )}

      {/* Upcoming Classes */}
      {activeTab === "upcoming" && !loading && !error && (
        <div className="space-y-6">
          {upcomingClasses.length > 0 ? (
            upcomingClasses.map((classItem) => {
              const { date, time } = formatDateTime(classItem.startTime);
              return (
                <div
                  key={classItem._id}
                  className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex-1 space-y-3">
                      <div className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                        <Calendar size={14} className="text-blue-500" />
                        <span>{date}</span>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-gray-800">
                        {classItem.summary}
                      </h3>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock size={16} className="text-gray-400" />
                          <span>{time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                          <span>{classItem.duration} minutes</span>
                        </div>
                      </div>
                      
                      <div className="text-gray-700">
                        Hosted by <span className="font-medium text-gray-900">{classItem.hostName}</span>
                      </div>
                    </div>
                    
                    <a
                      href={classItem.meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200 shadow-sm hover:shadow whitespace-nowrap"
                    >
                      <Video size={18} />
                      <span>Join Class</span>
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-gray-50 rounded-xl p-12 text-center">
              <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">No Upcoming Classes</h3>
              <p className="text-gray-500">Check back later for scheduled classes</p>
            </div>
          )}
        </div>
      )}

      {/* Recorded Classes */}
      {activeTab === "recorded" && !loading && !error && (
        <div className="grid gap-6 md:grid-cols-2">
          {recordedClasses.length > 0 ? (
            recordedClasses.map((classItem) => (
              <div
                key={classItem._id}
                className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-gray-100 rounded-lg p-3 text-primary">
                    <Play size={24} fill="currentColor" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {classItem.summary || "Recorded Session"}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Hosted by {classItem.hostName}
                    </p>
                    <a
                      href={classItem.meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium"
                    >
                      <span>Watch Recording</span>
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 bg-gray-50 rounded-xl p-12 text-center">
              <Play size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">No Recorded Classes Available</h3>
              <p className="text-gray-500">Recordings will appear here after classes are completed</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OnlineClasses;