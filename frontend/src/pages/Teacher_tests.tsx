import React from 'react';
import { ClipboardList, Clock, Users, Award } from 'lucide-react';

const ConductTests = () => {
  const tests = [
    {
      id: 1,
      title: 'Mid-Term Mathematics Assessment',
      subject: 'Mathematics',
      duration: '90 minutes',
      totalMarks: 100,
      dueDate: '2024-03-25',
      submissions: 45,
      status: 'Active',
    },
    {
      id: 2,
      title: 'Weekly Quiz - Algebra',
      subject: 'Mathematics',
      duration: '30 minutes',
      totalMarks: 50,
      dueDate: '2024-03-20',
      submissions: 38,
      status: 'Active',
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Tests</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
          Create New Test
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Active Tests</h3>
            <ClipboardList size={24} className="text-indigo-600" />
          </div>
          <p className="text-3xl font-bold">5</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Total Submissions</h3>
            <Users size={24} className="text-green-600" />
          </div>
          <p className="text-3xl font-bold">83</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Average Score</h3>
            <Award size={24} className="text-yellow-600" />
          </div>
          <p className="text-3xl font-bold">76%</p>
        </div>
      </div>

      <div className="grid gap-6">
        {tests.map((test) => (
          <div
            key={test.id}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold mb-2">{test.title}</h3>
                <div className="flex items-center text-gray-600 mb-4">
                  <Clock size={16} className="mr-2" />
                  {test.duration}
                  <span className="mx-2">•</span>
                  <span>{test.totalMarks} marks</span>
                  <span className="mx-2">•</span>
                  <span>Due: {test.dueDate}</span>
                </div>
                <div className="flex items-center">
                  <Users size={16} className="mr-2 text-gray-600" />
                  <span>{test.submissions} submissions</span>
                </div>
              </div>
              <div className="flex space-x-3">
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                  View Details
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                  Edit Test
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConductTests;