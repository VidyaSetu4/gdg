import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Download, 
  RefreshCw,
  Award
} from "lucide-react";

interface Submission {
  studentId: string;
  studentName: string;
  studentEmail: string;
  submittedAt: string;
  attempts: number;
  answers: { questionId: string; answerText: string; score: string | number; feedback: string }[];
  totalScore: number;
}

const TeacherSAQSubmissions = () => {
  const { saqId } = useParams<{ saqId: string }>();
  const [submissionCount, setSubmissionCount] = useState<number>(0);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>([]);
  const [title, setTitle] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [expandedStudents, setExpandedStudents] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortConfig, setSortConfig] = useState<{key: string, direction: 'asc' | 'desc'}>({
    key: 'totalScore',
    direction: 'desc'
  });
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    fetchSubmissions();
  }, [saqId]);

  useEffect(() => {
    // Filter and sort submissions whenever search term or sort config changes
    let filtered = [...submissions];
    
    if (searchTerm) {
      filtered = filtered.filter(sub => 
        sub.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.studentEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    filtered.sort((a, b) => {
      if (sortConfig.key === 'studentName') {
        return sortConfig.direction === 'asc' 
          ? a.studentName.localeCompare(b.studentName)
          : b.studentName.localeCompare(a.studentName);
      } else {
        const aValue = a[sortConfig.key as keyof Submission];
        const bValue = b[sortConfig.key as keyof Submission];
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
        }
        return 0;
      }
    });
    
    setFilteredSubmissions(filtered);
  }, [submissions, searchTerm, sortConfig]);

  const fetchSubmissions = async () => {
    setRefreshing(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized: No token provided");
        setLoading(false);
        return;
      }

      const response = await axios.get<{
        saqId: string;
        title: string;
        submissionCount: number;
        submissions: Submission[];
      }>(`http://localhost:5000/api/saq/teacher/saq/${saqId}/submissions`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTitle(response.data.title);
      setSubmissionCount(response.data.submissionCount);
      setSubmissions(response.data.submissions);
    } catch (err) {
      setError("Failed to fetch submissions");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const toggleExpand = (studentId: string) => {
    setExpandedStudents(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getScoreClass = (score: number) => {
    if (score >= 90) return "bg-green-100 text-green-800";
    if (score >= 70) return "bg-blue-100 text-blue-800";
    if (score >= 50) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading submissions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-6 text-center">
        <p className="text-red-700 text-lg">Error: {error}</p>
        <button 
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700" 
          onClick={fetchSubmissions}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
          <p className="text-gray-600">
            <span className="font-semibold">{submissionCount}</span> {submissionCount === 1 ? 'Submission' : 'Submissions'}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          
          <button 
            onClick={fetchSubmissions}
            disabled={refreshing}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} size={18} />
            Refresh
          </button>
          
          <button className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
            <Download className="mr-2" size={18} />
            Export
          </button>
        </div>
      </div>

      {submissionCount === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No submissions yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('studentName')}
                >
                  <div className="flex items-center">
                    Student Name
                    {sortConfig.key === 'studentName' && (
                      sortConfig.direction === 'asc' ? 
                      <ChevronUp size={16} className="ml-1" /> : 
                      <ChevronDown size={16} className="ml-1" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('attempts')}
                >
                  <div className="flex items-center">
                    Attempts
                    {sortConfig.key === 'attempts' && (
                      sortConfig.direction === 'asc' ? 
                      <ChevronUp size={16} className="ml-1" /> : 
                      <ChevronDown size={16} className="ml-1" />
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('totalScore')}
                >
                  <div className="flex items-center">
                    Total Score
                    {sortConfig.key === 'totalScore' && (
                      sortConfig.direction === 'asc' ? 
                      <ChevronUp size={16} className="ml-1" /> : 
                      <ChevronDown size={16} className="ml-1" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSubmissions.map((sub) => (
                <React.Fragment key={sub.studentId}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-800 font-medium">
                            {sub.studentName.split(' ').map(name => name[0]).join('')}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{sub.studentName}</div>
                          <div className="text-sm text-gray-500">Submitted: {formatDate(sub.submittedAt)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{sub.studentEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{sub.attempts}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreClass(Number(sub.totalScore))}`}>
                        <Award size={16} className="inline mr-1" />
                        {sub.totalScore}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => toggleExpand(sub.studentId)}
                        className="flex items-center text-blue-600 hover:text-blue-900"
                      >
                        {expandedStudents[sub.studentId] ? (
                          <>Hide Details <ChevronUp size={16} className="ml-1" /></>
                        ) : (
                          <>View Details <ChevronDown size={16} className="ml-1" /></>
                        )}
                      </button>
                    </td>
                  </tr>
                  {expandedStudents[sub.studentId] && (
                    <tr>
                      <td colSpan={5} className="bg-gray-50 px-6 py-4">
                        <div className="border rounded-lg bg-white p-4">
                          <h3 className="font-medium text-lg text-gray-900 mb-3">Student Responses</h3>
                          {sub.answers.map((ans, index) => (
                            <div key={ans.questionId} className="mb-6 border-b pb-4 last:border-b-0">
                              <h4 className="font-medium text-gray-800 mb-2">Question {index + 1}</h4>
                              <div className="bg-gray-50 p-3 rounded mb-2">
                                <p className="text-gray-700 whitespace-pre-wrap">{ans.answerText}</p>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                                <div>
                                  <p className="text-sm text-gray-500">Score</p>
                                  <p className="font-medium">{ans.score}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Feedback</p>
                                  <p className="text-gray-700">{ans.feedback || "No feedback provided"}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TeacherSAQSubmissions;