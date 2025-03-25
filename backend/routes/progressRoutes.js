
import express from "express";
import StudentProgress from "../models/StudentProgress";
import { fetchUser } from "../middleware/authMiddleware";
const router = express.Router();

// Mark a lesson as completed
router.post("/course/:courseId/lesson/:lessonId/complete", fetchUser, async (req, res) => {
    try {
        const { courseId, lessonId } = req.params;
        const studentId = req.user.id;

        let progress = await StudentProgress.findOne({ student: studentId, course: courseId });
        if (!progress) {
            progress = new StudentProgress({ student: studentId, course: courseId, completedLessons: [] });
        }
        
        if (!progress.completedLessons.includes(lessonId)) {
            progress.completedLessons.push(lessonId);
            await progress.save();
        }
        res.status(200).json({ message: "Lesson marked as completed", progress });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// Submit an assessment answer
router.post("/assessment/:lessonId", fetchUser, async (req, res) => {
    try {
        const { lessonId } = req.params;
        const { answer } = req.body;
        const studentId = req.user.id;

        // Send answer to Gemini API for evaluation (mocked for now)
        const score = Math.floor(Math.random() * 100); // Mock score generation

        let progress = await StudentProgress.findOne({ student: studentId, "assessmentScores.lesson": lessonId });
        if (!progress) {
            progress = new StudentProgress({ student: studentId, assessmentScores: [] });
        }
        
        progress.assessmentScores.push({ lesson: lessonId, score });
        await progress.save();

        res.status(200).json({ message: "Assessment evaluated", score });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
