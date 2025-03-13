import mongoose, { Document, Schema } from "mongoose";

// Define an interface for the Course document
interface ICourse extends Document {
    subject: string;
    name?: string;
    description?: string;
    grade?: string;
    teacher?: mongoose.Types.ObjectId[];
    lessons?: {
        title: string;
        description: string;
        videoUrl?: string;
        resources?: string[];
        duration: number; // in minutes
    }[];
    meetings?: {
        startTime: Date;
        duration: number; // in minutes
        endTime?: Date; // Automatically computed
        hostName: string;
    }[];
    enrolledStudents?: mongoose.Types.ObjectId[];
    price?: number;
    thumbnail?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

// Define the Mongoose schema
const courseSchema = new Schema<ICourse>(
    {
        subject: { type: String, required: true, trim: true },
        name: { type: String, default: "Unnamed Course" },
        description: { type: String, default: "Course description coming soon." },
        grade: { type: String, default: "All Levels" },

        // Ensure "teacher" is an array of ObjectIds with correct reference
        teacher: [{ type: mongoose.Schema.Types.ObjectId, ref: "Teacher", default: [] }],

        lessons: [
            {
                title: { type: String, required: true },
                description: { type: String, required: true },
                videoUrl: { type: String },
                resources: [{ type: String }],
                duration: { type: Number, required: true },
            }
        ],

        meetings: [
            {
                startTime: { type: Date, required: true },
                duration: { type: Number, required: true },
                endTime: { type: Date }, // Optional (can be derived)
                hostName: { type: String, required: true },
            }
        ],

        // Ensure "enrolledStudents" is an array of ObjectIds with correct reference
        enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student", default: [] }],

        price: { type: Number, default: 0 },
        thumbnail: { type: String, default: "" },
    },
    { timestamps: true }
);

// Auto-calculate `endTime` before saving a document
courseSchema.pre("save", function (next) {
    this.meetings?.forEach(meeting => {
        if (!meeting.endTime) {
            meeting.endTime = new Date(meeting.startTime.getTime() + meeting.duration * 60000);
        }
    });
    next();
});

// Create and export the Course model
const Course = mongoose.model<ICourse>("Course", courseSchema);
export default Course;
