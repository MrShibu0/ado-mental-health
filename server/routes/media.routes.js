import express from "express";
import { uploadMedia, getMediaList, deleteMedia } from "../controllers/media.controller.js";
import { authenticate, authorize } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// All media endpoints are protected
router.post("/media/upload", authenticate, upload.single("file"), uploadMedia);
router.get("/media", authenticate, getMediaList);
// Only super-admin and admin can delete media (Editor role blocked)
router.delete("/media/:id", authenticate, authorize(["super-admin", "admin"]), deleteMedia);

export default router;
