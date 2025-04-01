import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';
import dotenv from "dotenv";
import mongoose from "mongoose";
import studentRoutes from "./routes/studentRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import meetRoutes from "./routes/meetRoutes.js";
import chatRoutes from "./routes/chat.js";
import bodyParser from "body-parser";
import course from "./routes/course.js";
import saq from "./routes/saq.js";


// ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, ".env") });
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: "*",  // Allow all origins (can be restricted to specific domains)
    methods: ["GET", "POST", "PUT", "DELETE"],  // Allow only specific HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
    credentials: true 
}));

app.use(bodyParser.json({ limit: "10mb" })); // Adjust limit as needed
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Routes
app.use("/api/auth", studentRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/meet", meetRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/course", course);
app.use("/api/saq", saq);

// MongoDB Connection
if(!process.env.MONGO_URI) {
    console.error("❌ MongoDB URI missing! Add MONGO_URI to your .env file");
    process.exit(1);
}
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));
// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
