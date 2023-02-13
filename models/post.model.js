import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    content: String,
    images: {
      type: Array,
      required: true,
    },
    likes: [{ type: mongoose.Types.ObjectId, ref: "Users" }],
    comments: [{ type: mongoose.Types.ObjectId, ref: "Comments" }],
    user: { type: mongoose.Types.ObjectId, ref: "Users" },
  },
  {
    timestamps: true,
  }
);

export const Posts = mongoose.model("Posts", postSchema);
