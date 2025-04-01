import express from "express";
import { body, validationResult } from "express-validator";
import SAQ from "../models/SAQSchema";
import Teacher from "../models/TeacherDB";
import Student from "../models/StudentDB";
import Course from "../models/CourseSchema";
import SAQSubmission from "../models/SAQSubmission.js";
import { evaluateSAQ } from "../utils/aiEvaluator.js"; // Updated AI function

import jwt from "jsonwebtoken";

const router = express.Router();

router.post(
    "/create",
    [

        body("title", "Title is required").notEmpty(),
        body("courseId", "Course ID is required").notEmpty(),
        body("questions", "Questions must be an array").isArray(),
        body("questions.*.questionText", "Each question must have text").notEmpty(),
        body("attemptsAllowed", "Attempts should be a number").optional().isInt({ min: 1 }),
    ],
    async (req, res) => {
        try {
            // Validate request body
            const errors = validationResult(req);
            if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

            // Extract teacher ID from JWT
            const token = req.headers.authorization;
            if (!token) return res.status(401).json({ error: "Unauthorized: No token provided" });

            const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
            const teacher = await Teacher.findById(decoded.id);
            if (!teacher) {
                return res.status(403).json({ error: "Access denied. Only teachers can create SAQs." });
            }
            if (!teacher.subjectSpeciality || !Array.isArray(teacher.subjectSpeciality)) {
                return res.status(400).json({ error: "Teacher subjectSpeciality data is missing or incorrect" });

            }
            const { title, courseId, questions, attemptsAllowed } = req.body;

            const course = await Course.findById(courseId);
            if (!course) return res.status(404).json({ error: "Course not found" });

            if (!teacher.subjectSpeciality.includes(course.subject)) {
                return res.status(403).json({ error: "You can only create SAQs for your assigned subjects." });
            }


            const newSAQ = new SAQ({
                title,
                course: courseId,
                teacher: decoded.id,
                questions,
                attemptsAllowed: attemptsAllowed || 1,
            });

            await newSAQ.save();
            res.status(201).json({ message: "SAQ created successfully!", saq: newSAQ });
        } catch (error) {
            console.error("Error creating SAQ:", error);
            res.status(500).json({ error: "Server error" });
        }
    }
);

router.get("/student", async (req, res) => {
    try {
        const token = req.headers.authorization;
        if (!token) return res.status(401).json({ error: "Unauthorized: No token provided" });

        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
        const student = await Student.findById(decoded.id);

        if (!student) return res.status(403).json({ error: "Access denied. Only students can view SAQs." });

        // Fetch SAQs for the subjects student is enrolled in
        const saqs = await SAQ.find({ course: { $in: student.enrolledCourses } });

        res.status(200).json({ saqs });
    } catch (error) {
        console.error("Error fetching SAQs:", error);
        res.status(500).json({ error: "Server error" });
    }
});

router.post("/submit", async (req, res) => {
    try {
      const token = req.headers.authorization;
      if (!token) return res.status(401).json({ error: "Unauthorized: No token provided" });
  
      const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
      const student = await Student.findById(decoded.id);
      if (!student) return res.status(403).json({ error: "Access denied. Only students can submit SAQs." });
  
      const { saqId, answers } = req.body;
      const saq = await SAQ.findById(saqId);
      if (!saq) return res.status(404).json({ error: "SAQ not found." });
  
      // Check for existing submission
      let submission = await SAQSubmission.findOne({ saq: saqId, student: student._id });
  
      if (submission) {
        if (submission.attempts >= saq.attemptsAllowed) {
          return res.status(403).json({ error: "Maximum attempts reached for this SAQ." });
        }
        // Update existing submission
        submission.attempts += 1;
        submission.answers = answers; // Overwrite answers with the latest submission
        await submission.save();
      } else {
        // Create new submission for first attempt
        submission = new SAQSubmission({
          saq: saqId,
          student: student._id,
          answers,
          attempts: 1,
        });
        await submission.save();
      }
  
      res.status(201).json({ message: "SAQ submitted successfully!", submission });
    } catch (error) {
      console.error("Error submitting SAQ:", error);
      res.status(500).json({ error: "Server error" });
    }
  });

router.post("/evaluate", async (req, res) => {
    try {
        const { submissionId } = req.body;

        const submission = await SAQSubmission.findById(submissionId).populate("saq");
        if (!submission) return res.status(404).json({ error: "Submission not found." });

        let updatedAnswers = [];

        for (let answer of submission.answers) {
            const question = submission.saq.questions.find(q => q._id.equals(answer.questionId));
            if (!question) continue;

            // Evaluate using Gemini API
            const { score, feedback } = await evaluateSAQ(question.questionText, answer.answerText);

            // Update answer object
            updatedAnswers.push({
                questionId: answer.questionId,
                answerText: answer.answerText,
                score,
                feedback
            });
        }

        // Save updated answers
        submission.answers = updatedAnswers;
        await submission.save();

        res.json({ message: "Evaluation completed!", submission });
    } catch (error) {
        console.error("Error in AI evaluation:", error);
        res.status(500).json({ error: "Server error" });
    }
});

router.get("/scores/:saqTestId", async (req, res) => {
    try {
        const token = req.headers.authorization;
        if (!token) return res.status(401).json({ error: "Unauthorized: No token provided" });

        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
        const teacher = await Teacher.findById(decoded.id);
        if (!teacher) return res.status(403).json({ error: "Access denied. Only teachers can view scores." });

        const saq = await SAQ.findById(req.params.saqTestId);
        if (!saq || saq.teacher.toString() !== teacher._id.toString()) {
            return res.status(403).json({ error: "You can only view scores for your own SAQ tests." });
        }

        const scores = await SAQSubmission.find({ saq: req.params.saqTestId })
            .populate("student", "name")
            .select("student answers createdAt");

        if (!scores.length) {
            return res.status(404).json({ message: "No scores found for this SAQ test." });
        }

        const formattedScores = scores.map((submission) => ({
            studentId: submission.student._id,
            studentName: submission.student.name,
            submittedAt: submission.createdAt,
            answers: submission.answers.map((ans) => ({
                questionId: ans.questionId,
                answerText: ans.answerText,
                score: ans.score || "Not evaluated",
                feedback: ans.feedback || "Not evaluated",
            })),
            totalScore: submission.answers.reduce((sum, ans) => sum + (ans.score || 0), 0),
        }));

        res.status(200).json({
            saqId: req.params.saqTestId,
            title: saq.title,
            submissionCount: scores.length,
            scores: formattedScores,
        });
    } catch (error) {
        console.error("Error fetching scores:", error);
        res.status(500).json({ error: "Server error" });
    }
});
router.get("/student/available-tests", async (req, res) => {
    try {
        // Extract and verify student from JWT
        const token = req.headers.authorization;
        if (!token) return res.status(401).json({ error: "Unauthorized: No token provided" });

        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
        const student = await Student.findById(decoded.id);
        if (!student) return res.status(403).json({ error: "Access denied. Only students can view available tests." });

        // Fetch all SAQs for the student's enrolled courses
        const saqs = await SAQ.find({ course: { $in: student.enrolledCourses } })
            .populate("course", "name subject") // Populate course details
            .populate("teacher", "name"); // Populate teacher name

        // Fetch all submissions for this student
        const submissions = await SAQSubmission.find({ student: student._id });

        // Map SAQs with attempt status
        const availableTests = saqs.map((saq) => {
            const submissionForSAQ = submissions.find((sub) =>
                sub.saq.toString() === saq._id.toString()
            );

            const attemptsUsed = submissionForSAQ ? submissionForSAQ.attempts : 0;
            const attemptsRemaining = saq.attemptsAllowed - attemptsUsed;
            const canAttempt = attemptsRemaining > 0;

            return {
                _id: saq._id,
                title: saq.title,
                course: {
                    _id: saq.course._id,
                    name: saq.course.name,
                    subject: saq.course.subject,
                },
                teacher: saq.teacher.name,
                questions: saq.questions,
                attemptsAllowed: saq.attemptsAllowed,
                attemptsUsed,
                attemptsRemaining,
                canAttempt,
                createdAt: saq.createdAt,
            };
        });

        res.status(200).json({ tests: availableTests });
    } catch (error) {
        console.error("Error fetching available SAQ tests:", error);
        res.status(500).json({ error: "Server error" });
    }
});

router.get("/:saqId", async (req, res) => {
    try {
        const saq = await SAQ.findById(req.params.saqId)
            .populate("course", "name subject")
            .populate("teacher", "name");
        if (!saq) return res.status(404).json({ error: "SAQ not found" });
        res.status(200).json(saq);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

router.get("/teacher/saq/:saqId/submissions", async (req, res) => {
    try {
      const token = req.headers.authorization;
      if (!token) return res.status(401).json({ error: "Unauthorized: No token provided" });
  
      const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
      const teacher = await Teacher.findById(decoded.id);
      if (!teacher) return res.status(403).json({ error: "Access denied. Only teachers can view submissions." });
  
      const saq = await SAQ.findById(req.params.saqId);
      if (!saq || saq.teacher.toString() !== teacher._id.toString()) {
        return res.status(403).json({ error: "You can only view submissions for your own SAQ tests." });
      }
  
      const submissions = await SAQSubmission.find({ saq: req.params.saqId })
        .populate("student", "name email")
        .select("student answers attempts createdAt");
  
      const submissionCount = submissions.length;
      const formattedSubmissions = submissions.map((sub) => ({
        studentId: sub.student._id,
        studentName: sub.student.name,
        studentEmail: sub.student.email,
        submittedAt: sub.createdAt,
        attempts: sub.attempts,
        answers: sub.answers.map((ans) => ({
          questionId: ans.questionId,
          answerText: ans.answerText,
          score: ans.score !== null ? ans.score : "Not evaluated",
          feedback: ans.feedback || "Not evaluated",
        })),
        totalScore: sub.answers.reduce((sum, ans) => sum + (ans.score || 0), 0), // Calculate total score
      }));
  
      res.status(200).json({
        saqId: req.params.saqId,
        title: saq.title,
        submissionCount,
        submissions: formattedSubmissions,
      });
    } catch (error) {
      console.error("Error fetching submissions:", error);
      res.status(500).json({ error: "Server error" });
    }
  });

router.get("/teacher/tests", async (req, res) => {
    try {
      const token = req.headers.authorization;
      if (!token) return res.status(401).json({ error: "Unauthorized: No token provided" });
  
      const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
      const teacher = await Teacher.findById(decoded.id);
      if (!teacher) return res.status(403).json({ error: "Access denied. Only teachers can view their tests." });
  
      const tests = await SAQ.find({ teacher: teacher._id }).select("title course attemptsAllowed createdAt");
      res.status(200).json(tests);
    } catch (error) {
      console.error("Error fetching teacher tests:", error);
      res.status(500).json({ error: "Server error" });
    }
  });

  router.get("/student/submissions", async (req, res) => {
    try {
      const token = req.headers.authorization;
      if (!token || !token.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized: Invalid token format" });
      }
  
      const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
      const student = await Student.findById(decoded.id);
      if (!student) {
        return res.status(403).json({ error: "Access denied. Only students can view their submissions." });
      }
  
      const submissions = await SAQSubmission.find({ student: student._id })
        .populate("saq", "title course attemptsAllowed")
        .populate({
          path: "saq",
          populate: { path: "course", select: "name subject" },
        })
        .select("answers attempts createdAt");
  
      if (!submissions.length) {
        return res.status(200).json({ message: "No submissions found.", submissions: [] });
      }
  
      const formattedSubmissions = submissions.map((sub) => ({
        saqId: sub.saq._id,
        title: sub.saq.title,
        course: {
          name: sub.saq.course.name,
          subject: sub.saq.course.subject,
        },
        attemptsAllowed: sub.saq.attemptsAllowed,
        attemptsUsed: sub.attempts,
        submittedAt: sub.createdAt,
        answers: sub.answers.map((ans) => ({
          questionId: ans.questionId,
          answerText: ans.answerText,
          score: ans.score || "Not evaluated",
          feedback: ans.feedback || "Not evaluated",
        })),
        totalScore: sub.answers.reduce((sum, ans) => sum + (ans.score || 0), 0),
      }));
  
      res.status(200).json({ submissions: formattedSubmissions });
    } catch (error) {
      console.error("Error fetching student submissions:", error);
      res.status(500).json({ error: "Server error" });
    }
  });

  router.get("/teacher/saq/:saqId/analytics", async (req, res) => {
    try {
      const token = req.headers.authorization;
      if (!token || !token.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized: Invalid token format" });
      }
  
      const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
      const teacher = await Teacher.findById(decoded.id);
      if (!teacher) return res.status(403).json({ error: "Access denied. Only teachers can view analytics." });
  
      const saq = await SAQ.findById(req.params.saqId);
      if (!saq || saq.teacher.toString() !== teacher._id.toString()) {
        return res.status(403).json({ error: "You can only view analytics for your own SAQ tests." });
      }
  
      const submissions = await SAQSubmission.find({ saq: req.params.saqId });
      const totalSubmissions = submissions.length;
  
      if (totalSubmissions === 0) {
        return res.status(200).json({
          saqId: req.params.saqId,
          title: saq.title,
          totalSubmissions: 0,
          averageScore: 0,
          highestScore: 0,
          lowestScore: 0,
          scoreDistribution: {},
        });
      }
  
      // Calculate total scores for each submission
      const scores = submissions.map((sub) =>
        sub.answers.reduce((sum, ans) => sum + (ans.score || 0), 0)
      );
  
      // Basic stats
      const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
      const highestScore = Math.max(...scores);
      const lowestScore = Math.min(...scores);
  
      // Calculate score distribution (assuming max score is sum of questions' potential scores)
      const maxPossibleScore = saq.questions.length * 10; // Adjust based on your scoring logic (e.g., 10 points per question)
      const rangeSize = 5; // Scores grouped in ranges of 5 (e.g., 0-5, 6-10)
      const scoreDistribution = {};
      for (let i = 0; i <= maxPossibleScore; i += rangeSize) {
        const rangeKey = `${i}-${i + rangeSize - 1}`;
        scoreDistribution[rangeKey] = scores.filter(
          (score) => score >= i && score <= i + rangeSize - 1
        ).length;
      }
  
      res.status(200).json({
        saqId: req.params.saqId,
        title: saq.title,
        totalSubmissions,
        averageScore: averageScore.toFixed(2),
        highestScore,
        lowestScore,
        scoreDistribution,
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ error: "Server error" });
    }
  });
  
  router.get("/teacher/analytics", async (req, res) => {
    try {
      const token = req.headers.authorization;
      if (!token || !token.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized: Invalid token format" });
      }
  
      const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
      const teacher = await Teacher.findById(decoded.id);
      if (!teacher) return res.status(403).json({ error: "Access denied. Only teachers can view analytics." });
  
      // Fetch all SAQs created by the teacher
      const saqs = await SAQ.find({ teacher: teacher._id }).select("title questions");
  
      if (!saqs.length) {
        return res.status(200).json({
          tests: [],
          topStudents: [],
          improvementAreas: [],
        });
      }
  
      // Fetch submissions for all SAQs
      const saqIds = saqs.map((saq) => saq._id);
      const submissions = await SAQSubmission.find({ saq: { $in: saqIds } })
        .populate("student", "name email")
        .select("saq answers attempts");
  
      // Calculate test stats
      const testData = saqs.map((saq) => {
        const saqSubmissions = submissions.filter((sub) => sub.saq.toString() === saq._id.toString());
        const scores = saqSubmissions.map((sub) =>
          sub.answers.reduce((sum, ans) => sum + (ans.score || 0), 0)
        );
        const totalSubmissions = scores.length;
        const averageScore = totalSubmissions ? scores.reduce((sum, score) => sum + score, 0) / totalSubmissions : 0;
        const highestScore = totalSubmissions ? Math.max(...scores) : 0;
        const lowestScore = totalSubmissions ? Math.min(...scores) : 0;
  
        return {
          name: saq.title,
          avgScore: parseFloat(averageScore.toFixed(2)),
          highestScore,
          lowestScore,
          totalSubmissions,
        };
      });
  
      // Calculate top-performing students (across all tests)
      const studentScores = {};
      submissions.forEach((sub) => {
        const studentId = sub.student._id.toString();
        const score = sub.answers.reduce((sum, ans) => sum + (ans.score || 0), 0);
        if (!studentScores[studentId]) {
          studentScores[studentId] = { name: sub.student.name, email: sub.student.email, totalScore: 0, count: 0 };
        }
        studentScores[studentId].totalScore += score;
        studentScores[studentId].count += 1;
      });
  
      const topStudents = Object.values(studentScores)
        .map((student) => ({
          name: student.name,
          email: student.email,
          averageScore: parseFloat((student.totalScore / student.count).toFixed(2)),
        }))
        .sort((a, b) => b.averageScore - a.averageScore)
        .slice(0, 5); // Top 5 students
  
      // Identify areas for improvement (questions with low average scores)
      const questionStats = {};
      submissions.forEach((sub) => {
        sub.answers.forEach((ans) => {
          if (!questionStats[ans.questionId]) {
            questionStats[ans.questionId] = { totalScore: 0, count: 0, questionText: "" };
          }
          questionStats[ans.questionId].totalScore += ans.score || 0;
          questionStats[ans.questionId].count += 1;
        });
      });
  
      saqs.forEach((saq) => {
        saq.questions.forEach((q) => {
          if (questionStats[q._id]) {
            questionStats[q._id].questionText = q.questionText;
          }
        });
      });
  
      const improvementAreas = Object.entries(questionStats)
        .map(([questionId, stats]) => ({
          questionId,
          questionText: stats.questionText,
          averageScore: parseFloat((stats.totalScore / stats.count).toFixed(2)),
        }))
        .filter((q) => q.averageScore < 5) // Threshold for "low" score (adjust as needed)
        .sort((a, b) => a.averageScore - b.averageScore);
  
      res.status(200).json({
        tests: testData,
        topStudents,
        improvementAreas,
      });
    } catch (error) {
      console.error("Error fetching teacher analytics:", error);
      res.status(500).json({ error: "Server error" });
    }
  });  
export default router;
