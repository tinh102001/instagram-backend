import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    recipients: [{ type: mongoose.Types.ObjectId, ref: "Users" }],
    text: String,
    media: Array,
    call: Object,
  },
  {
    timestamps: true,
  }
);

export const Conversations = mongoose.model(
  "Conversations",
  conversationSchema
);
