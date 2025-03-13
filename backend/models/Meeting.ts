import mongoose, { Document, Schema } from "mongoose";

interface IMeeting extends Document {
  startTime: Date;
  endTime: Date;
  duration: number;
  hostName: string;
  meetLink: string;
}

const meetingSchema = new Schema<IMeeting>(
  {
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    duration: { type: Number, required: true },
    hostName: { type: String, required: true },
    meetLink: { type: String, required: true },
  },
  { timestamps: true }
);

const Meeting = mongoose.model<IMeeting>("Meeting", meetingSchema);
export default Meeting;
