import mongoose, { Document, Schema } from "mongoose";

// Define an interface for the Student document
interface IStudent extends Document {
    name: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    dateOfBirth: Date;
    school: string;
    role: "student"; // Explicit role
    joinedDate: Date;
    profilePicture?: string;
    enrolledCourses: mongoose.Types.ObjectId[];
    certificates: mongoose.Types.ObjectId[];
    attendance: {
        date: Date;
        status: "Present" | "Absent" | "Late";
    }[];
    coursesCompleted: number;
    createdAt?: Date;
    updatedAt?: Date;
}

// Define the Mongoose schema
const studentSchema = new Schema<IStudent>(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, trim: true },
        password: { type: String, required: true },
        phone: { type: String, required: true, trim: true },
        address: { type: String, required: true },
        dateOfBirth: { type: Date, required: true },
        school: { type: String, required: true },
        joinedDate: { type: Date, default: () => new Date() },
        profilePicture: { type: String, default: "" }, // Set an empty string if no profile picture is provided
        role: { type: String, enum: ["student"], default: "student", required: true },
        enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
        certificates: [{ type: mongoose.Schema.Types.ObjectId, ref: "Certificate" }],
        attendance: [
            {
                date: { type: Date, required: true },
                status: { type: String, enum: ["Present", "Absent", "Late"], required: true },
            },
        ],
        coursesCompleted: { type: Number, default: 0 },
    },
    { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const Student = mongoose.model<IStudent>("Student", studentSchema);
export default Student;