import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, BookOpen, Award, Settings, Edit, Camera, LogOut } from 'lucide-react';
import axios from 'axios';
import API_BASE_URL from '../../config';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [studentInfo, setStudentInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    grade: '10th Standard', // Default value since not in schema
    school: '',
    joinDate: '',
    profileImage: ''
  });
  
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        // Fetch student profile
        console.log("🚀 Sending request to /api/auth/profile...");
        const response = await axios.get(`${API_BASE_URL}/api/auth/profile`,{
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        const studentInfo = response.data;
        //console.log(response.data);//-----------------------------------------------------------------------------------------------
        console.log("✅ Response received:", response); // ✅ Log entire response
        console.log("🎯 Extracted data:", response.data); // ✅ Log extracted data
  
        // Format the date of birth
        const dob = new Date(studentInfo.student.dateOfBirth);
        const formattedDOB = dob.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
        
        // Format the join date
        const joinedDate = new Date(studentInfo.student.joinedDate);
        const formattedJoinDate = joinedDate.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
        
        // Set student information
        setStudentInfo({
          name: studentInfo.student.name,
          email: studentInfo.student.email,
          phone: studentInfo.student.phone,
          address: studentInfo.student.address,
          dateOfBirth: formattedDOB,
          grade: '10th Standard', // Hardcoded since not in schema
          school: studentInfo.student.school,
          joinDate: formattedJoinDate,
          profileImage: studentInfo.student.profilePicture || '/default-profile.jpg' // Use default if no image
        });
        
        // Fetch enrolled courses data
        if (studentInfo.student.enrolledCourses && studentInfo.student.enrolledCourses.length > 0) {
          const studentCoursesResponse = await axios.get('/api/student/courses');
          setEnrolledCourses(studentCoursesResponse.data);
        }
        
        // Fetch certificates data
        if (studentInfo.student.certificates && studentInfo.student.certificates.length > 0) {
          const studentCertificatesResponse = await axios.get('/api/student/certificates');
          setCertificates(studentCertificatesResponse.data);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching student data:', err);
        setError('Failed to load profile data. Please try again later.');
        setLoading(false);
      }
    };
    fetchStudentData()
    //console.log(fetchStudentData());
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }

  if (error) {
    return <div className="bg-red-50 p-4 rounded-lg text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
      
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary to-primary/80"></div>
        <div className="px-6 pb-6">
          <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-16">
            <div className="relative">
              <img 
                src={studentInfo.profileImage} 
                alt={studentInfo.name} 
                className="w-32 h-32 rounded-full border-4 border-white object-cover"
              />
              <button className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors">
                <Camera size={16} />
              </button>
            </div>
            <div className="flex-1 pt-4 md:pt-0">
              <h2 className="text-2xl font-bold">{studentInfo.name}</h2>
              <p className="text-gray-600">{studentInfo.grade} • {studentInfo.school}</p>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                <Edit size={16} />
                <span>Edit Profile</span>
              </button>
              <button className="p-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Settings size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === 'personal'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-600 hover:text-gray-800'
          }`}
          onClick={() => setActiveTab('personal')}
        >
          Personal Information
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === 'courses'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-600 hover:text-gray-800'
          }`}
          onClick={() => setActiveTab('courses')}
        >
          Enrolled Courses
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === 'certificates'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-600 hover:text-gray-800'
          }`}
          onClick={() => setActiveTab('certificates')}
        >
          Certificates
        </button>
      </div>
      
      {/* Personal Information */}
      {activeTab === 'personal' && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Full Name</h3>
                <div className="flex items-center gap-2">
                  <User size={18} className="text-gray-400" />
                  <p className="text-gray-800">{studentInfo.name}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Email Address</h3>
                <div className="flex items-center gap-2">
                  <Mail size={18} className="text-gray-400" />
                  <p className="text-gray-800">{studentInfo.email}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Phone Number</h3>
                <div className="flex items-center gap-2">
                  <Phone size={18} className="text-gray-400" />
                  <p className="text-gray-800">{studentInfo.phone}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Address</h3>
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-gray-400" />
                  <p className="text-gray-800">{studentInfo.address}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Date of Birth</h3>
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-gray-400" />
                  <p className="text-gray-800">{studentInfo.dateOfBirth}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Grade/Class</h3>
                <div className="flex items-center gap-2">
                  <BookOpen size={18} className="text-gray-400" />
                  <p className="text-gray-800">{studentInfo.grade}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">School</h3>
                <div className="flex items-center gap-2">
                  <BookOpen size={18} className="text-gray-400" />
                  <p className="text-gray-800">{studentInfo.school}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Joined VidyaSetu</h3>
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-gray-400" />
                  <p className="text-gray-800">{studentInfo.joinDate}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-100">
            <button className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
              <LogOut size={18} />
              <span>Sign Out</span>
              
            </button>
          </div>
        </div>
      )}
      
      {/* Enrolled Courses */}
      {activeTab === 'courses' && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 bg-primary/5 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <BookOpen size={20} className="text-primary" />
              <h2 className="font-medium">Your Enrolled Courses</h2>
            </div>
          </div>
          
          <div className="divide-y divide-gray-100">
            {enrolledCourses.length > 0 ? (
              enrolledCourses.map(course => (
                <div key={course._id} className="p-4 hover:bg-gray-50">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-medium">{course.name}</h3>
                      <p className="text-sm text-gray-600">Teacher: {course.teacherName}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-32">
                        <div className="flex justify-between mb-1">
                          <span className="text-xs text-gray-600">Progress</span>
                          <span className="text-xs font-medium">{course.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-primary h-1.5 rounded-full" 
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <button className="text-primary hover:text-primary/80 text-sm font-medium">
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                You are not enrolled in any courses yet.
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Certificates */}
      {activeTab === 'certificates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.length > 0 ? (
            certificates.map(certificate => (
              <div key={certificate._id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Award size={24} className="text-primary" />
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="font-medium mb-1">{certificate.name}</h3>
                  <p className="text-sm text-gray-600">Issued by {certificate.issuer}</p>
                  <p className="text-sm text-gray-600 mt-1">on {new Date(certificate.issueDate).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-center">
                  <button className="text-primary hover:text-primary/80 text-sm font-medium">
                    View Certificate
                  </button>
                </div>
              </div>
            ))
          ) : null}
          
          <div className="bg-gray-50 p-6 rounded-lg border border-dashed border-gray-300 flex flex-col items-center justify-center text-center">
            <div className="p-3 bg-gray-200 rounded-full mb-4">
              <Award size={24} className="text-gray-500" />
            </div>
            <h3 className="font-medium mb-1">Complete More Courses</h3>
            <p className="text-sm text-gray-600">Earn certificates by completing courses and assessments</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;