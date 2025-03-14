// backend/models/ChatMessage.ts
import mongoose, { Document, Schema } from "mongoose";

interface IChatMessage extends Document {
    studentId: mongoose.Types.ObjectId;
    text: string;
    sender: "user" | "bot";
    time: Date;
    image?: string; // Base64-encoded image data URL
    audio?: string; // Base64-encoded audio data URL
}

const chatMessageSchema = new Schema<IChatMessage>({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    text: { type: String, required: true },
    sender: { type: String, enum: ["user", "bot"], required: true },
    time: { type: Date, default: Date.now },
    image: { type: String },
    audio: { type: String }
});

const ChatMessage = mongoose.model<IChatMessage>("ChatMessage", chatMessageSchema);
export default ChatMessage;