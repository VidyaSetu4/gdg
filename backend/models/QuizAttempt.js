import mongoose, { Schema } from "mongoose";
// Quiz Attempt schema definition
const quizAttemptSchema = new Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true
    },
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz",
        required: true
    },
    answers: [
        {
            questionId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: "Quiz.questions" // Reference to question in Quiz model
            },
            studentAnswer: {
                type: String,
                required: true
            },
            isCorrect: {
                type: Boolean
            },
            aiScore: {
                type: Number,
                min: 0,
                max: 100
            }
        }
    ],
    totalScore: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    }
}, {
    timestamps: true // Adds createdAt and updatedAt automatically
});
// Create and export the model
const QuizAttempt = mongoose.model("QuizAttempt", quizAttemptSchema);
export default QuizAttempt;
