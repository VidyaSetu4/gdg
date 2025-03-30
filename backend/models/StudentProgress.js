import mongoose, { Schema } from "mongoose";
// Define the Mongoose schema
const studentProgressSchema = new Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    completedLessons: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lesson"
        }],
    assessmentScores: [{
            lesson: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson" },
            score: { type: Number, required: true }
        }]
}, { timestamps: true }); // Automatically add createdAt and updatedAt fields
// Create and export the Student Progress model
const StudentProgress = mongoose.model("StudentProgress", studentProgressSchema);
export default StudentProgress;
