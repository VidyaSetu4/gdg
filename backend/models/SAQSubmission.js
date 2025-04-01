import mongoose from "mongoose";

const SAQSubmissionSchema = new mongoose.Schema({
  saq: { type: mongoose.Schema.Types.ObjectId, ref: "SAQ", required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  answers: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
      answerText: { type: String, required: true },
      score: { type: Number, default: null }, // AI will update this later
      feedback: { type: String, default: null } // AI feedback
    }
  ],
  attempts: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("SAQSubmission", SAQSubmissionSchema);
