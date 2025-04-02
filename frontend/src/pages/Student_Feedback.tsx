import React, { useState, useEffect } from "react";
import API_BASE_URL from "../../config";

interface FeedbackForm {
  formLink: string;
  expiryDate: string;
  postDate: string;
}

const Student_Feedback = () => {
  const [feedbackForms, setFeedbackForms] = useState<FeedbackForm[]>([]);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(localStorage.getItem("hasSubmitted") === "true");

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/feedback/latest`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.formLink) {
          setFeedbackForms([data]); // ✅ Wrap object in an array
        } else {
          setFeedbackForms([]); // ✅ Ensure it's an empty array if no form exists
        }
      })
      .catch((err) => console.error("Error fetching feedback:", err));
  }, []);

  const handleSubmit = () => {
    setHasSubmitted(true);
    localStorage.setItem("hasSubmitted", "true");
  };

  const checkExpiry = (expiryDate: string) => {
    const currentDate = new Date();
    const expiry = new Date(expiryDate);
    return currentDate > expiry;
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">📋 Student Feedback</h2>

      {feedbackForms.length > 0 ? (
        feedbackForms.map((feedback, index) => (
          <div key={index} className="p-6 bg-gray-50 rounded-lg shadow-md mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Fill out the Feedback</h3>
            <p className="text-sm text-gray-500">Please complete the feedback form before it expires.</p>
            <div className="flex justify-between items-center mt-4">
              <p className="text-sm text-gray-500">Form Expiry Date:</p>
              <p className="font-medium">{new Date(feedback.expiryDate).toLocaleDateString()}</p>
            </div>

            {checkExpiry(feedback.expiryDate) ? (
              <div className="p-4 bg-red-100 text-red-800 rounded-lg shadow-md">
                <p className="font-medium">Sorry, this feedback form has expired.</p>
              </div>
            ) : (
              <div className="flex justify-start items-center space-x-4 mt-4">
                <a
                  href={feedback.formLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md transition duration-200 ${
                    hasSubmitted ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
                  }`}
                  onClick={(e) => hasSubmitted && e.preventDefault()}
                >
                  Fill Feedback
                </a>
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-lg text-gray-600">No feedback forms available at the moment.</p>
      )}
    </div>
  );
};

export default Student_Feedback;
