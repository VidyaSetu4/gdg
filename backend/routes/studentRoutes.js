import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Student from "../models/StudentDB.js"; // Ensure this is a JS file
import multer from "multer";
import path from "path";

dotenv.config();
const router = express.Router();

// Configure Multer for Profile Image Upload
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
      cb(new Error("Error: Images only!"));
    }
  },
});

// ✅ Student Signup
router.post("/signup", async (req, res) => {
  try {

    const { name, email, password, phone, address, dob, school, profilePic } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: "Student already exists" });
    }
    const todayDate = new Date().toLocaleDateString("en-GB"); // "dd/mm/yyyy"

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStudent = new Student({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      dateOfBirth: new Date(dob),
      joinedDate: todayDate,
      school,
      profilePicture: profilePic, // ✅ Save Base64 string directly
    });

    await newStudent.save();

    res.status(201).json({ message: "Student registered successfully!" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

// ✅ Student Login
// ✅ Student Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if student exists
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Send the whole student info (excluding password)
    res.json({
      message: "Login successful",
      token,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        phone: student.phone,
        address: student.address,
        dateOfBirth: student.dateOfBirth,
        school: student.school,
        profilePicture: student.profilePicture,
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});


// ✅ Get Student Profile

// ✅ Get Student Profile
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

    // Find student by ID
    const student = await Student.findById(decoded.id).select("-password"); // Exclude password from response
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ 
      message: "Profile fetched successfully!",
      student
    });

  } catch (error) {
    console.error("Profile error:", error); // Debugging log
    res.status(500).json({ message: "Error fetching student details", error: error.message });
  }
});


// ✅ Update Student Profile
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
      updateData.profileImage = req.file.path;
    }

    const updatedStudent = await Student.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedStudent) return res.status(404).json({ message: "Student not found" });

    res.json({ message: "Profile updated successfully!", student: updatedStudent });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error: error.message });
  }
});

// ✅ Delete Student
router.delete("/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    await student.deleteOne();
    res.json({ message: "Student deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting student", error: error.message });
  }
});

export default router;
