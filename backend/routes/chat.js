// backend/routes/chat.js
import express from "express";
import ChatMessage from "../models/ChatMessage.js"; // Include .js extension

const router = express.Router();

// Get chat history for a specific student
router.get("/:studentId", async (req, res) => {
    try {
        const messages = await ChatMessage.find({ studentId: req.params.studentId }).sort({ time: 1 });
        res.json(messages);
    } catch (error) {
        console.error("Error fetching chat history:", error);
        res.status(500).json({ error: "Error fetching chat history" });
    }
});

// Save a new chat message
router.post("/", async (req, res) => {
    try {
        const message = new ChatMessage(req.body);
        await message.save();
        res.status(201).json(message);
    } catch (error) {
        console.error("Error saving message:", error);
        res.status(500).json({ error: "Error saving message" });
    }
});

export default router; // Use export default instead of module.exports