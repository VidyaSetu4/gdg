import mongoose, { Schema } from "mongoose";
const quizSchema = new Schema({
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    questions: [
        {
            question: { type: String, required: true },
            options: [{ type: String }],
            correctAnswer: { type: String, required: true },
            type: { type: String, enum: ["MCQ", "ShortAnswer"], required: true }
        }
    ],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true }
}, {
    timestamps: true // Adds createdAt and updatedAt automatically
});
// Create and export the Quiz model
const Quiz = mongoose.model("Quiz", quizSchema);
export default Quiz;
