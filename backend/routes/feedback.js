import express from "express";
import jwt from "jsonwebtoken";
import FeedbackForm from "../models/FeedBackForm.js";
import Teacher from "../models/TeacherDB.js";
import Student from "../models/StudentDB.js";
import Course from "../models/CourseSchema.js"; // Assuming you have a Course model

const router = express.Router();

// POST /api/feedback → Save a new feedback form (Teacher only)
router.post("/", async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token || !token.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: Invalid token format" });
    }

    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    const teacher = await Teacher.findById(decoded.id);
    if (!teacher) {
      return res.status(403).json({ message: "Access denied. Only teachers can create feedback forms." });
    }

    const { formLink, courseId } = req.body;
    if (!formLink || !courseId) {
      return res.status(400).json({ message: "Form link and course ID are required" });
    }

    // Fetch the course to check its subject
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Verify the teacher specializes in the course's subject
    if (!teacher.subjectSpeciality.includes(course.subject)) {
      return res.status(403).json({
        message: "You can only create feedback for courses matching your subject speciality",
      });
    }

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 15); // Expires in 15 days

    const feedbackForm = await FeedbackForm.create({
      formLink,
      course: courseId,
      teacher: teacher._id,
      expiryDate,
    });

    res.status(201).json(feedbackForm);
  } catch (error) {
    console.error("Error saving feedback form:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// GET /api/feedback/latest → Get the latest feedback form (Student-specific)
router.get("/latest", async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token || !token.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: Invalid token format" });
    }

    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    const student = await Student.findById(decoded.id);
    if (!student) {
      return res.status(403).json({ message: "Access denied. Only students can view feedback forms." });
    }

    const latestForm = await FeedbackForm.findOne({
      course: { $in: student.enrolledCourses }, // Match student's enrolled courses
      expiryDate: { $gt: new Date() }, // Only active forms
    })
      .populate("course", "name subject") // Populate course details
      .sort({ postDate: -1 })
      .limit(1);

    if (!latestForm) {
      return res.status(404).json({ message: "No active feedback forms available for your courses" });
    }

    res.json(latestForm);
  } catch (error) {
    console.error("Error fetching latest feedback form:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/feedback → Fetch all feedback forms (Student-specific)
router.get("/", async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token || !token.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: Invalid token format" });
    }

    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    const student = await Student.findById(decoded.id);
    if (!student) {
      return res.status(403).json({ message: "Access denied. Only students can view feedback forms." });
    }

    const feedbackForms = await FeedbackForm.find({
      course: { $in: student.enrolledCourses }, // Match student's enrolled courses
      expiryDate: { $gt: new Date() }, // Only active forms
    })
      .populate("course", "name subject") // Populate course details
      .sort({ postDate: -1 });

    if (!feedbackForms.length) {
      return res.status(404).json({ message: "No active feedback forms available for your courses" });
    }

    res.json(feedbackForms);
  } catch (error) {
    console.error("Error fetching feedback forms:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/feedback/teacher → Fetch all feedback forms created by the teacher
router.get("/teacher", async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token || !token.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: Invalid token format" });
    }

    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    const teacher = await Teacher.findById(decoded.id);
    if (!teacher) {
      return res.status(403).json({ message: "Access denied. Only teachers can view their feedback forms." });
    }

    const feedbackForms = await FeedbackForm.find({ teacher: teacher._id })
      .populate("course", "name subject")
      .sort({ postDate: -1 });

    if (!feedbackForms.length) {
      return res.status(404).json({ message: "You haven’t created any feedback forms yet" });
    }

    res.json(feedbackForms);
  } catch (error) {
    console.error("Error fetching teacher feedback forms:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;