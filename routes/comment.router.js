import express from "express";

import { commentCtrl } from "../controllers/comment.controller.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/comment", auth, commentCtrl.createComment);

router.patch("/comment/:id", auth, commentCtrl.updateComment);

router.patch("/comment/:id/like", auth, commentCtrl.likeComment);

router.patch("/comment/:id/unlike", auth, commentCtrl.unLikeComment);

router.delete("/comment/:id", auth, commentCtrl.deleteComment);

export default router;
