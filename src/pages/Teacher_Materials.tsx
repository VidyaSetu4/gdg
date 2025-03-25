import { useEffect, useState } from "react";
import axios from "axios";

// Define the expected structure for a course
interface Course {
  _id: string;
  name: string;
  subject: string;
}

const TeacherUpload = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  // Fetch Courses on Mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }

        const response = await axios.get<{ courses: Course[] }>(
          "http://localhost:5000/api/course/courses",
          { headers: { Authorization: token } }
        );

        setCourses(response.data.courses);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
    };

    fetchCourses();
  }, []);

  // Handle File Upload
  const handleUpload = async () => {
    if (!selectedCourse || !file) {
      alert("Please select a course and a file!");
      return;
    }

    const formData = new FormData();
    formData.append("courseId", selectedCourse);
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Unauthorized! Please login.");
        return;
      }

      await axios.post("http://localhost:5000/api/course/upload", formData, {
        headers: { Authorization: token, "Content-Type": "multipart/form-data" },
      });

      alert("File uploaded successfully!");
      setFile(null); // Reset file after upload
      setSelectedCourse(""); // Reset selection
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed!");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Upload Course Materials
      </h2>

      <div className="space-y-4">
        {/* Course Selection Dropdown */}
        <div>
          <label htmlFor="course-select" className="block text-sm font-medium text-gray-700 mb-2">
            Select Course
          </label>
          <select
            id="course-select"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a Course</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.name} ({course.subject})
              </option>
            ))}
          </select>
        </div>

        {/* File Upload Input */}
        <div>
          <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">
            Choose File
          </label>
          <input 
            id="file-upload"
            type="file" 
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm file:mr-4 file:rounded-md file:border-0 file:bg-blue-500 file:px-4 file:py-2 file:text-white hover:file:bg-blue-600"
          />
        </div>

        {/* Upload Button */}
        <button 
          onClick={handleUpload} 
          disabled={!selectedCourse || !file}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Upload
        </button>
      </div>
    </div>
  );
};

export default TeacherUpload;