import express from "express";

import { commentController } from "../controllers/comment.controller.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/comment", auth, commentController.createComment);

router.patch("/comment/:id", auth, commentController.updateComment);

router.delete("/comment/:id", auth, commentController.deleteComment);

router.patch("/comment/:id/like", auth, commentController.likeComment);

router.patch("/comment/:id/unlike", auth, commentController.unLikeComment);



export default router;
