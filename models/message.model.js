import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversation: { type: mongoose.Types.ObjectId, ref: "Conversations" },
    sender: { type: mongoose.Types.ObjectId, ref: "Users" },
    recipient: { type: mongoose.Types.ObjectId, ref: "Users" },
    text: String,
    media: Array,
    call: Object,
  },
  {
    timestamps: true,
  }
);

export const Messages = mongoose.model("Messages", messageSchema);
