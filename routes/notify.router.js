import express from "express";

import { notifyCtrl } from "../controllers/notify.controller.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/notify", auth, notifyCtrl.createNotify);

router.delete("/notify/:id", auth, notifyCtrl.removeNotify);

router.get("/notifies", auth, notifyCtrl.getNotifies);

router.patch("/isReadNotify/:id", auth, notifyCtrl.isReadNotify);

router.delete("/deleteAllNotify", auth, notifyCtrl.deleteAllNotifies);

export default router;
