const jwt = require("jsonwebtoken");
const Student = require("../models/StudentDB.ts");
const Teacher = require("../models/TeacherDB");
require("dotenv").config();

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
    }

    // Determine user role (student or teacher)
    let user = await Student.findById(decoded.id).select("-password");
    let role = "student";
    if (!user) {
      user = await Teacher.findById(decoded.id).select("-password");
      role = "teacher";
    }
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Attach user and role to request object
    req.user = user;
    req.role = role;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

module.exports = authMiddleware;
