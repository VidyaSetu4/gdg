import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const secretKey = process.env.JWT_SECRET_KEY || "your-secret-key"; // Use environment variable for secret key

const fetchUser = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Verify JWT
    let decoded;
    try {
      console.log("Token:", token); // Debugging: Log the token
      console.log("Secret Key:", secretKey); // Debugging: Log the secret key
      decoded = jwt.verify(token, secretKey);
      console.log("Decoded:", decoded); // Debugging: Log the decoded token
      req.user = decoded; // Attach decoded user info to request
      next();
    } catch (error) {
      console.error("Token verification error:", error); // Debugging: Log the error
      return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
    }
  } catch (err) {
    console.error("Internal Server Error:", err); // Debugging: Log the error
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default fetchUser;