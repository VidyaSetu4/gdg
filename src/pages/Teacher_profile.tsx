import React from 'react';
import { UserCircle, Mail, Phone, Book, Settings, Bell, Shield, LogOut } from 'lucide-react';

const TeacherProfile = () => {
  const teacherProfile = {
    name: 'Dr. Sarah Johnson',
    subject: 'Mathematics',
    email: 'sarah.johnson@vidyasetu.edu',
    phone: '+1 (555) 123-4567',
    experience: '8 years',
    education: 'Ph.D. in Mathematics',
    specialization: 'Advanced Calculus',
    classesCount: 245,
    studentsCount: 1200,
    averageRating: 4.8,
  };

  return (
    <div className="grid gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Profile</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Information */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center">
                <UserCircle size={64} className="text-indigo-600" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">{teacherProfile.name}</h2>
                <p className="text-gray-600">{teacherProfile.subject} Teacher</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <Mail size={18} className="mr-2" />
                    {teacherProfile.email}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Phone size={18} className="mr-2" />
                    {teacherProfile.phone}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Professional Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <Book size={18} className="mr-2" />
                    Experience: {teacherProfile.experience}
                  </div>
                  <div className="text-gray-600">
                    Education: {teacherProfile.education}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="text-3xl font-bold text-indigo-600">
                {teacherProfile.classesCount}
              </div>
              <div className="text-gray-600">Classes Taught</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="text-3xl font-bold text-indigo-600">
                {teacherProfile.studentsCount}
              </div>
              <div className="text-gray-600">Total Students</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="text-3xl font-bold text-indigo-600">
                {teacherProfile.averageRating}
              </div>
              <div className="text-gray-600">Average Rating</div>
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="font-semibold mb-4">Settings</h3>
          <div className="space-y-4">
            <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
              <div className="flex items-center">
                <Settings size={20} className="text-gray-500 mr-3" />
                <span>Account Settings</span>
              </div>
            </button>
            <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
              <div className="flex items-center">
                <Bell size={20} className="text-gray-500 mr-3" />
                <span>Notifications</span>
              </div>
            </button>
            <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
              <div className="flex items-center">
                <Shield size={20} className="text-gray-500 mr-3" />
                <span>Privacy & Security</span>
              </div>
            </button>
            <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 text-red-600">
              <div className="flex items-center">
                <LogOut size={20} className="mr-3" />
                <span>Logout</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;