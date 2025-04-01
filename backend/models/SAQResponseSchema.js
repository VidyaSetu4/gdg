import mongoose from "mongoose";

const SAQResponseSchema = new mongoose.Schema({
  saqTest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SAQ",
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  responses: [
    {
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      answerText: { type: String, required: true },
      score: { type: Number, default: 0 }, // AI-generated score
      feedback: { type: String, default: "" }, // AI feedback
    },
  ],
  totalScore: { type: Number, default: 0 }, // Sum of all question scores
  attemptNumber: { type: Number, default: 1 }, // Tracks reattempts
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const SAQResponse = mongoose.model("SAQResponse", SAQResponseSchema);
export default SAQResponse;
