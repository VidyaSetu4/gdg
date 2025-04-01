import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const evaluateSAQ = async (question, answer) => {
  try {
    const prompt = `
    You are an AI teacher evaluating a student's short answer response.
    Given the question and student's answer, provide:
    - A score (0-10) based on relevance, correctness, and clarity.
    - Constructive feedback for improvement.

    Question: ${question}
    Student's Answer: ${answer}

    Format:
    Score: <score>/10
    Feedback: <detailed feedback>
    `;

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent",
      {
        contents: [{ role: "user", parts: [{ text: prompt }] }]
      },
      {
        params: { key: process.env.GEMINI_API_KEY }
      }
    );

    // Extract AI-generated text
    const aiResponse = response.data.candidates[0]?.content?.parts[0]?.text || "";

    // Extract score and feedback from AI response
    const match = aiResponse.match(/Score:\s*(\d+)\/10\s*Feedback:\s*(.*)/s);
    const score = match ? parseInt(match[1], 10) : null;
    const feedback = match ? match[2].trim() : "Feedback not found";

    return { score, feedback };
  } catch (error) {
    console.error("Error evaluating SAQ:", error);
    return { score: 0, feedback: "Error in evaluation" };
  }
};
