import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, BookOpen, Award, Settings, Edit, Camera, LogOut } from 'lucide-react';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('personal');
  
  const studentInfo = {
    name: 'Aryan Sharma',
    email: 'aryan.sharma@example.com',
    phone: '+91 98765 43210',
    address: 'New Delhi, India',
    dateOfBirth: 'January 15, 2010',
    grade: '10th Standard',
    school: 'Delhi Public School, New Delhi',
    joinDate: 'March 10, 2025',
    profileImage: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80'
  };
  
  const enrolledCourses = [
    { id: 1, name: 'Mathematics - Class 10', progress: 85, teacher: 'Dr. Sharma' },
    { id: 2, name: 'Science - Class 10', progress: 92, teacher: 'Mrs. Gupta' },
    { id: 3, name: 'English - Class 10', progress: 78, teacher: 'Mr. Patel' },
    { id: 4, name: 'History - Class 10', progress: 65, teacher: 'Ms. Reddy' },
    { id: 5, name: 'Geography - Class 10', progress: 70, teacher: 'Mr. Singh' },
  ];
  
  const certificates = [
    { id: 1, name: 'Mathematics Excellence', issueDate: 'May 15, 2025', issuer: 'VidyaSetu' },
    { id: 2, name: 'Science Star Performer', issueDate: 'April 20, 2025', issuer: 'VidyaSetu' },
    { id: 3, name: 'English Language Proficiency', issueDate: 'March 10, 2025', issuer: 'VidyaSetu' },
  ];

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
            {enrolledCourses.map(course => (
              <div key={course.id} className="p-4 hover:bg-gray-50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-medium">{course.name}</h3>
                    <p className="text-sm text-gray-600">Teacher: {course.teacher}</p>
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
            ))}
          </div>
        </div>
      )}
      
      {/* Certificates */}
      {activeTab === 'certificates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map(certificate => (
            <div key={certificate.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Award size={24} className="text-primary" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="font-medium mb-1">{certificate.name}</h3>
                <p className="text-sm text-gray-600">Issued by {certificate.issuer}</p>
                <p className="text-sm text-gray-600 mt-1">on {certificate.issueDate}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-center">
                <button className="text-primary hover:text-primary/80 text-sm font-medium">
                  View Certificate
                </button>
              </div>
            </div>
          ))}
          
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