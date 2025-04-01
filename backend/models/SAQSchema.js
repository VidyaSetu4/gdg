import mongoose from "mongoose";

const SAQSchema = new mongoose.Schema({

  title:{
    type:String,
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
  },
  questions: [
    {
      questionText: { type: String, required: true },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  attemptsAllowed: {
    type: Number,
    default: 1, // Teacher can change this
  },
});

const SAQ = mongoose.model("SAQ", SAQSchema);
export default SAQ;
