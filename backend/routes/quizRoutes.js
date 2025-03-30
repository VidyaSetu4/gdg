import express from "express";
import { body, validationResult } from "express-validator";
import Quiz from "../models/Quiz";
import fetchUser from "../middleware/fetchUser";
import Teacher from "../models/TeacherDB";

const router = express.Router();

/**
 * @route   POST /api/quiz/create
 * @desc    Create a new quiz (Only Teachers)
 * @access  Private (Teachers Only)
 */
router.post(
    "/create",
    [
      body("courseId", "Course ID is required").notEmpty(),
      body("questions", "Questions must be an array").isArray(),
      body("questions.*.question", "Each question must have text").notEmpty(),
      body("questions.*.type", "Question type is required").isIn(["MCQ", "ShortAnswer"]),
      body("questions.*.correctAnswer", "Each question must have a correct answer").notEmpty(),
    ],
    async (req, res) => {
      try {
        // ✅ Extract and verify JWT token from headers
        const token = req.headers.authorization;
        if (!token) return res.status(401).json({ error: "Unauthorized: No token provided" });
  
        // ✅ Verify token and extract teacher ID
        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
        if (!decoded || !decoded.id) return res.status(403).json({ error: "Invalid token" });
  
        // ✅ Find the teacher
        const teacher = await Teacher.findById(decoded.id);
        if (!teacher) return res.status(403).json({ error: "Access denied. Only teachers can create quizzes." });
  
        // ✅ Validate request body
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  
        const { courseId, questions } = req.body;
  
        // ✅ Check if teacher is assigned to the course
        if (!teacher.speciality.includes(courseId)) {
          return res.status(403).json({ error: "You can only create quizzes for your assigned courses." });
        }
  
        // ✅ Create new quiz
        const newQuiz = new Quiz({
          course: courseId,
          questions,
          createdBy: decoded.id, // Teacher ID from token
        });
  
        await newQuiz.save();
        res.status(201).json({ message: "Quiz created successfully!", quiz: newQuiz });
  
      } catch (error) {
        console.error("Error creating quiz:", error);
        res.status(500).json({ error: "Server error" });
      }
    }
  );
  

export default router;
