import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea"; // Update the path to the correct location
import { Progress } from "../components/ui/progress";
import { Separator } from "../components/ui/separator";
import { Badge } from "../components/ui/badge";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import API_BASE_URL from "../../config"; // Adjust the import path as necessary
// Define the SAQ test structure
interface SAQTest {
    _id: string;
    title: string;
    course: {
        _id: string;
        name: string;
        subject: string;
    };
    teacher: string;
    questions: {
        questionText: string;
        _id: string;
    }[];
    attemptsAllowed: number;
    attemptsUsed: number;
    attemptsRemaining: number;
    canAttempt: boolean;
    createdAt: string;
}

// Define the structure of an answer
interface Answer {
    questionId: string;
    answerText: string;
}

// Define the submission result structure
interface SubmissionResult {
    answers: {
        questionId: string;
        answerText: string;
        score: number;
        feedback: string;
    }[];
    totalScore: number;
}

const AttemptSAQ = () => {
    const { testId } = useParams<{ testId: string }>();
    const [test, setTest] = useState<SAQTest | null>(null);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [remainingTime, setRemainingTime] = useState<number>(60 * 60); // 60 minutes in seconds
    const [activeTab, setActiveTab] = useState<string>("instructions");
    const [submitting, setSubmitting] = useState<boolean>(false);
    const navigate = useNavigate();

    // Fetch the SAQ test details
    useEffect(() => {
        const fetchTest = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("Unauthorized: No token provided");
                    setLoading(false);
                    return;
                }

                const response = await axios.get<{ tests: SAQTest[] }>(
                    `${API_BASE_URL}/api/saq/student/available-tests`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                const selectedTest = response.data.tests.find((t) => t._id === testId);
                if (!selectedTest) {
                    setError("Test not found or you're not eligible to attempt it");
                    setLoading(false);
                    return;
                }

                setTest(selectedTest);
                setAnswers(
                    selectedTest.questions.map((q) => ({
                        questionId: q._id,
                        answerText: "",
                    }))
                );
                setActiveTab("test");
            } catch (err) {
                setError("Failed to fetch test details");
            } finally {
                setLoading(false);
            }
        };

        fetchTest();
    }, [testId]);

    // Timer effect
    useEffect(() => {
        if (loading || submissionResult || activeTab === "instructions") return;

        const timer = setInterval(() => {
            setRemainingTime((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit(null);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [loading, submissionResult, activeTab]);

    // Format time as MM:SS
    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    // Handle answer input changes
    const handleAnswerChange = (questionId: string, value: string) => {
        setAnswers((prevAnswers) =>
            prevAnswers.map((ans) =>
                ans.questionId === questionId ? { ...ans, answerText: value } : ans
            )
        );
    };

    // Navigate to next question
    const nextQuestion = () => {
        if (test && currentQuestionIndex < test.questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
        }
    };

    // Navigate to previous question
    const prevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex((prev) => prev - 1);
        }
    };

    // Navigate to specific question
    const goToQuestion = (index: number) => {
        setCurrentQuestionIndex(index);
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent | null) => {
        if (e) e.preventDefault();
        
        setSubmitting(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Unauthorized: No token provided");
                setSubmitting(false);
                return;
            }

            // Submit answers
            const submitResponse = await axios.post(
                `${API_BASE_URL}/api/saq/submit`,
                {
                    saqId: testId,
                    answers,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const submissionId = submitResponse.data.submission._id;

            // Trigger AI evaluation
            const evaluateResponse = await axios.post(
                `${API_BASE_URL}/api/saq/evaluate`,
                { submissionId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const evaluatedSubmission = evaluateResponse.data.submission;
            setSubmissionResult({
                answers: evaluatedSubmission.answers,
                totalScore: evaluatedSubmission.answers.reduce((sum: number, ans: any) => sum + (ans.score || 0), 0),
            });
            setActiveTab("results");
        } catch (err) {
            console.error("Error during submission or evaluation:", err);
            setError("Failed to submit or evaluate SAQ");
        } finally {
            setSubmitting(false);
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-lg">Loading your test...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <Card className="w-full max-w-3xl mx-auto mt-8">
                <CardHeader className="bg-red-50">
                    <div className="flex items-center">
                        <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
                        <CardTitle className="text-red-500">Error</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <p>{error}</p>
                </CardContent>
                <CardFooter>
                    <Button onClick={() => navigate("/student-dashboard")}>
                        Return to Dashboard
                    </Button>
                </CardFooter>
            </Card>
        );
    }

    // Test not found state
    if (!test) {
        return (
            <Card className="w-full max-w-3xl mx-auto mt-8">
                <CardHeader className="bg-yellow-50">
                    <div className="flex items-center">
                        <AlertCircle className="h-6 w-6 text-yellow-500 mr-2" />
                        <CardTitle className="text-yellow-500">Test Not Found</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <p>The test you're looking for doesn't exist or you don't have access to it.</p>
                </CardContent>
                <CardFooter>
                    <Button onClick={() => navigate("/student-dashboard")}>
                        Return to Dashboard
                    </Button>
                </CardFooter>
            </Card>
        );
    }

    return (
        <div className="container mx-auto p-4 max-w-6xl">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">{test.title}</h1>
                        <p className="text-gray-600">
                            Course: {test.course.name} ({test.course.subject})
                        </p>
                    </div>
                    
                    {activeTab === "test" && !submissionResult && (
                        <div className="flex items-center">
                            <Clock className="h-5 w-5 text-blue-500 mr-2" />
                            <span className="font-mono text-lg font-semibold">
                                {formatTime(remainingTime)}
                            </span>
                        </div>
                    )}
                </div>
                
                <TabsList className="grid grid-cols-3 mb-8">
                    <TabsTrigger value="instructions">Instructions</TabsTrigger>
                    <TabsTrigger value="test" disabled={!test.canAttempt || !!submissionResult}>
                        Test
                    </TabsTrigger>
                    <TabsTrigger value="results" disabled={!submissionResult}>
                        Results
                    </TabsTrigger>
                </TabsList>
                
                <TabsContent value="instructions">
                    <Card>
                        <CardHeader className="bg-blue-50">
                            <CardTitle>Test Instructions</CardTitle>
                            <CardDescription>
                                Please read these instructions carefully before starting the test
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div>
                                <h3 className="font-semibold mb-2">Test Information</h3>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Test title: {test.title}</li>
                                    <li>Course: {test.course.name} ({test.course.subject})</li>
                                    <li>Teacher: {test.teacher}</li>
                                    <li>Number of questions: {test.questions.length}</li>
                                    <li>Time limit: 60 minutes</li>
                                </ul>
                            </div>
                            
                            <div>
                                <h3 className="font-semibold mb-2">Attempt Status</h3>
                                <div className="flex items-center space-x-2 mb-2">
                                    <span>Attempts used: {test.attemptsUsed}</span>
                                    <span>/</span>
                                    <span>Attempts allowed: {test.attemptsAllowed}</span>
                                </div>
                                <Progress value={(test.attemptsUsed / test.attemptsAllowed) * 100} className="h-2" />
                            </div>
                            
                            <div className="bg-yellow-50 p-4 rounded-md">
                                <h3 className="font-semibold mb-2 text-yellow-800">Important Notes</h3>
                                <ul className="list-disc pl-5 space-y-1 text-yellow-800">
                                    <li>Once you start the test, the timer cannot be paused.</li>
                                    <li>Your answers are saved automatically as you type.</li>
                                    <li>You must submit before the time expires or your answers will be submitted automatically.</li>
                                    <li>You have {test.attemptsRemaining} attempt(s) remaining for this test.</li>
                                </ul>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button 
                                onClick={() => setActiveTab("test")} 
                                disabled={!test.canAttempt}
                                className="w-full"
                            >
                                Start Test
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
                
                <TabsContent value="test">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {/* Question navigation sidebar */}
                        <div className="hidden md:block">
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg">Questions</CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-4 gap-2">
                                    {test.questions.map((_, idx) => (
                                        <Button 
                                            key={idx} 
                                            variant={currentQuestionIndex === idx ? "default" : 
                                                answers[idx]?.answerText ? "outline" : "secondary"}
                                            size="sm"
                                            onClick={() => goToQuestion(idx)}
                                            className="h-10 w-10"
                                        >
                                            {idx + 1}
                                        </Button>
                                    ))}
                                </CardContent>
                                <CardFooter>
                                    <Badge variant="outline" className="w-full justify-center">
                                        {currentQuestionIndex + 1} of {test.questions.length}
                                    </Badge>
                                </CardFooter>
                            </Card>
                            
                            <Card className="mt-4">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg">Test Status</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Time Remaining</p>
                                        <div className="font-mono text-lg font-semibold">
                                            {formatTime(remainingTime)}
                                        </div>
                                        <Progress 
                                            value={(remainingTime / (60 * 60)) * 100} 
                                            className="h-2 mt-2" 
                                        />
                                    </div>
                                    
                                    <div>
                                        <p className="text-sm text-gray-500">Answered</p>
                                        <div className="font-semibold">
                                            {answers.filter(a => a.answerText.trim()).length} of {test.questions.length}
                                        </div>
                                        <Progress 
                                            value={(answers.filter(a => a.answerText.trim()).length / test.questions.length) * 100} 
                                            className="h-2 mt-2" 
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        
                        {/* Main question and answer area */}
                        <div className="md:col-span-3">
                            <Card>
                                <CardHeader className="bg-gray-50 border-b">
                                    <div className="flex justify-between items-center">
                                        <CardTitle className="text-lg">
                                            Question {currentQuestionIndex + 1}
                                        </CardTitle>
                                        <div className="md:hidden flex items-center">
                                            <Clock className="h-4 w-4 text-blue-500 mr-1" />
                                            <span className="font-mono text-sm">
                                                {formatTime(remainingTime)}
                                            </span>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="space-y-6">
                                        <div className="bg-blue-50 p-4 rounded-md">
                                            <p className="font-medium">
                                                {test.questions[currentQuestionIndex].questionText}
                                            </p>
                                        </div>
                                        
                                        <div>
                                            <label className="text-sm font-medium text-gray-700 block mb-2">
                                                Your Answer:
                                            </label>
                                            <Textarea
                                                value={answers.find((ans) => ans.questionId === test.questions[currentQuestionIndex]._id)?.answerText || ""}
                                                onChange={(e) => handleAnswerChange(test.questions[currentQuestionIndex]._id, e.target.value)}
                                                placeholder="Type your answer here..."
                                                className="min-h-[200px]"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between border-t pt-4">
                                    <div className="flex space-x-2">
                                        <Button 
                                            variant="outline" 
                                            onClick={prevQuestion} 
                                            disabled={currentQuestionIndex === 0}
                                        >
                                            Previous
                                        </Button>
                                        <Button 
                                            variant="outline" 
                                            onClick={nextQuestion}
                                            disabled={currentQuestionIndex === test.questions.length - 1}
                                        >
                                            Next
                                        </Button>
                                    </div>
                                    
                                    <div className="md:hidden flex flex-col items-end">
                                        <p className="text-xs text-gray-500">
                                            {answers.filter(a => a.answerText.trim()).length} of {test.questions.length} answered
                                        </p>
                                        <Progress 
                                            value={(answers.filter(a => a.answerText.trim()).length / test.questions.length) * 100} 
                                            className="h-1 w-24 mt-1" 
                                        />
                                    </div>
                                </CardFooter>
                            </Card>
                            
                            <div className="mt-6 flex justify-end">
                                <Button 
                                    onClick={(e) => handleSubmit(e)} 
                                    disabled={submitting || test.attemptsRemaining <= 0}
                                    className="w-full md:w-auto"
                                >
                                    {submitting ? "Submitting..." : "Submit All Answers"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </TabsContent>
                
                <TabsContent value="results">
                    {submissionResult && (
                        <Card>
                            <CardHeader className="bg-green-50 border-b">
                                <div className="flex items-center">
                                    <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
                                    <CardTitle>Submission Results</CardTitle>
                                </div>
                                <CardDescription>
                                    Your answers have been evaluated
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold mb-2">Score Summary</h3>
                                    <div className="bg-gray-50 p-4 rounded-md">
                                        <div className="text-3xl font-bold text-center">
                                            {submissionResult.totalScore} <span className="text-lg text-gray-500">/ {submissionResult.answers.length * 10}</span>
                                        </div>
                                        <Progress 
                                            value={(submissionResult.totalScore / (submissionResult.answers.length * 10)) * 100} 
                                            className="h-2 mt-2" 
                                        />
                                    </div>
                                </div>
                                
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold">Detailed Feedback</h3>
                                    
                                    {submissionResult.answers.map((ans, index) => (
                                        <div key={ans.questionId} className="border rounded-md overflow-hidden">
                                            <div className="bg-gray-50 p-3 border-b">
                                                <h4 className="font-medium">Question {index + 1}</h4>
                                                <p className="text-sm text-gray-600">{test.questions[index].questionText}</p>
                                            </div>
                                            
                                            <div className="p-4">
                                                <h5 className="text-sm font-medium text-gray-600">Your Answer:</h5>
                                                <p className="mt-1 mb-3 bg-blue-50 p-2 rounded">{ans.answerText}</p>
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <h5 className="text-sm font-medium text-gray-600">Score:</h5>
                                                        <div className="mt-1 flex items-center">
                                                            <span className="text-xl font-bold">{ans.score}</span>
                                                            <span className="text-sm text-gray-500 ml-1">/ 10</span>
                                                        </div>
                                                    </div>
                                                    
                                                    <div>
                                                        <h5 className="text-sm font-medium text-gray-600">Feedback:</h5>
                                                        <p className="mt-1 text-sm">{ans.feedback}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between pt-4 border-t">
                                <Button variant="outline" onClick={() => navigate("/student-dashboard")}>
                                    Return to Dashboard
                                </Button>
                                <Button onClick={() => navigate("/student/submissions")}>
                                    View All Submissions
                                </Button>
                            </CardFooter>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AttemptSAQ;