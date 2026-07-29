import express from "express";
import { logVisit, getDashboardStats, getVisitorAnalytics } from "../controllers/analytics.controller.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// Public route to log client visits
router.post("/analytics/visit", logVisit);

// Protected routes (available to Admins and Super Admins)
router.get("/analytics/dashboard", authenticate, authorize(["super-admin", "admin"]), getDashboardStats);
router.get("/analytics/visitors", authenticate, authorize(["super-admin", "admin"]), getVisitorAnalytics);

export default router;
