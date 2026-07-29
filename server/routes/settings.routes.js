import express from "express";
import { getSettings, updateSettings } from "../controllers/settings.controller.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// Public route to view settings
router.get("/settings", getSettings);

// Protected update settings route (super-admin only)
router.put("/settings", authenticate, authorize(["super-admin"]), updateSettings);

export default router;
