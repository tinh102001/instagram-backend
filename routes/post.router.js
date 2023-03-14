import express from "express";

import { postController } from "../controllers/post.controller.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/posts", auth, postController.createPost);
router.get("/posts", auth, postController.getPosts);

router.patch("/post/:id", auth, postController.updatePost);
router.get("/post/:id", auth, postController.getPost);
router.delete("/post/:id", auth, postController.deletePost);

router.patch("/post/:id/like", auth, postController.likePost);

router.patch("/post/:id/unlike", auth, postController.unLikePost);

router.get("/user_posts/:id", auth, postController.getUserPosts);

router.get("/explore_posts", auth, postController.getExplorePosts);

router.patch("/save_post/:id", auth, postController.savePost);

router.patch("/unsave_post/:id", auth, postController.unSavePost);

router.get("/get_save_posts", auth, postController.getSavePosts);

export default router;
