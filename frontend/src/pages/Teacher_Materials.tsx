import { useEffect, useState } from "react";
import axios from "axios";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { auth, storage } from "../../src/firebase";
import { onAuthStateChanged } from "firebase/auth";
import API_BASE_URL from "../../config";
interface Course {
  _id: string;
  name: string;
  subject: string;
}

const TeacherUpload = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetchingCourses, setIsFetchingCourses] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isDragging, setIsDragging] = useState<boolean>(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsFetchingCourses(true);
        const token = localStorage.getItem("token");
        if (!token) {
          setErrorMessage("No authentication token found. Please log in again.");
          return;
        }

        const response = await axios.get<{ courses: Course[] }>(
          `${API_BASE_URL}/api/course/courses`,
          { headers: { Authorization: token } }
        );

        setCourses(response.data.courses);
      } catch (error) {
        setErrorMessage("Failed to fetch your courses. Please try again later.");
        console.error("Course fetch error:", error);
      } finally {
        setIsFetchingCourses(false);
      }
    };

    fetchCourses();
  }, []);

  // Handle file drop
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file || !selectedCourse) {
      setErrorMessage("Please select a course and choose a file.");
      return;
    }

    setIsLoading(true);
    setUploadSuccess(false);
    setErrorMessage("");

    const token = localStorage.getItem("token");
    if (!token) {
      setErrorMessage("No authentication token found.");
      setIsLoading(false);
      return;
    }

    const storageRef = ref(storage, `notes/${selectedCourse}/${Date.now()}-${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Optional: progress tracking
      },
      (error) => {
        console.error("Firebase upload error:", error);
        setErrorMessage("Failed to upload file.");
        setIsLoading(false);
      },
      async () => {
        try {
          const fileUrl = await getDownloadURL(uploadTask.snapshot.ref);
          const fileName = file.name;

          await axios.post(
            `${API_BASE_URL}/api/course/upload`,
            {
              courseId: selectedCourse,
              fileUrl,
              fileName,
            },
            {
              headers: {
                Authorization: token,
              },
            }
          );

          setUploadSuccess(true);
          setFile(null);
          setSelectedCourse("");
          
          // Hide success message after 5 seconds
          setTimeout(() => {
            setUploadSuccess(false);
          }, 5000);
        } catch (error) {
          console.error("Metadata upload error:", error);
          setErrorMessage("Failed to save file metadata.");
        } finally {
          setIsLoading(false);
        }
      }
    );
  };

  const fileName = file ? file.name : "No file selected";
  const fileSize = file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "";
  const fileType = file ? file.type : "";

  // Get appropriate file icon based on type
  const getFileIcon = () => {
    if (!file) {
      return (
        <svg className="w-16 h-16 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" 
                d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    }
    
    if (fileType.includes('pdf')) {
      return (
        <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" 
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          <text x="9" y="16" fill="currentColor" fontSize="6" fontFamily="sans-serif">PDF</text>
        </svg>
      );
    }
    
    if (fileType.includes('image')) {
      return (
        <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" 
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    }
    
    if (fileType.includes('word') || fileType.includes('document')) {
      return (
        <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" 
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          <text x="9" y="16" fill="currentColor" fontSize="6" fontFamily="sans-serif">DOC</text>
        </svg>
      );
    }
    
    return (
      <svg className="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" 
              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    );
  };

  return (
    <div className="bg-gradient-to-br py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-t-2xl shadow-lg p-8 mb-1">
          <h2 className="text-3xl font-bold text-center text-indigo-700 mb-2">
            Upload Notes
          </h2>
          <p className="text-center text-gray-600 mb-0">
            Share your study notes with your classmates
          </p>
        </div>
        
        {/* Main Content */}
        <div className="bg-white rounded-b-2xl shadow-lg p-8">
          {/* Messages */}
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md flex items-center">
              <svg className="w-5 h-5 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{errorMessage}</span>
            </div>
          )}

          {uploadSuccess && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-md flex items-center">
              <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>File uploaded successfully!</span>
            </div>
          )}

          {/* Course Selection */}
          <div className="mb-6">
            <label htmlFor="course-select" className="block text-gray-700 font-medium mb-2">
              Select Course
            </label>
            <div className="relative">
              <select
                id="course-select"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none bg-white shadow-sm appearance-none"
                disabled={isFetchingCourses}
              >
                <option value="">-- Choose a Course --</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.name} ({course.subject})
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {isFetchingCourses && (
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <svg className="animate-spin h-4 w-4 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Loading your courses...
              </div>
            )}
          </div>

          {/* File Upload */}
          <div className="mb-8">
            <label htmlFor="file-upload" className="block text-gray-700 font-medium mb-2">
              Upload File
            </label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg px-6 py-10 text-center transition-all duration-200 
                ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'}`}
            >
              <label htmlFor="file-upload" className="cursor-pointer block">
                <div className="flex flex-col items-center gap-3">
                  {getFileIcon()}
                  
                  {!file ? (
                    <span className="text-gray-600">
                      Drag and drop file here, or click to browse
                    </span>
                  ) : (
                    <>
                      <span className="font-medium text-indigo-600 break-all max-w-full">{fileName}</span>
                      <div className="flex items-center text-sm text-gray-500 gap-3">
                        <span>{fileSize}</span>
                        {fileType && <span>• {fileType.split('/')[1].toUpperCase()}</span>}
                      </div>
                    </>
                  )}
                </div>
                <input
                  id="file-upload"
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  accept=".pdf,.docx,.pptx,.txt"
                  className="hidden"
                />
              </label>
            </div>
            {file && (
              <div className="mt-2 flex justify-end">
                <button
                  onClick={() => setFile(null)}
                  className="text-sm text-gray-500 hover:text-red-500 flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Remove file
                </button>
              </div>
            )}
          </div>

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={!selectedCourse || !file || isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition duration-300 shadow-md hover:shadow-lg disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed flex justify-center items-center"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Uploading...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Upload Notes
              </>
            )}
          </button>
          
          {/* Help Text */}
          <p className="mt-4 text-center text-xs text-gray-500">
            Accepted file formats: PDF, DOCX, PPTX, TXT
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeacherUpload;