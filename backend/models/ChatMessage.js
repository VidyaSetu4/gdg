// backend/models/ChatMessage.ts
import mongoose, { Schema } from "mongoose";
const chatMessageSchema = new Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    text: { type: String, required: true },
    sender: { type: String, enum: ["user", "bot"], required: true },
    time: { type: Date, default: Date.now },
    image: { type: String },
    audio: { type: String }
});
const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);
export default ChatMessage;
