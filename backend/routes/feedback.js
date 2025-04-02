import express from "express";
import FeedbackForm from "../models/FeedBackForm.js";

const router = express.Router();

// ✅ POST /api/feedback → Save a new feedback form
router.post("/", async (req, res) => {
  try {
    const { formLink } = req.body;
    if (!formLink) return res.status(400).json({ message: "Form link is required" });

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 15); // Expires in 15 days

    const feedbackForm = await FeedbackForm.create({ formLink, expiryDate });

    res.status(201).json(feedbackForm);
  } catch (error) {
    res.status(500).json({ message: "Error saving feedback form", error });
  }
});

// Define a route to get the latest feedback form
router.get('/latest', async (req, res) => {
    try {
      const latestForm = await FeedbackForm.findOne().sort({ postDate: -1 }).limit(1);
      if (!latestForm) {
        return res.status(404).json({ message: "No feedback forms available" });
      }
      res.json(latestForm);
    } catch (error) {
      console.error("Error fetching latest feedback form:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

// ✅ GET /api/feedback → Fetch all feedback forms
router.get("/", async (req, res) => {
  try {
    const feedbackForms = await FeedbackForm.find().sort({ postDate: -1 }); // Sort by latest postDate

    if (!feedbackForms.length) {
      return res.status(404).json({ message: "No feedback forms available" });
    }

    res.json(feedbackForms);
  } catch (error) {
    res.status(500).json({ message: "Error fetching feedback forms", error });
  }
});

export default router; // Use ES Module export
