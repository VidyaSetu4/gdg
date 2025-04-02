import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { PlusCircle, MinusCircle, Eye, BookOpen, Save, Loader2 } from "lucide-react";
import API_BASE_URL from "../../config";

interface Course {
  _id: string;
  subject: string;
  name: string;
}

interface SAQTest {
  _id: string;
  title: string;
  course: string;
  attemptsAllowed: number;
  createdAt: string;
}

const CreateSAQTest = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [tests, setTests] = useState<SAQTest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [questions, setQuestions] = useState<{ questionText: string }[]>([{ questionText: "" }]);
  const [attempts, setAttempts] = useState<number>(1);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  // Fetch courses and teacher's tests
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Unauthorized: No token provided");
          setLoading(false);
          return;
        }

        // Fetch courses
        const courseResponse = await axios.get<{ courses: Course[] }>(
          `${API_BASE_URL}/api/course/courses`,
          { headers: { Authorization: `${token}` } }
        );
        setCourses(courseResponse.data.courses);

        // Fetch teacher's SAQ tests
        const testResponse = await axios.get<SAQTest[]>(`${API_BASE_URL}/api/saq/teacher/tests`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTests(testResponse.data);
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index].questionText = value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { questionText: "" }]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) {
      alert("Please select a course");
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Unauthorized: No token provided");
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/saq/create`,
        { title, courseId: selectedCourse, questions, attemptsAllowed: attempts },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      
      // Add new test to list
      setTests([...tests, response.data.saq]);
      
      // Show success message
      const successMessage = document.getElementById("success-message");
      if (successMessage) {
        successMessage.classList.remove("hidden");
        setTimeout(() => {
          successMessage.classList.add("hidden");
        }, 3000);
      }
      
      // Reset form
      setTitle("");
      setQuestions([{ questionText: "" }]);
      setAttempts(1);
      setSelectedCourse("");
    } catch (error) {
      console.error(error);
      setError("Error creating SAQ Test");
      const errorMessage = document.getElementById("error-message");
      if (errorMessage) {
        errorMessage.classList.remove("hidden");
        setTimeout(() => {
          errorMessage.classList.add("hidden");
        }, 3000);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewSubmissions = (saqId: string) => {
    navigate(`/teacher/saq/${saqId}/submissions`);
  };

  const handleViewAnalytics = (saqId: string) => {
    navigate(`/teacher/saq/${saqId}/analytics`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    );
  }

  if (error && !courses.length) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        <p className="font-medium">Error: {error}</p>
        <p className="text-sm mt-1">Please try refreshing the page or contact support.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Create SAQ Test</h1>
        <p className="text-gray-600">Design short answer questions for your students</p>
      </div>

      {/* Success and Error Messages */}
      <div id="success-message" className="hidden bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-6">
        SAQ Test created successfully!
      </div>
      <div id="error-message" className="hidden bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
        Error creating SAQ Test. Please try again.
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Course
              </label>
              <select 
                value={selectedCourse} 
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">-- Select a Course --</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.name} ({course.subject})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Test Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter test title"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maximum Attempts Allowed
            </label>
            <input
              type="number"
              min="1"
              value={attempts}
              onChange={(e) => setAttempts(parseInt(e.target.value))}
              className="w-32 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Questions
              </label>
              <button 
                type="button" 
                onClick={addQuestion}
                className="flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                <PlusCircle className="w-4 h-4 mr-1" />
                Add Question
              </button>
            </div>
            
            <div className="space-y-4">
              {questions.map((question, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-grow">
                    <div className="flex items-center">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-md mr-2">
                        Q{index + 1}
                      </span>
                      <input
                        type="text"
                        value={question.questionText}
                        onChange={(e) => handleQuestionChange(index, e.target.value)}
                        className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your question"
                      />
                    </div>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => removeQuestion(index)}
                    className="ml-2 p-1 text-red-500 hover:text-red-700"
                    disabled={questions.length <= 1}
                  >
                    <MinusCircle className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Create SAQ Test
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <BookOpen className="w-5 h-5 mr-2 text-blue-500" />
          Your Created SAQ Tests
        </h2>

        {tests.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No tests created yet.</p>
            <p className="text-sm mt-1">Create your first test using the form above.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tests.map((test) => (
              <div 
                key={test._id} 
                className="border border-gray-200 rounded-md p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-900">{test.title}</h3>
                    <p className="text-sm text-gray-500">
                      Attempts Allowed: {test.attemptsAllowed} • Created: {new Date(test.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleViewSubmissions(test._id)}
                    className="flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100 transition-colors text-sm"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View Submissions
                  </button>
                  <button
                    onClick={() => handleViewAnalytics(test._id)}
                    className="flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100 transition-colors text-sm"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View Analytics
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateSAQTest;