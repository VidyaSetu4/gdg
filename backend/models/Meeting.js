import mongoose, { Schema } from "mongoose";
const meetingSchema = new Schema({
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    duration: { type: Number, required: true },
    hostName: { type: String, required: true },
    meetLink: { type: String, required: true },
}, { timestamps: true });
const Meeting = mongoose.model("Meeting", meetingSchema);
export default Meeting;
