import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BookOpen, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  School, 
  Award, 
  FileText
} from 'lucide-react';

const TeacherProfile = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [teacherInfo, setTeacherInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    school: '',
    subjectSpeciality: '',
    profilePicture: ''
  });
  
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        console.log("🚀 Sending request to /api/teacher/profile...");
        const response = await axios.get('http://localhost:5000/api/teacher/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        
        console.log("✅ Response received:", response);
        
        const teacherData = response.data.teacher;
        
        // Format the date of birth
        const dob = new Date(teacherData.dateOfBirth);
        const formattedDOB = dob.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
        
        // Set teacher information
        setTeacherInfo({
          name: teacherData.name,
          email: teacherData.email,
          phone: teacherData.phone,
          address: teacherData.address,
          dateOfBirth: formattedDOB,
          school: teacherData.school,
          subjectSpeciality: teacherData.subjectSpeciality,
          profilePicture: teacherData.profilePicture || '/default-profile.jpg'
        });
        
        // Set certificates
        if (teacherData.certificates && teacherData.certificates.length > 0) {
          setCertificates(teacherData.certificates.map(cert => {
            const issueDate = new Date(cert.issueDate);
            return {
              ...cert,
              formattedIssueDate: issueDate.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })
            };
          }));
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching teacher data:', err);
        setError('Failed to load profile data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchTeacherData();
  }, []);

  const renderPersonalInfo = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Personal Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-start space-x-3">
          <User className="h-5 w-5 text-primary mt-1" />
          <div>
            <p className="text-sm text-gray-500">Full Name</p>
            <p className="font-medium text-gray-800">{teacherInfo.name}</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <Mail className="h-5 w-5 text-primary mt-1" />
          <div>
            <p className="text-sm text-gray-500">Email Address</p>
            <p className="font-medium text-gray-800">{teacherInfo.email}</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <Phone className="h-5 w-5 text-primary mt-1" />
          <div>
            <p className="text-sm text-gray-500">Phone Number</p>
            <p className="font-medium text-gray-800">{teacherInfo.phone}</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <MapPin className="h-5 w-5 text-primary mt-1" />
          <div>
            <p className="text-sm text-gray-500">Address</p>
            <p className="font-medium text-gray-800">{teacherInfo.address}</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <Calendar className="h-5 w-5 text-primary mt-1" />
          <div>
            <p className="text-sm text-gray-500">Date of Birth</p>
            <p className="font-medium text-gray-800">{teacherInfo.dateOfBirth}</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <School className="h-5 w-5 text-primary mt-1" />
          <div>
            <p className="text-sm text-gray-500">School</p>
            <p className="font-medium text-gray-800">{teacherInfo.school}</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <BookOpen className="h-5 w-5 text-primary mt-1" />
          <div>
            <p className="text-sm text-gray-500">Subject Speciality</p>
            <p className="font-medium text-gray-800">{teacherInfo.subjectSpeciality}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCertificates = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Certificates & Qualifications</h2>
      
      {certificates.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {certificates.map((cert, index) => (
            <div key={cert._id || index} className="border rounded-lg p-4 hover:border-primary transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-800">{cert.name}</h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <School className="h-4 w-4 mr-2" />
                      <span>Issued by: {cert.issuedBy}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Issue Date: {cert.formattedIssueDate}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <a 
                    href={cert.certificateFile} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center text-primary hover:text-primary-dark transition-colors"
                  >
                    <FileText className="h-5 w-5 mr-1" />
                    <span>View</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center text-gray-500">
          <Award className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p>No certificates have been added yet.</p>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return <div className="bg-red-50 p-4 rounded-lg text-red-600">{error}</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar with profile picture and tabs */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <img 
                  src={teacherInfo.profilePicture} 
                  alt={teacherInfo.name} 
                  className="rounded-full w-32 h-32 object-cover border-4 border-primary"
                />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">{teacherInfo.name}</h1>
              <p className="text-primary font-medium">{teacherInfo.subjectSpeciality} Teacher</p>
              <p className="text-gray-500 mt-1">{teacherInfo.school}</p>
            </div>
            
            <div className="border-t">
              <button 
                onClick={() => setActiveTab('personal')} 
                className={`w-full py-3 px-6 text-left font-medium flex items-center ${activeTab === 'personal' ? 'bg-primary-50 text-primary border-l-4 border-primary' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <User className="h-5 w-5 mr-3" />
                Personal Information
              </button>
              <button 
                onClick={() => setActiveTab('certificates')} 
                className={`w-full py-3 px-6 text-left font-medium flex items-center ${activeTab === 'certificates' ? 'bg-primary-50 text-primary border-l-4 border-primary' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <Award className="h-5 w-5 mr-3" />
                Certificates
              </button>
            </div>
          </div>
        </div>
        
        {/* Main content area */}
        <div className="lg:col-span-2">
          {activeTab === 'personal' && renderPersonalInfo()}
          {activeTab === 'certificates' && renderCertificates()}
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;