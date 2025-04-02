import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema({
  formLink: { type: String, required: true },
  postDate: { type: Date, default: Date.now },
  expiryDate: { type: Date, required: true },
});

// Exporting the FeedbackForm model using ES Modules
export default mongoose.model("FeedbackForm", FeedbackSchema);
