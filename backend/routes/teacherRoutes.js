import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Teacher from "../models/TeacherDB"; // Import the Teacher model
import multer from "multer";
import path from "path";

dotenv.config();
const router = express.Router();

// ✅ Configure Multer for Profile Image Upload
const storage = multer.diskStorage({
  destination: "./uploads/profiles",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${path.extname(file.originalname)}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Error: Only images allowed!"));
    }
  },
});

// ✅ Teacher Signup
router.post("/signup", async (req, res) => {
  try {
    console.log("Received request from frontend!!!")
    const { name, email, password, phone, address, dateOfBirth, school, profilePicture, subjectSpeciality, certificates } = req.body;
    console.log(req.body);
    if (!name || !email || !password || !subjectSpeciality) {
      return res.status(400).json({ message: "Name, email, password, and subjectSpeciality are required" });
    }

    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      return res.status(400).json({ message: "Teacher already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newTeacher = new Teacher({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      school,
      profilePicture,
      subjectSpeciality,
      certificates,
    });

    await newTeacher.save();

    res.status(201).json({ message: "Teacher registered successfully!" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

// ✅ Teacher Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if teacher exists
    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: teacher._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Send the teacher's details (excluding password)
    res.json({
      message: "Login successful",
      token,
      teacher: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        phone: teacher.phone,
        address: teacher.address,
        dateOfBirth: teacher.dateOfBirth,
        school: teacher.school,
        profilePicture: teacher.profilePicture,
        subjectSpeciality: teacher.subjectSpeciality,
        certificates: teacher.certificates,
      },
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

// ✅ Get Teacher Profile
router.get("/profile", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
    }

    // Find teacher by ID
    const teacher = await Teacher.findById(decoded.id).select("-password"); // Exclude password from response
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.json({ 
      message: "Profile fetched successfully!",
      teacher
    });

  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ message: "Error fetching teacher details", error: error.message });
  }
});

// ✅ Update Teacher Profile
router.put("/:id", upload.single("profileImage"), async (req, res) => {
  try {
    const { password, ...updateData } = req.body;

    // If password update is requested, hash it before saving
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    // If profile image is uploaded, update it
    if (req.file) {
      updateData.profilePicture = req.file.path;
    }

    const updatedTeacher = await Teacher.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedTeacher) return res.status(404).json({ message: "Teacher not found" });

    res.json({ message: "Profile updated successfully!", teacher: updatedTeacher });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error: error.message });
  }
});

// ✅ Delete Teacher
router.delete("/:id", async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    await teacher.deleteOne();
    res.json({ message: "Teacher deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting teacher", error: error.message });
  }
});

export default router;
