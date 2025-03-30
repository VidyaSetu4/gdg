import express from "express";
import mongoose from "mongoose";
import Student from "../models/StudentDB.js";
import Course from "../models/CourseSchema.js"; // Import your Course model
import Teacher from "../models/TeacherDB.js"; // Import your Teacher model
import supabase from "../supabaseClient.js";
import multer from "multer";
import fetchUser from "../middleware/fetchuser.js";
import jwt from "jsonwebtoken";
const router = express.Router();

//const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);


const authenticateUser = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded); // Debugging
      req.user = decoded; // Attach decoded user info to request
      next();
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
    }
  } catch (err) {
    console.log(decoded); // Debugging
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// Set up multer for file uploads (adjust storage configuration as needed)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


//ROUTE FOR CREATING A COURSE
router.post("/create", async (req, res) => {
  try {
    const { subject, name, description, grade, teacherId } = req.body;

    // Check if the teacher exists
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Ensure teacher is specialized in the subject
    if (!teacher.subjectSpeciality.includes(subject)) {
      return res.status(400).json({ message: `Teacher does not specialize in ${subject}` });
    }

    // Create the course object
    const newCourse = new Course({
      subject,
      name,
      description,
      grade,
      teacher: [{ teacherId: teacher._id, subject }],
      lessons: [],
      meetings: [],
      enrolledStudents: [],
    });

    // Save the course to the database
    await newCourse.save();

    res.status(201).json({ message: "Course created successfully", course: newCourse });
  } catch (error) {
    res.status(500).json({ message: "Error creating course", error: error.message });
  }
});

//ROUTE FOR UPLOADING NOTES INTO A COURSE
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { courseId } = req.body;
    const file = req.file;

    console.log("Request Body for uploadind notes: ", req.body);
    const token = req.headers.authorization; // Get token from request headers

    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.id) {
      return res.status(403).json({ error: "Invalid token" });
    }

    const teacherId = new mongoose.Types.ObjectId(decoded.id); // Get the teacher's ID from the token

    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    // Validate courseId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ error: "Invalid Course ID" });
    }

    // Find course and push the uploaded file
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // **UPLOAD TO SUPABASE**
    const { originalname, mimetype, buffer } = file;
    const filePath = `uploads/${Date.now()}-${originalname}`; // Unique filename

    const { data, error } = await supabase.storage
      .from("uploads")
      .upload(filePath, buffer, { contentType: mimetype });

    if (error) {
      console.error("Supabase Upload Error:", error);
      return res.status(500).json({ error: "Failed to upload file to storage" });
    }

    // Get the public URL of the uploaded file
    // **Fix: Ensure we correctly extract the public URL**
    const publicUrl = supabase.storage.from("uploads").getPublicUrl(filePath);
    if (!publicUrl || !publicUrl.data) {
      console.error("Supabase URL Error:", publicUrl);
      return res.status(500).json({ error: "Failed to retrieve public URL" });
    }

    // **Fix: Make sure `fileUrl` is assigned correctly**
    const fileUrl = publicUrl.data.publicUrl;
    console.log("Supabase File URL:", fileUrl); // Debugging

    if (!fileUrl) {
      return res.status(500).json({ error: "File URL is missing" });
    }
    // **STORE PUBLIC URL IN MONGODB**
    course.notes.push({
      teacherId,
      fileName: originalname,
      fileUrl, // Store public URL instead of local path
    });

    await course.save();

    res.status(200).json({ message: "File uploaded successfully", url: publicUrl });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Upload failed" });
  }
});

//ROUTE TO FETCH NOTES UPLOADED BY TEACHER
router.get("/notes", async (req, res) => {
  try {
     // Extract student ID from JWT token
     const token = req.headers.authorization;
     if (!token) return res.status(401).json({ error: "Unauthorized: No token provided" });
 
     const decoded = jwt.verify(token, process.env.JWT_SECRET);
     if (!decoded || !decoded.id) return res.status(403).json({ error: "Invalid token" });
 
     const student = await Student.findById(decoded.id).populate({
      path: "enrolledCourses",
      populate: { path: "notes", select: "teacherId fileName fileUrl uploadedAt" },
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    // Extract notes from enrolled courses
    const notes = student.enrolledCourses.flatMap(course =>
      (course.notes || []).map(note => ({
        courseName: course.name,
        subject: course.subject,
        fileName: note.fileName,
        fileUrl: note.fileUrl,
        uploadedAt: note.uploadedAt,
      }))
    );

    // Sort notes by uploaded date (newest first)
    notes.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
    
    res.json({ notes });
  } catch (error) {
    console.error("Error fetching student notes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//ROUTE TO FETCH COURSES TAUGHT BY TEACHER (SPECIALIZED SUBJECTS)
router.get("/courses", async (req, res) => {
  try {
    // Extract teacherId dynamically from the token (assuming it's stored in req.user.id)
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.id) {
      return res.status(403).json({ error: "Invalid token" });
    }
    const teacherId = new mongoose.Types.ObjectId(decoded.id); // Get the teacher's ID from the token

    // Fetch courses where the teacherId is inside the teacher array
    const courses = await Course.find(
      { "teacher.teacherId": teacherId } // Searching inside the teacher array
    ).select("_id subject name");

    res.json({ courses });

  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});

export default router;

