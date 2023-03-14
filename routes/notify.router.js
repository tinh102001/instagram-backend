import express from "express";

import { notifyController } from "../controllers/notify.controller.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/notify", auth, notifyController.createNotify);

router.get("/notifies", auth, notifyController.getNotifies);

router.delete("/notify/:id", auth, notifyController.removeNotify);

router.delete("/delete_all_notifies", auth, notifyController.deleteAllNotifies);

router.patch("/is_read_notify/:id", auth, notifyController.isReadNotify);

export default router;
