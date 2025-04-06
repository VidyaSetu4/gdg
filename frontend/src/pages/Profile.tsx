import React, { useState, useEffect } from 'react';
import {
  User, Mail, Phone, MapPin, Calendar, BookOpen,
  Award, Settings, Edit, Camera, LogOut, BookOpenCheck, GraduationCap
} from 'lucide-react';
import axios from 'axios';
import API_BASE_URL from '../../config';
import Image from '../assets/image.png';
// Reusable components
const Badge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
    {children}
  </span>
);

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-sm overflow-hidden ${className}`}>
    {children}
  </div>
);

const TabButton: React.FC<{ label: string; active: boolean; icon: React.ReactNode; onClick: () => void }> = ({ label, active, icon, onClick }) => (
  <button
    className={`flex items-center gap-2 py-3 px-4 font-medium transition-all duration-200 ${active
        ? 'text-primary border-b-2 border-primary'
        : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
      }`}
    onClick={onClick}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const InfoRow: React.FC<{ label: string; icon: React.ReactNode; value: string | null }> = ({ label, icon, value }) => (
  <div className="group p-3 rounded-lg hover:bg-gray-50 transition-colors">
    <h3 className="text-sm font-medium text-gray-500 mb-1">{label}</h3>
    <div className="flex items-center gap-2">
      <span className="text-primary/70 group-hover:text-primary transition-colors">{icon}</span>
      <p className="text-gray-800 font-medium">{value || 'Not provided'}</p>
    </div>
  </div>
);

const EmptyState: React.FC<{ icon: React.ReactNode; message: string }> = ({ icon, message }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <div className="p-3 bg-gray-100 rounded-full mb-3">{icon}</div>
    <p className="text-gray-500">{message}</p>
  </div>
);

interface Course {
  name: string;
  description: string;
  status?: string;
  progress?: number;
}

const CourseCard: React.FC<{ course: Course }> = ({ course }) => (
  <div className="p-4 border border-gray-100 rounded-lg hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div>
        <h3 className="font-medium text-gray-800">{course.name}</h3>
        <p className="text-sm text-gray-600 mt-1">{course.description}</p>
      </div>
      <Badge>{course.status || 'In Progress'}</Badge>
    </div>
    <div className="mt-4">
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full"
          style={{ width: `${course.progress || 0}%` }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-xs text-gray-500">Progress</span>
        <span className="text-xs font-medium">{course.progress || 0}%</span>
      </div>
    </div>
  </div>
);


const Profile = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [studentInfo, setStudentInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    grade: '10th Standard',
    school: '',
    joinDate: '',
    profileImage: ''
  });

  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/auth/profile`, {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") }
        });

        const student = response.data.student;

        const formattedDOB = new Date(student.dateOfBirth).toLocaleDateString('en-US', {
          year: 'numeric', month: 'long', day: 'numeric'
        });

        const formattedJoinDate = new Date(student.joinedDate).toLocaleDateString('en-US', {
          year: 'numeric', month: 'long', day: 'numeric'
        });

        setStudentInfo({
          name: student.name,
          email: student.email,
          phone: student.phone,
          address: student.address,
          dateOfBirth: formattedDOB,
          grade: '10th Standard',
          school: student.school,
          joinDate: formattedJoinDate,
          profileImage: student.profilePicture || Image
        });

        if (student.enrolledCourses?.length > 0) {
          const coursesResponse = await axios.get(`${API_BASE_URL}/api/auth/courses`);
          setEnrolledCourses(coursesResponse.data.map(course => ({
            ...course,
            progress: Math.floor(Math.random() * 100) // Simulated progress (replace with actual data)
          })));
        }

        if (student.certificates?.length > 0) {
          const certsResponse = await axios.get(`${API_BASE_URL}/api/auth/certificates`);
          setCertificates(certsResponse.data);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching student data:', err);
        setError('Failed to load profile data. Please try again later.');
        setLoading(false);
      }
    };
    fetchStudentData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-lg border border-red-100">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      </div>
    );
  }
  const handleLogout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("users");
    window.location.href = "/"; // Redirect to login page
  };
  

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
        <button className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
          <LogOut size={18} onClick={handleLogout} />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Profile Header */}
      <Card>
        <div className="h-40 bg-gradient-to-r bg-blue-600 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">

          </div>
        </div>
        <div className="px-6 pb-6">
          <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-20">
            <div className="relative">
              <div className="w-36 h-36 rounded-full border-4 border-white bg-white shadow-md overflow-hidden">
                <img
                  src={studentInfo.profileImage}
                  alt={studentInfo.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <button className="absolute bottom-2 right-2 p-2 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-colors">
                <Camera size={16} />
              </button>
            </div>
            <div className="flex-1 pt-4 md:pt-0">
              <h2 className="text-2xl font-bold">{studentInfo.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge>{studentInfo.grade}</Badge>
                <span className="text-gray-600">•</span>
                <p className="text-gray-600">{studentInfo.school}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg shadow-sm hover:bg-blue-700 transition-colors">
                <Edit size={16} />
                <span>Edit Profile</span>
              </button>
              <button className="p-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Settings size={18} />
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white rounded-t-lg">
        <TabButton
          label="Personal Information"
          active={activeTab === 'personal'}
          icon={<User size={18} />}
          onClick={() => setActiveTab('personal')}
        />
        <TabButton
          label="Enrolled Courses"
          active={activeTab === 'courses'}
          icon={<BookOpenCheck size={18} />}
          onClick={() => setActiveTab('courses')}
        />

      </div>

      {/* Personal Info */}
      {activeTab === 'personal' && (
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Contact Information</h3>
              <div className="space-y-1">
                <InfoRow label="Full Name" icon={<User size={18} />} value={studentInfo.name} />
                <InfoRow label="Email Address" icon={<Mail size={18} />} value={studentInfo.email} />
                <InfoRow label="Phone Number" icon={<Phone size={18} />} value={studentInfo.phone} />
                <InfoRow label="Address" icon={<MapPin size={18} />} value={studentInfo.address} />
              </div>
            </div>
            {/* Right */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Academic Information</h3>
              <div className="space-y-1">
                <InfoRow label="Date of Birth" icon={<Calendar size={18} />} value={studentInfo.dateOfBirth} />
                <InfoRow label="Grade/Class" icon={<BookOpen size={18} />} value={studentInfo.grade} />
                <InfoRow label="School" icon={<BookOpen size={18} />} value={studentInfo.school} />
                <InfoRow label="Joined VidyaSetu" icon={<Calendar size={18} />} value={studentInfo.joinDate} />
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Additional Information</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm">
                Your profile information helps us provide personalized learning recommendations and
                keeps your account secure. You can update your information anytime through the Edit Profile button.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Enrolled Courses */}
      {activeTab === 'courses' && (
        <Card>
          <div className="p-5 border-b border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <BookOpenCheck size={20} className="text-primary" />
              <h2 className="font-medium text-gray-800">Your Enrolled Courses</h2>
            </div>
            <Badge>{enrolledCourses.length} Courses</Badge>
          </div>

          {enrolledCourses.length > 0 ? (
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              {enrolledCourses.map(course => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<BookOpen size={24} className="text-gray-400" />}
              message="You haven't enrolled in any courses yet."
            />
          )}
        </Card>
      )}

      {/* Certificates */}
      {activeTab === 'certificates' && (
        <Card>
          <div className="p-5 border-b border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Award size={20} className="text-primary" />
              <h2 className="font-medium text-gray-800">Your Certificates</h2>
            </div>
            <Badge>{certificates.length} Certificates</Badge>
          </div>

          {certificates.length > 0 ? (
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              {certificates.map(cert => (
                <CertificateCard key={cert._id} cert={cert} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Award size={24} className="text-gray-400" />}
              message="Complete courses to earn certificates."
            />
          )}
        </Card>
      )}
    </div>
  );
};

export default Profile;