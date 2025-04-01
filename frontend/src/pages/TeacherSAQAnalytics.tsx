import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface AnalyticsData {
  saqId: string;
  title: string;
  totalSubmissions: number;
  averageScore: string;
  highestScore: number;
  lowestScore: number;
  scoreDistribution: { [key: string]: number };
}

const TeacherSAQAnalytics = () => {
  const { saqId } = useParams<{ saqId: string }>();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
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

        const response = await axios.get<AnalyticsData>(
          `http://localhost:5000/api/saq/teacher/saq/${saqId}/analytics`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setAnalytics(response.data);
      } catch (err) {
        setError("Failed to fetch analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [saqId]);

  if (loading) return <p>Loading analytics...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!analytics) return <p>No analytics data available</p>;

  // Prepare data for Bar chart
  const chartData = {
    labels: Object.keys(analytics.scoreDistribution),
    datasets: [
      {
        label: "Number of Students",
        data: Object.values(analytics.scoreDistribution),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: { beginAtZero: true, title: { display: true, text: "Number of Students" } },
      x: { title: { display: true, text: "Score Range" } },
    },
    plugins: { legend: { display: false }, title: { display: true, text: `${analytics.title} Score Distribution` } },
  };

  return (
    <div>
      <h2>Analytics for {analytics.title}</h2>
      <table style={{ width: "50%", marginBottom: "20px", borderCollapse: "collapse" }}>
        <tbody>
          <tr>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>Total Submissions</td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>{analytics.totalSubmissions}</td>
          </tr>
          <tr>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>Average Score</td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>{analytics.averageScore}</td>
          </tr>
          <tr>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>Highest Score</td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>{analytics.highestScore}</td>
          </tr>
          <tr>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>Lowest Score</td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>{analytics.lowestScore}</td>
          </tr>
        </tbody>
      </table>

      <div style={{ width: "60%", margin: "0 auto" }}>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default TeacherSAQAnalytics;