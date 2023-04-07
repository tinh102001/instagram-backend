import express from "express";

import { messageController } from "../controllers/message.controller.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/message", auth, messageController.createMessage);

router.get("/conversations", auth, messageController.getConversations);

router.get("/message/:id", auth, messageController.getMessages);

router.delete("/message/:id", auth, messageController.deleteMessages);

router.delete("/conversation/:id", auth, messageController.deleteConversation);

export default router;
