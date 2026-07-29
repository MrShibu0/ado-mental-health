import express from "express";
import { 
  createCheckoutSession, handleWebhook, getDonations, getDonationStats 
} from "../controllers/donation.controller.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// Public routes for payment session creation and Stripe webhook processing
router.post("/create-checkout-session", createCheckoutSession);
router.post("/webhook", handleWebhook);

// Protected routes (Super Admin and Admin can view transactions history)
router.get("/donations", authenticate, authorize(["super-admin", "admin"]), getDonations);
router.get("/donations/stats", authenticate, authorize(["super-admin", "admin"]), getDonationStats);

export default router;
