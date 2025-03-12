import mongoose, { Document, Schema } from "mongoose";

// Define an interface for the Course document
interface ICourse extends Document {
    name: string;
    description: string;
    subject: string;
    grade: string;
    teacher: mongoose.Types.ObjectId;
    lessons: {
        title: string;
        description: string;
        videoUrl?: string;
        resources?: string[];
        duration: number; // in minutes
    }[];
    meetings: {
        startTime: Date;
        duration: number; // in minutes
        endTime: Date;
        hostName: string;
    }[];
    enrolledStudents: mongoose.Types.ObjectId[];
    price?: number;
    thumbnail?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

// Define the Mongoose schema
const courseSchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        subject: { type: String, required: true },
        grade: { type: String, required: true },
        teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
        lessons: [
            {
                title: { type: String, required: true },
                description: { type: String, required: true },
                videoUrl: { type: String },
                resources: [{ type: String }], // URLs to resources
                duration: { type: Number, required: true } // in minutes
            },
        ],
        meetings: [
            {
                startTime: { type: Date, required: true },
                duration: { type: Number, required: true }, // in minutes
                endTime: { type: Date, required: true },
                hostName: { type: String, required: true }
            }
        ],
        enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
        price: { type: Number, default: 0 },
        thumbnail: { type: String, default: "" } // URL to the thumbnail image
    },
    { timestamps: true }
);

// Create and export the Course model
const Course = mongoose.model<ICourse>("Course", courseSchema);
export default Course;
