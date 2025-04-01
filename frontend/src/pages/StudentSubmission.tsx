import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Loader2, ChevronDown, ChevronUp, Award, Bookmark, Calendar, BarChart2, MessageSquare, BookOpen, AlertCircle } from "lucide-react";

interface Submission {
  saqId: string;
  title: string;
  course: {
    name: string;
    subject: string;
  };
  attemptsAllowed: number;
  attemptsUsed: number;
  submittedAt: string;
  answers: {
    questionId: string;
    answerText: string;
    score: string | number;
    feedback: string;
  }[];
  totalScore: number;
  percentageEarned?: number; // Added for true percentage calculation
}

const StudentSubmissions = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [expandedTest, setExpandedTest] = useState<string | null>(null);
  const [expandedAnswers, setExpandedAnswers] = useState<Record<string, boolean>>({});
  // Removed filterBy state
  const [sortBy, setSortBy] = useState<string>("recent");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Unauthorized: Please log in");
          navigate("/login");
          return;
        }

        const response = await axios.get<{ submissions: Submission[] }>(
          "http://localhost:5000/api/saq/student/submissions",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Calculate percentage earned for each submission
        const processedSubmissions = response.data.submissions.map(sub => {
          const questionCount = sub.answers.length;
          
          // Calculate sum of all question scores
          const totalMarksEarned = sub.answers.reduce((sum, answer) => {
            const score = typeof answer.score === 'string' ? parseFloat(answer.score) : answer.score;
            return sum + score;
          }, 0);
          
          // Calculate percentage as (totalMarksEarned / (questionCount * 10)) * 100
          const percentageEarned = questionCount > 0 
            ? (totalMarksEarned / (questionCount * 10)) * 100 
            : 0;
          
          return {
            ...sub,
            percentageEarned: Math.round(percentageEarned * 10) / 10 // Round to 1 decimal place
          };
        });

        setSubmissions(processedSubmissions);
      } catch (err: any) {
        if (err.response?.status === 401) {
          setError("Session expired. Please log in again.");
          navigate("/login");
        } else {
          setError("Failed to fetch submissions");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [navigate]);

  const toggleTestExpansion = (saqId: string) => {
    setExpandedTest(expandedTest === saqId ? null : saqId);
  };

  const toggleAnswerExpansion = (saqId: string, questionIndex: number) => {
    const key = `${saqId}-${questionIndex}`;
    setExpandedAnswers({
      ...expandedAnswers,
      [key]: !expandedAnswers[key]
    });
  };

  const isAnswerExpanded = (saqId: string, questionIndex: number) => {
    return expandedAnswers[`${saqId}-${questionIndex}`] || false;
  };

  const getScoreColor = (score: number | string, max: number = 10) => {
    const numScore = typeof score === 'string' ? parseFloat(score) : score;
    const percentage = (numScore / max) * 100;
    
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return "from-green-500 to-green-600";
    if (score >= 60) return "from-yellow-500 to-yellow-600";
    return "from-red-500 to-red-600";
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const filteredAndSortedSubmissions = () => {
    // Create a new array instead of mutating the original
    let sorted = [...submissions];
    
    // Removed filter logic
    
    // Sort - using stable unique identifiers to prevent duplicates
    if (sortBy === "recent") {
      sorted.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    } else if (sortBy === "oldest") {
      sorted.sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime());
    } else if (sortBy === "score-high") {
      sorted.sort((a, b) => {
        // First sort by percentage earned
        const scoreDiff = (b.percentageEarned || 0) - (a.percentageEarned || 0);
        // If scores are identical, use saqId as a tiebreaker to prevent duplicates
        return scoreDiff !== 0 ? scoreDiff : a.saqId.localeCompare(b.saqId);
      });
    } else if (sortBy === "score-low") {
      sorted.sort((a, b) => {
        // First sort by percentage earned
        const scoreDiff = (a.percentageEarned || 0) - (b.percentageEarned || 0);
        // If scores are identical, use saqId as a tiebreaker to prevent duplicates
        return scoreDiff !== 0 ? scoreDiff : a.saqId.localeCompare(b.saqId);
      });
    }
    
    return sorted;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">Loading your submissions...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start">
          <AlertCircle className="w-5 h-5 mr-2 mt-0.5" />
          <div>
            <p className="font-medium">Error: {error}</p>
            <p className="text-sm mt-1">Please try refreshing the page or log in again.</p>
          </div>
        </div>
      </div>
    );
  }

  const displaySubmissions = filteredAndSortedSubmissions();

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-t-lg shadow-md">
        <h1 className="text-2xl font-bold mb-2">Your SAQ Test Results</h1>
        <p className="text-blue-100">Track your performance across all submitted tests</p>
      </div>
      
      {/* Filters and Controls - Removed filter by score */}
      <div className="bg-white border-x border-t border-gray-200 p-4 flex flex-col md:flex-row justify-between items-center gap-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Sort by</label>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="recent">Most Recent</option>
            <option value="oldest">Oldest First</option>
            <option value="score-high">Highest Score</option>
            <option value="score-low">Lowest Score</option>
          </select>
        </div>
        
        <div className="text-sm text-gray-500 flex items-center w-full md:w-auto justify-end">
          <BarChart2 className="w-4 h-4 mr-1" />
          <span>Total Tests: {submissions.length}</span>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-gray-50 border border-gray-200 rounded-b-lg shadow-md p-6">
        {submissions.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-blue-50 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No Tests Submitted Yet</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              You haven't submitted any SAQ tests yet. Once you complete a test, your results will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {displaySubmissions.map((sub) => {
              // Calculate total questions and points for this submission
              const totalQuestions = sub.answers.length;
              const totalPossiblePoints = totalQuestions * 10;
              const totalEarnedPoints = sub.answers.reduce((sum, answer) => {
                const score = typeof answer.score === 'string' ? parseFloat(answer.score) : answer.score;
                return sum + score;
              }, 0);
              
              return (
                <div key={sub.saqId} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md">
                  {/* Test Header */}
                  <div 
                    className={`p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center cursor-pointer ${
                      expandedTest === sub.saqId ? "bg-blue-50" : ""
                    }`}
                    onClick={() => toggleTestExpansion(sub.saqId)}
                  >
                    <div className="flex items-start mb-3 sm:mb-0">
                      <div className="flex-shrink-0 mr-3">
                        <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${getScoreGradient(sub.percentageEarned)} flex items-center justify-center text-white font-bold text-sm`}>
                          {sub.percentageEarned?.toFixed(1)}%
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium text-lg text-gray-900">{sub.title}</h3>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Bookmark className="w-4 h-4 mr-1" />
                          <span>{sub.course.name} ({sub.course.subject})</span>
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          Score: {totalEarnedPoints}/{totalPossiblePoints} points
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{new Date(sub.submittedAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Award className="w-4 h-4 mr-1 text-indigo-600" />
                        <span className="text-gray-700">
                          Attempts: <span className="font-medium">{sub.attemptsUsed}/{sub.attemptsAllowed}</span>
                        </span>
                      </div>
                      <div className="text-gray-400 ml-auto sm:ml-0">
                        {expandedTest === sub.saqId ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </div>
                  </div>
                  
                  {/* Expanded Test Details */}
                  {expandedTest === sub.saqId && (
                    <div className="border-t border-gray-200 p-4">
                      <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                        <MessageSquare className="w-4 h-4 mr-2 text-blue-500" />
                        Your Answers
                      </h4>
                      
                      <div className="space-y-4">
                        {sub.answers.map((ans, index) => (
                          <div key={ans.questionId} className="bg-gray-50 rounded-md border border-gray-100 overflow-hidden">
                            <div 
                              className="p-3 flex justify-between items-start cursor-pointer hover:bg-gray-100"
                              onClick={() => toggleAnswerExpansion(sub.saqId, index)}
                            >
                              <div className="flex-grow">
                                <div className="flex items-center mb-1">
                                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-md mr-2">
                                    Question {index + 1}
                                  </span>
                                  <span className={`text-sm font-medium ${getScoreColor(ans.score)}`}>
                                    Score: {ans.score}/10
                                  </span>
                                </div>
                                <p className="text-gray-700">
                                  {truncateText(ans.answerText, isAnswerExpanded(sub.saqId, index) ? 10000 : 100)}
                                  {!isAnswerExpanded(sub.saqId, index) && ans.answerText.length > 100 && (
                                    <span className="text-blue-600 text-sm hover:underline ml-1 inline-flex items-center">
                                      View more <ChevronDown className="w-3 h-3 ml-0.5" />
                                    </span>
                                  )}
                                </p>
                              </div>
                              <div className="ml-2 text-gray-400">
                                {isAnswerExpanded(sub.saqId, index) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                              </div>
                            </div>
                            
                            {isAnswerExpanded(sub.saqId, index) && (
                              <div className="px-3 pb-3">
                                {ans.feedback && (
                                  <div className="mt-3 bg-indigo-50 p-3 rounded-md">
                                    <p className="text-xs font-medium text-indigo-700 mb-1">Teacher Feedback:</p>
                                    <p className="text-gray-700 text-sm">{ans.feedback}</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Performance Summary */}
      {submissions.length > 0 && (
        <div className="mt-6 bg-white border border-gray-200 rounded-lg shadow-sm p-4">
          <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
            <BarChart2 className="w-5 h-5 mr-2 text-blue-500" />
            Your Performance Overview
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-md">
              <p className="text-sm text-blue-700 mb-1">Average Percentage</p>
              <p className="text-2xl font-bold">
                {submissions.length > 0 
                  ? (submissions.reduce((acc, sub) => acc + (sub.percentageEarned || 0), 0) / submissions.length).toFixed(1)
                  : "0"}%
              </p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-md">
              <p className="text-sm text-green-700 mb-1">Highest Percentage</p>
              <p className="text-2xl font-bold">
                {submissions.length > 0 
                  ? Math.max(...submissions.map(sub => sub.percentageEarned || 0)).toFixed(1)
                  : "0"}%
              </p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-md">
              <p className="text-sm text-purple-700 mb-1">Tests Completed</p>
              <p className="text-2xl font-bold">{submissions.length}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentSubmissions;