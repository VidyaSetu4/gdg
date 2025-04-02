import React, { useState, useEffect } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import API_BASE_URL from "../../config";

interface TestData {
  name: string;
  avgScore: number;
  highestScore: number;
  lowestScore: number;
  totalSubmissions: number;
}

interface TopStudent {
  name: string;
  email: string;
  averageScore: number;
}

interface ImprovementArea {
  questionId: string;
  questionText: string;
  averageScore: number;
}

const TeacherAnalytics = () => {
  const [testData, setTestData] = useState<TestData[]>([]);
  const [topStudents, setTopStudents] = useState<TopStudent[]>([]);
  const [improvementAreas, setImprovementAreas] = useState<ImprovementArea[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Unauthorized: No token provided");
          setLoading(false);
          return;
        }

        const response = await axios.get<{
          tests: TestData[];
          topStudents: TopStudent[];
          improvementAreas: ImprovementArea[];
        }>(`${API_BASE_URL}/api/saq/teacher/analytics`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTestData(response.data.tests);
        setTopStudents(response.data.topStudents);
        setImprovementAreas(response.data.improvementAreas);
      } catch (err) {
        setError("Failed to fetch analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) return <p>Loading analytics...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Analytics</h1>

      <div className="grid gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-6">Test Performance Overview</h2>
          {testData.length === 0 ? (
            <p>No tests submitted yet.</p>
          ) : (
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
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Top Performing Students</h2>
            {topStudents.length === 0 ? (
              <p>No student data available.</p>
            ) : (
              <ul>
                {topStudents.map((student) => (
                  <li key={student.email} className="mb-2">
                    {student.name} ({student.email}) - Avg Score: {student.averageScore}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Areas for Improvement</h2>
            {improvementAreas.length === 0 ? (
              <p>No areas identified for improvement.</p>
            ) : (
              <ul>
                {improvementAreas.map((area) => (
                  <li key={area.questionId} className="mb-2">
                    {area.questionText} - Avg Score: {area.averageScore}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherAnalytics;