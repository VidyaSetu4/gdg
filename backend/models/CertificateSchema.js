import mongoose, { Schema } from "mongoose";
// Define the Mongoose schema
const certificateSchema = new Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    issueDate: { type: Date, default: Date.now, required: true },
    issuer: { type: String, default: "VidyaSetu", required: true },
    certificateUrl: { type: String } // URL to the certificate file/image
}, { timestamps: true });
const Certificate = mongoose.model("Certificate", certificateSchema);
export default Certificate;
