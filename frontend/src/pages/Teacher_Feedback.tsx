import React, { useState, useEffect } from "react";

const Teacher_Feedback = () => {
  const [feedbackForm, setFeedbackForm] = useState(""); // ✅ Stores user input
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [loading, setLoading] = useState(false); // ✅ Tracks API calls

  // ✅ Fetch latest feedback status
  const fetchFeedbackStatus = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/feedback/latest");
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      const data = await response.json();

      if (data?.formLink) {
        setFeedbackForm(data.formLink); // ✅ Autofill latest form link
        setHasSubmitted(true); // ✅ Set only if a form already exists
      }
    } catch (error) {
      console.error("Error fetching feedback:", error);
    }
  };

  useEffect(() => {
    fetchFeedbackStatus();
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
      setHasSubmitted(true); // ✅ Disable input & button AFTER submission
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

        {/* ✅ Input is now autofilled and still editable before submission */}
        <input
          type="text"
          placeholder="Paste Google Form link here"
          className="border border-gray-300 p-2 w-full mt-4 rounded-lg"
          value={feedbackForm}
          onChange={(e) => setFeedbackForm(e.target.value)}
          disabled={hasSubmitted} // ✅ Still editable before submission
        />

        {/* ✅ Button disabled only after successful submission */}
        <button
          className={`w-full text-white px-4 py-2 rounded-lg mt-4 shadow-md transition duration-200 ${
            hasSubmitted ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
          } ${loading ? "opacity-50" : ""}`}
          onClick={handleSubmitFeedback}
          disabled={hasSubmitted || loading} // ✅ Only disabled when needed
        >
          {loading ? "Submitting..." : hasSubmitted ? "Feedback Submitted" : "Submit Feedback Form"}
        </button>
      </div>
    </div>
  );
};

export default Teacher_Feedback;
