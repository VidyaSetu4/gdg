import mongoose, { Document, Schema } from "mongoose";

// Define an interface for the Course document
interface ICourse extends Document {
    subject: string;
    name?: string;
    description?: string;
    grade?: string;
    teacher: {
        teacherId: mongoose.Types.ObjectId;
        subject: string;
    }[];
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
    notes?: {
        title: string;
        fileUrl: string; // URL to the uploaded file
        uploadedBy: mongoose.Types.ObjectId; // Reference to the teacher
        uploadedAt: Date;
    }[];
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

        teacher: [
            {
                teacherId: { 
                    type: mongoose.Schema.Types.ObjectId, 
                    ref: "Teacher", 
                    required: true 
                },
                subject: { type: String, required: true }
            }
        ],
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

        enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student", default: [] }],


        price: { type: Number, default: 0 },
        thumbnail: { type: String, default: "" },
        // Notes Section: Stores file details
    notes: [
        {
            teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
            fileUrl: { type: String, required: true },
            fileName: { type: String, required: true },
            uploadedAt: { type: Date, default: Date.now },
        }
    ]
    },
    { timestamps: true }
);

// Pre-save hook for validation and computed fields
courseSchema.pre("save", async function (next) {
    try {
        const Teacher = mongoose.model("Teacher");

        // Validate all teachers' subject specialties
        for (const teacherEntry of this.teacher) {
            const teacher = await Teacher.findById(teacherEntry.teacherId);
            
            if (!teacher) throw new Error(`Teacher ${teacherEntry.teacherId} not found`);
            
            if (!Array.isArray(teacher.subjectSpeciality) || !teacher.subjectSpeciality.includes(teacherEntry.subject)) {
                throw new Error(
                    `Teacher ${teacher.name} (${teacher._id}) cannot teach ${teacherEntry.subject} - ` +
                    `Specializes in: ${teacher.subjectSpeciality?.join(", ") || "No specialization listed"}`
                );
            }
        }

        // Update meeting end times
        const updatedMeetings = this.meetings?.map(meeting => ({
            ...meeting,
            endTime: meeting.endTime || new Date(meeting.startTime.getTime() + meeting.duration * 60000)
        }));

        if (updatedMeetings) this.set("meetings", updatedMeetings);

        next();
    } catch (error) {
        next(error as Error);
    }
});

// Create and export the Course model
const Course = mongoose.model<ICourse>("Course", courseSchema);
export default Course;
