import React, { useState, useEffect } from "react";
import axios from "axios"; // Switch to axios for better error handling
import API_BASE_URL from "../../config";

interface Course {
  _id: string;
  subject: string;
  name: string;
}

interface FeedbackForm {
  _id: string;
  formLink: string;
  course: Course;
  expiryDate: string;
  postDate: string;
}

const StudentFeedback = () => {
  const [feedbackForms, setFeedbackForms] = useState<FeedbackForm[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [submittedForms, setSubmittedForms] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem("submittedFeedbackForms");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    const fetchFeedbackForms = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Unauthorized: Please log in");

        const response = await axios.get(`http://localhost:8080/api/feedback/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Debug the raw response
        console.log("Feedback Forms Response:", response.data);

        // Ensure data is an array
        const formattedData = Array.isArray(response.data) ? response.data : [response.data];
        setFeedbackForms(formattedData);
      } catch (err: any) {
        console.error("Error fetching feedback:", err);
        setError(err.message || "Unable to load feedback forms. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbackForms();
  }, []);

  const handleSubmit = (formId: string) => {
    const updatedSubmissions = { ...submittedForms, [formId]: true };
    setSubmittedForms(updatedSubmissions);
    localStorage.setItem("submittedFeedbackForms", JSON.stringify(updatedSubmissions));
  };

  const isExpired = (expiryDate: string) => {
    return new Date() > new Date(expiryDate);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateDaysLeft = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen p-6 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading feedback forms...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen p-6">
        <div className="max-w-3xl mx-auto p-6 bg-red-50 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-red-800 mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-6">
          <div className="bg-blue-100 p-3 rounded-full mr-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Course Feedback</h1>
        </div>

        {feedbackForms.length > 0 ? (
          <div className="space-y-6">
            {feedbackForms.map((form) => {
              const isFormExpired = isExpired(form.expiryDate);
              const isFormSubmitted = submittedForms[form._id];
              const daysLeft = calculateDaysLeft(form.expiryDate);

              return (
                <div
                  key={form._id}
                  className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          {form.course?.subject || "Unknown Subject"}
                        </span>
                        <h2 className="text-xl font-semibold text-gray-800 mt-2">
                          Course: {form.course?.name || "Unknown Course"}
                        </h2>
                      </div>
                      {isFormExpired ? (
                        <span className="bg-red-100 text-red-800 text-xs font-medium px-3 py-1 rounded-full">
                          Expired
                        </span>
                      ) : (
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
                          {daysLeft} day{daysLeft !== 1 ? "s" : ""} left
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span>Posted: {formatDate(form.postDate)}</span>
                      </div>
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>Expires: {formatDate(form.expiryDate)}</span>
                      </div>
                    </div>

                    <div className="mt-6">
                      {isFormExpired ? (
                        <div className="p-4 bg-red-50 border border-red-100 rounded-lg">
                          <p className="text-red-800 font-medium">
                            This feedback form has expired and is no longer available.
                          </p>
                        </div>
                      ) : isFormSubmitted ? (
                        <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
                          <p className="text-green-800 font-medium">
                            Thank you for submitting your feedback!
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col sm:flex-row gap-4 items-center">
                          <a
                            href={form.formLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg shadow-sm transition duration-150 w-full sm:w-auto"
                            onClick={() => handleSubmit(form._id)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 mr-2"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                            Fill Feedback Form
                          </a>
                          <p className="text-sm text-gray-500">
                            Your feedback helps us improve our courses!
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-xl shadow-md text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-gray-400 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900">No Feedback Forms Available</h3>
            <p className="mt-2 text-gray-600">
              There are no feedback forms to complete at this time. Check back later!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentFeedback;