import express from "express";
import { getPartners, createPartner, updatePartner, deletePartner } from "../controllers/partner.controller.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/partners", getPartners);

// Protected routes (available to Editors, Admins, and Super Admins)
router.post("/partners", authenticate, createPartner);
router.put("/partners/:id", authenticate, updatePartner);

// Only Admins and Super Admins can delete partners
router.delete("/partners/:id", authenticate, authorize(["super-admin", "admin"]), deletePartner);

export default router;
