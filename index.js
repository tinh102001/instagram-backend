import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

import auth from "./routes/auth.router.js";
import user from "./routes/user.router.js";
import post from "./routes/post.router.js";
import comment from "./routes/comment.router.js";
import notify from "./routes/notify.router.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "30mb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "30mb" }));

const PORT = process.env.PORT || 5000;
const URI = process.env.DATABASE_URL;

app.use("/api", auth);
app.use("/api", user);
app.use("/api", post);
app.use("/api", comment);
app.use("/api", notify);

mongoose.set("strictQuery", false);
mongoose
  .connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to DB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("err", err);
  });