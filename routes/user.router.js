import express from "express";

import { userController } from "../controllers/user.controller.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/search", auth, userController.searchUser);

router.get("/user/:id", auth, userController.getUser);

router.patch("/user", auth, userController.updateUser);

router.patch("/user/:id/follow", auth, userController.follow);

router.patch("/user/:id/unfollow", auth, userController.unfollow);

router.get("/suggestions_users", auth, userController.suggestionsUser);

export default router;
