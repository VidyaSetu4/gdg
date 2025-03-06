import jwt from 'jsonwebtoken';
import Student from '../models/StudentDB';
import Teacher from '../models/TeacherDB';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
    }

    req.user = decoded;
    next();
  });
};

export const isStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.user.id);
    if (!student) {
      return res.status(403).json({ message: "Forbidden: Access is denied" });
    }
    req.user.role = 'student';
    next();
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const isTeacher = async (req, res, next) => {
  try {
    const teacher = await Teacher.findById(req.user.id);
    if (!teacher) {
      return res.status(403).json({ message: "Forbidden: Access is denied" });
    }
    req.user.role = 'teacher';
    next();
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};