import express from "express";
import multer from "multer";
import { exportBackup, restoreBackup } from "../controllers/backup.controller.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();
const tempUpload = multer({ dest: "server/temp_uploads/" });

// Backup/Restore routes are super-admin only
router.get("/backup/export", authenticate, authorize(["super-admin"]), exportBackup);
router.post("/backup/restore", authenticate, authorize(["super-admin"]), tempUpload.single("file"), restoreBackup);

export default router;
