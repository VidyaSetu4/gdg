import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
// Define the Mongoose Schema
const teacherSchema = new Schema({
    name: { type: String, required: true, trim: true },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: /.+\@.+\..+/, // Ensures proper email format
    },
    password: { type: String, required: true }, // Hashed password
    phone: { type: String, match: /^[0-9]{10,15}$/ }, // Validates phone number format
    address: { type: String },
    dateOfBirth: { type: Date },
    school: { type: String },
    profilePicture: { type: String }, // Store Base64 string or URL
    subjectSpeciality: { type: [String], required: true }, // Array to support multiple subjects
    role: { type: String, enum: ["teacher"], default: "teacher" }, // Enforced role
    certificates: [
        {
            name: { type: String, required: true },
            issuedBy: { type: String, required: true },
            issueDate: {
                type: Date,
                required: true,
                validate: {
                    validator: function (value) {
                        return value <= new Date();
                    },
                    message: "Issue date cannot be in the future.",
                },
            },
            certificateFile: { type: String }, // Store as Base64 or a link to cloud storage
        },
    ],
}, { timestamps: true } // Adds createdAt and updatedAt fields
);
// Hash the password before saving the document
teacherSchema.pre("save", async function (next) {
    if (!this.isModified("password"))
        return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    }
    catch (error) {
        next(error);
    }
});
// Method to compare passwords
teacherSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};
// Create the Mongoose model
const Teacher = mongoose.model("Teacher", teacherSchema);
export default Teacher;
