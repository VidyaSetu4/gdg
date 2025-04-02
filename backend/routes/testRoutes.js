import express from "express";
import Test from "../models/Quiz.ts";

const router = express.Router();

/**
 * 🟢 Create a new test
 */
router.post("/", async (req, res) => {
  try {
    const { title, subject, duration, totalMarks, dueDate, formLink } = req.body;

    if (!title || !subject || !duration || !totalMarks || !dueDate || !formLink) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const newTest = new Test({
      title,
      subject,
      duration,
      totalMarks,
      dueDate,
      formLink,
    });

    const savedTest = await newTest.save();
    res.status(201).json(savedTest);
  } catch (error) {
    console.error("❌ Error creating test:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * 🟢 Get all active tests (excluding expired ones)
 */
router.get("/", async (req, res) => {
  try {
    const today = new Date();
    const activeTests = await Test.find({ dueDate: { $gte: today } }).sort({ dueDate: 1 });
    res.json(activeTests);
  } catch (error) {
    console.error("❌ Error fetching tests:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * 🟢 Get a specific test by ID
 */
router.get("/:id", async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) return res.status(404).json({ error: "Test not found" });
    res.json(test);
  } catch (error) {
    console.error("❌ Error fetching test:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * 🔴 Delete a test by ID
 */

router.delete("/:id", async (req, res) => {
  try {
    const deletedTest = await Test.findByIdAndDelete(req.params.id);
    if (!deletedTest) return res.status(404).json({ error: "Test not found" });
    res.json({ message: "Test deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting test:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * 🟢 Submit a test (increment submission count)
 */
router.put("/:id/submit", async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) return res.status(404).json({ error: "Test not found" });

    test.submissions += 1;
    await test.save();
    res.json(test);
  } catch (error) {
    console.error("❌ Error submitting test:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
