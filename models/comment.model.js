import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    tag: Object,
    reply: mongoose.Types.ObjectId,
    likes: [{ type: mongoose.Types.ObjectId, ref: "Users" }],
    user: { type: mongoose.Types.ObjectId, ref: "Users" },
    postId: mongoose.Types.ObjectId,
    postUserId: mongoose.Types.ObjectId,
  },
  {
    timestamps: true,
  }
);

export const Comments = mongoose.model("Comments", commentSchema);
