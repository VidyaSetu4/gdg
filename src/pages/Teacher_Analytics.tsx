import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TeacherAnalytics = () => {
  const testData = [
    { name: 'Test 1', avgScore: 85, highestScore: 98, lowestScore: 65 },
    { name: 'Test 2', avgScore: 78, highestScore: 95, lowestScore: 60 },
    { name: 'Test 3', avgScore: 82, highestScore: 100, lowestScore: 70 },
    // Add more test data as needed
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Analytics</h1>

      <div className="grid gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-6">Test Performance Overview</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={testData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="avgScore" fill="#4F46E5" name="Average Score" />
                <Bar dataKey="highestScore" fill="#10B981" name="Highest Score" />
                <Bar dataKey="lowestScore" fill="#EF4444" name="Lowest Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Top Performing Students</h2>
            {/* Add top students list */}
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Areas for Improvement</h2>
            {/* Add improvement suggestions */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherAnalytics;