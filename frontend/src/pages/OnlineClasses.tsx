import React, { useEffect, useState } from "react";
import { Video, Calendar, Clock, ExternalLink } from "lucide-react";
import API_BASE_URL from "../../config";




interface ClassItem {
  _id: string;
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

        setUpcomingClasses(data || []);
        setRecordedClasses(data|| []);
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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Online Classes</h1>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === "upcoming"
              ? "text-primary border-b-2 border-primary"
              : "text-gray-600 hover:text-gray-800"
          }`}
          onClick={() => setActiveTab("upcoming")}
        >
          Upcoming Classes
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === "recorded"
              ? "text-primary border-b-2 border-primary"
              : "text-gray-600 hover:text-gray-800"
          }`}
          onClick={() => setActiveTab("recorded")}
        >
          Recorded Classes
        </button>
      </div>

      {/* Show Error */}
      {error && <div className="text-red-500">{error}</div>}

      {/* Show Loading */}
      {loading && <div className="text-gray-600">Loading classes...</div>}

      {/* Upcoming Classes */}
      {activeTab === "upcoming" && !loading && !error && (
        <div className="space-y-4">
          {upcomingClasses.length > 0 ? (
            upcomingClasses.map((classItem) => {
              const { date, time } = formatDateTime(classItem.startTime);
              return (
                <div
                  key={classItem._id}
                  className="bg-white p-5 rounded-lg shadow-sm border border-gray-100"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <Calendar size={14} />
                        <span>{date}</span>
                        <span className="mx-1">•</span>
                        <Clock size={14} />
                        <span>{time}</span>
                        <span className="mx-1">•</span>
                        <span>{classItem.duration} min</span>
                      </div>
                      <h3 className="text-lg font-medium">
                        Hosted by {classItem.hostName}
                      </h3>
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
              );
            })
          ) : (
            <div className="text-gray-600">No upcoming classes available</div>
          )}
        </div>
      )}

      {/* Recorded Classes */}
      {activeTab === "recorded" && !loading && !error && (
        <div className="text-gray-600">
          {recordedClasses.length > 0 ? (
            recordedClasses.map((classItem) => (
              <div
                key={classItem._id}
                className="bg-white p-5 rounded-lg shadow-sm border border-gray-100"
              >
                <h3 className="text-lg font-medium">{classItem.hostName}</h3>
                <a
                  href={classItem.meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Watch Recording
                </a>
              </div>
            ))
          ) : (
            <div>No recorded classes available</div>
          )}
        </div>
      )}
    </div>
  );
};

export default OnlineClasses;
