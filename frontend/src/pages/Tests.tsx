import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../../config";

// Define the structure of a single SAQ test
interface SAQTest {
  _id: string;
  title: string;
  course: {
    _id: string;
    name: string;
    subject: string;
  };
  teacher: string;
  questions: {
    questionText: string;
    _id: string;
  }[];
  attemptsAllowed: number;
  attemptsUsed: number;
  attemptsRemaining: number;
  canAttempt: boolean;
  createdAt: string;
}

const AvailableSAQTests = () => {
  const [tests, setTests] = useState<SAQTest[]>([]); // Explicitly type tests as an array of SAQTest
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Unauthorized: No token provided");
          setLoading(false);
          return;
        }

        const response = await axios.get<{ tests: SAQTest[] }>(
          `${API_BASE_URL}/api/saq/student/available-tests`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setTests(response.data.tests);
      } catch (err) {
        setError("Failed to fetch available tests");
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  const handleAttempt = (testId: string) => { // Explicitly type testId as string
    navigate(`/attempt-saq/${testId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 pb-4 border-b border-gray-200">
        Available SAQ Tests
      </h2>
      <div className="flex justify-end p-4"> {/* Container div for positioning and padding */}
  <button
    className="flex items-center space-x-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors duration-200"
    onClick={() => navigate("/student/submissions")}
  >
    <span>View All Submissions</span>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-chevron-right"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  </button>
</div>      
      {tests.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="mt-4 text-gray-600 text-lg">No tests available for your enrolled courses.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tests.map((test) => (
            <div
              key={test._id}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:scale-102 border border-gray-100"
            >
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">{test.title}</h3>
                <div className="flex items-center text-gray-600 text-sm mb-4">
                  <span className="bg-blue-100 text-blue-800 rounded-full px-3 py-1">
                    {test.course.subject}
                  </span>
                  <span className="mx-2">•</span>
                  <span>{formatDate(test.createdAt)}</span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Course:</span>
                    <span className="font-medium text-gray-800">{test.course.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Teacher:</span>
                    <span className="font-medium text-gray-800">{test.teacher}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Questions:</span>
                    <span className="font-medium text-gray-800">{test.questions.length}</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      Attempts: {test.attemptsUsed}/{test.attemptsAllowed}
                    </span>
                    <span className="text-sm font-medium text-green-600">
                      {test.attemptsRemaining} remaining
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        test.attemptsRemaining > 0 ? "bg-green-500" : "bg-red-500"
                      }`}
                      style={{
                        width: `${(test.attemptsUsed / test.attemptsAllowed) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-100 p-4 bg-gray-50">
                <button
                  className={`w-full py-2 px-4 rounded font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                    test.canAttempt
                      ? "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  disabled={!test.canAttempt}
                  onClick={() => handleAttempt(test._id)}
                >
                  {test.canAttempt ? "Attempt Now" : "No Attempts Left"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AvailableSAQTests;