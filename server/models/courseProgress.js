import mongoose from "mongoose";

const courseProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    completedVideos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubSection",
      }
    ],

    progressPercentage: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("CourseProgress", courseProgressSchema);