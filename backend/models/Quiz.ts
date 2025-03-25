import mongoose, { Document, Schema } from "mongoose";


interface IQuiz extends Document {
    course: mongoose.Types.ObjectId;
    questions: {
        question: string;
        options?: string[]; // MCQs only
        correctAnswer: string;
        type: "MCQ" | "ShortAnswer";
    }[];
    createdBy: mongoose.Types.ObjectId; // Teacher ID
    createdAt?: Date;
    updatedAt?: Date;
}
const quizSchema = new Schema<IQuiz>({
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
},
{ 
    timestamps: true  // Adds createdAt and updatedAt automatically
}
);

// Create and export the Quiz model
const Quiz = mongoose.model<IQuiz>("Quiz", quizSchema);
export default Quiz;
