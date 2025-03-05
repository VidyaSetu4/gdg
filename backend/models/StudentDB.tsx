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
    joinedDate: Date;
    profilePicture: string;
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

const studentSchema = new Schema<IStudent>({
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
        type: String,
        required: true 
    },
    address: { 
        type: String,
        required: true 
    },
    dateOfBirth: { 
        type: Date,
        required: true 
    },
    school: { 
        type: String,
        required: true 
    },
    joinedDate: { 
        type: String, // Store as a string in "dd/mm/yyyy" format
        default: () => {
            const now = new Date();
            return now.toLocaleDateString('en-GB'); // Formats as "dd/mm/yyyy"
        }
    }
    profilePicture: { 
        type: String
    },
    // enrolledCourses: [{ 
    //     type: mongoose.Schema.Types.ObjectId, 
    //     ref: "Course" 
    // }],
    password: { 
        type: String, 
        required: true 
    }
    
}, { timestamps: true });

const Student = mongoose.model<IStudent>("Student", studentSchema);
export default Student;
