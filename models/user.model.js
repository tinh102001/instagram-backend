import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
      maxlength: 25,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      maxlength: 25,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/ductinh/image/upload/v1676095073/instagram/avatar_cugq40_q61cra.png",
    },
    role: { type: String, default: "Users" },
    gender: { type: String, default: "male" },
    mobile: { type: String, default: "" },
    address: { type: String, default: "" },
    story: {
      type: String,
      default: "",
      maxlength: 200,
    },
    website: { type: String, default: "" },
    followers: [{ type: mongoose.Types.ObjectId, ref: "Users" }],
    following: [{ type: mongoose.Types.ObjectId, ref: "Users" }],
    saved: [{ type: mongoose.Types.ObjectId, ref: "Posts" }],
  },
  {
    timestamps: true,
  }
);

export const Users = mongoose.model("Users", userSchema);
