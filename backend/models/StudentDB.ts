const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String
    },
    address: {
        type: String
    },
    dateOfBirth: {
        type: Date
    },
    school: {
        type: String
    },
    joinedDate: {
        type: Date
    },
    profilePicture: {
        type: String // URL or file path to the profile image
    },
    enrolledCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    }],
    certificates: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Certificate"
    }],
    attendance: [{
        date: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            enum: ["Present", "Absent", "Late"], // Attendance status
            required: true
        }
    }],
    coursesCompleted: {
        type: Number,
        default: 0 // Number of courses completed by the user
    }
}, { timestamps: true });

module.exports = mongoose.model("students", studentSchema);
