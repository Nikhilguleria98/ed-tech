import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: true,
      trim: true,
    },

    courseDescription: {
      type: String,
      required: true,
    },

    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    whatYouWillLearn: {
      type: String,
      required: true,
    },

    courseContent: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section",
      }
    ],

    ratingAndReviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RatingAndReviews",
      }
    ],

    price: {
      type: Number,
      required: true,
      default: 0,
    },

    thumbnail: {
      type: String,
      required: true,
    },

    tag: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tag",
      required: true,
    },

    // ✅ IMPORTANT FIX
    studentsEnrolled: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],   // 🔥 no required here
    },
  },
  { timestamps: true } // ✅ VERY IMPORTANT
);

export default mongoose.model("Course", courseSchema);