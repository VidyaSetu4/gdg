// models/FeedBackForm.js
import mongoose from "mongoose";

const FeedbackFormSchema = new mongoose.Schema({
  formLink: { type: String, required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true }, // Links to Course
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true }, // Links to Teacher
  expiryDate: { type: Date, required: true },
  postDate: { type: Date, default: Date.now },
});

export default mongoose.model("FeedbackForm", FeedbackFormSchema);