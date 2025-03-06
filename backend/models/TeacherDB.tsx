import mongoose, { Document, Schema } from "mongoose";

// Certificate Subdocument Interface
interface ICertificate {
    name: string;
    issuedBy: string;
    issueDate: Date;
    certificateFile?: string; // File stored as Base64 or URL
}

// Define an interface for the Teacher document
interface ITeacher extends Document {
    name: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
    dateOfBirth?: Date;
    school?: string;
    profilePicture?: string;
    subjectSpeciality: string;
    role: "teacher"; // Explicit role
    certificates?: ICertificate[];
    createdAt?: Date;
    updatedAt?: Date;
}

// Define the Mongoose Schema
const teacherSchema = new Schema<ITeacher>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true }, // Hashed password
        phone: { type: String },
        address: { type: String },
        dateOfBirth: { type: Date },
        school: { type: String },
        profilePicture: { type: String }, // Store Base64 string or URL
        subjectSpeciality: { type: String, required: true },
        role: { type: String, enum: ["teacher"], default: "teacher" }, // Enforced role
        certificates: [
            {
                name: { type: String, required: true },
                issuedBy: { type: String, required: true },
                issueDate: { type: Date, required: true },
                certificateFile: { type: String }, // Store as Base64 or a link to cloud storage
            },
        ],
    },
    { timestamps: true } // Adds createdAt and updatedAt fields
);

// Create the Mongoose model
const Teacher = mongoose.model<ITeacher>("Teacher", teacherSchema);

export default Teacher;