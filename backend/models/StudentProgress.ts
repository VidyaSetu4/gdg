import mongoose, { Document, Schema } from "mongoose";

// Define an interface for the Student Progress document
interface IStudentProgress extends Document {
    student: mongoose.Types.ObjectId; // Reference to Student
    course: mongoose.Types.ObjectId; // Reference to Course
    completedLessons: mongoose.Types.ObjectId[]; // Array of completed lesson IDs
    assessmentScores: { 
        lesson: mongoose.Types.ObjectId; // Reference to Lesson
        score: number; // Score obtained in the assessment
    }[];
}

// Define the Mongoose schema
const studentProgressSchema = new Schema<IStudentProgress>({
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
const StudentProgress = mongoose.model<IStudentProgress>("StudentProgress", studentProgressSchema);
export default StudentProgress;
