import React, { useState, useEffect } from "react";

interface FeedbackForm {
  formLink: string;
  postDate: string;
  expiryDate: string;
}

const Teacher_Feedback = () => {
  const [feedbackForm, setFeedbackForm] = useState(""); // ✅ Stores user input
  const [loading, setLoading] = useState(false); // ✅ Tracks API calls
  const [feedbackForms, setFeedbackForms] = useState<FeedbackForm[]>([]); // ✅ Stores submitted forms

  // ✅ Fetch submitted feedback forms
  const fetchFeedbackForms = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/feedback");
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      const data = await response.json();
      setFeedbackForms(data); // ✅ Store fetched forms
    } catch (error) {
      console.error("Error fetching feedback:", error);
    }
  };

  useEffect(() => {
    fetchFeedbackForms();
  }, []);

  // ✅ Handle submitting a new feedback form
  const handleSubmitFeedback = async () => {
    if (!feedbackForm.trim()) {
      alert("Please enter a Google Form link.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formLink: feedbackForm }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit feedback");
      }

      alert("Feedback form submitted!");
      setFeedbackForm(""); // ✅ Clear input for new submission
      fetchFeedbackForms(); // ✅ Refresh submitted forms
    } catch (error) {
      console.error("Submission error:", error);
      alert("Error submitting feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">📝 Teacher Feedback</h2>

      <div className="p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700">Create a Feedback Form</h3>
        <p className="text-sm text-gray-500 mb-4">
          Use Google Forms to create a new feedback form and submit the link below.
        </p>

        <button
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition duration-200"
          onClick={() => window.open("https://forms.new", "_blank")}
        >
          Create New Form
        </button>

        {/* ✅ Input remains editable for multiple submissions */}
        <input
          type="text"
          placeholder="Paste Google Form link here"
          className="border border-gray-300 p-2 w-full mt-4 rounded-lg"
          value={feedbackForm}
          onChange={(e) => setFeedbackForm(e.target.value)}
          disabled={loading} // ✅ Only disable while submitting
        />

        {/* ✅ Button always enabled except when loading */}
        <button
          className={`w-full text-white px-4 py-2 rounded-lg mt-4 shadow-md transition duration-200 ${
            loading ? "opacity-50 cursor-not-allowed bg-gray-400" : "bg-green-600 hover:bg-green-700"
          }`}
          onClick={handleSubmitFeedback}
          disabled={loading} // ✅ Allow multiple submissions
        >
          {loading ? "Submitting..." : "Submit Feedback Form"}
        </button>
      </div>

      {/* ✅ Show previously submitted forms */}
      <div className="mt-6 p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700">📌 Submitted Feedback Forms</h3>

        {feedbackForms.length > 0 ? (
          <ul className="mt-4 space-y-4">
            {feedbackForms.map((feedback, index) => (
              <li key={index} className="p-4 border rounded-lg shadow-sm bg-gray-50">
                <p className="text-sm text-gray-600">
                  <strong>Posted on:</strong> {new Date(feedback.postDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Expires on:</strong> {new Date(feedback.expiryDate).toLocaleDateString()}
                </p>
                <a
                  href={feedback.formLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Open Feedback Form
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 text-sm mt-2">No feedback forms submitted yet.</p>
        )}
      </div>
    </div>
  );
};

export default Teacher_Feedback;
