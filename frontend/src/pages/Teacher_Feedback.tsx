import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../../config";
interface Course {
  _id: string;
  name: string;
  subject: string;
}

interface FeedbackForm {
  _id: string;
  formLink: string;
  course: { _id: string; name: string; subject: string };
  teacher: string;
  expiryDate: string;
  postDate: string;
}

const TeacherFeedback = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [feedbackForms, setFeedbackForms] = useState<FeedbackForm[]>([]);
  const [formLink, setFormLink] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();

  // Fetch courses and feedback forms
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized: Please log in");
        navigate("/login");
        return;
      }

      setLoading(true);

      // Fetch courses taught by the teacher
      const courseResponse = await axios.get<{ courses: Course[] }>(
        `${API_BASE_URL}/api/course/courses`,
        { headers: { Authorization: `${token}` } }
      );
      setCourses(courseResponse.data.courses);
      
      if (courseResponse.data.courses.length > 0) {
        setSelectedCourse(courseResponse.data.courses[0]._id);
      }

      // Fetch feedback forms created by the teacher
      const feedbackResponse = await axios.get<FeedbackForm[]>(
        `${API_BASE_URL}/api/feedback/teacher`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFeedbackForms(feedbackResponse.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [navigate]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized: Please log in");
        return;
      }

      if (!formLink || !selectedCourse) {
        setError("Please provide a form link and select a course");
        return;
      }

      setSubmitting(true);
      const response = await axios.post<FeedbackForm>(
        `${API_BASE_URL}/api/feedback`,
        { formLink, courseId: selectedCourse },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFeedbackForms([response.data, ...feedbackForms]); // Add new form to the list
      setFormLink(""); // Reset form
      setError("");
      setSuccess("Feedback form created successfully!");
      setTimeout(() => setSuccess(""), 3000); // Clear success message after 3 seconds
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create feedback form");
    } finally {
      setSubmitting(false);
    }
  };

  // Format date in a more readable way
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Check if form is expired
  const isExpired = (expiryDate: string) => {
    return new Date() > new Date(expiryDate);
  };

  // Calculate days remaining
  const getDaysLeft = (expiryDate: string) => {
    const diff = new Date(expiryDate).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  // Group feedback forms by course
  const feedbackByCourse = feedbackForms.reduce((acc, form) => {
    const courseId = form.course._id;
    if (!acc[courseId]) {
      acc[courseId] = [];
    }
    acc[courseId].push(form);
    return acc;
  }, {} as Record<string, FeedbackForm[]>);

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen p-6 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your feedback forms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-8">
          <div className="bg-blue-100 p-3 rounded-full mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Course Feedback Management</h1>
        </div>

        {/* Notifications */}
        
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{success}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create Form Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="rounded-full bg-blue-100 p-2 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Create Feedback Form</h2>
              </div>
              
              <p className="text-sm text-gray-600 mb-6">
                Create a Google Form for student feedback and submit it for your selected course.
              </p>
              
              <button
                className="w-full bg-blue-100 text-blue-700 px-4 py-2 rounded-lg mb-6 hover:bg-blue-200 transition duration-150 flex items-center justify-center font-medium"
                onClick={() => window.open("https://forms.new", "_blank")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Create New Google Form
              </button>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Course</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    disabled={submitting || courses.length === 0}
                  >
                    {courses.length === 0 ? (
                      <option value="">No courses available</option>
                    ) : (
                      courses.map((course) => (
                        <option key={course._id} value={course._id}>
                          {course.name} ({course.subject})
                        </option>
                      ))
                    )}
                  </select>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Form Link</label>
                  <input
                    type="url"
                    placeholder="Paste Google Form link here"
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formLink}
                    onChange={(e) => setFormLink(e.target.value)}
                    disabled={submitting}
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className={`w-full py-2 px-4 rounded-lg font-medium text-white ${
                    submitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                  } transition duration-150 flex items-center justify-center`}
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    "Submit Feedback Form"
                  )}
                </button>
              </form>
            </div>
          </div>
          
          {/* Feedback Forms Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center mb-6">
                <div className="rounded-full bg-blue-100 p-2 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Your Feedback Forms</h2>
              </div>
              
              {feedbackForms.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-500">No feedback forms submitted yet.</p>
                  <p className="text-gray-500 text-sm mt-1">Create and submit your first feedback form.</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {Object.entries(feedbackByCourse).map(([courseId, forms]) => {
                    const courseName = forms[0].course.name;
                    const courseSubject = forms[0].course.subject;
                    
                    return (
                      <div key={courseId} className="mb-6">
                        <div className="flex items-center mb-3">
                          <div className="bg-gray-100 rounded-md px-3 py-1 flex items-center">
                            <span className="text-gray-800 font-medium">{courseName}</span>
                            <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full ml-2">
                              {courseSubject}
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-4">
                          {forms.map((form) => {
                            const expired = isExpired(form.expiryDate);
                            const daysLeft = getDaysLeft(form.expiryDate);
                            
                            return (
                              <div key={form._id} className="border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-150 bg-white overflow-hidden">
                                <div className="p-4">
                                  <div className="flex justify-between items-center mb-3">
                                    <div className="text-sm text-gray-500">
                                      Posted: {formatDate(form.postDate)}
                                    </div>
                                    {expired ? (
                                      <span className="bg-red-100 text-red-800 text-xs px-2.5 py-0.5 rounded-full">
                                        Expired
                                      </span>
                                    ) : (
                                      <span className="bg-green-100 text-green-800 text-xs px-2.5 py-0.5 rounded-full">
                                        {daysLeft} day{daysLeft !== 1 ? 's' : ''} remaining
                                      </span>
                                    )}
                                  </div>
                                  
                                  <div className="text-sm text-gray-500 mb-3">
                                    Expires: {formatDate(form.expiryDate)}
                                  </div>
                                  
                                  <div className="flex flex-wrap gap-2">
                                    <a
                                      href={form.formLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm font-medium"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                      </svg>
                                      View Form
                                    </a>
                                    
                                    <a
                                      href={`${form.formLink}/edit`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                      </svg>
                                      Edit Form
                                    </a>
                                    
                                    <a
                                      href={`${form.formLink}/viewanalytics`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                      </svg>
                                      View Responses
                                    </a>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherFeedback;