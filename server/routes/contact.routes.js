import express from "express";
import { 
  submitContactForm, getContactMessages, updateMessageStatus, replyToMessage, deleteMessage 
} from "../controllers/contact.controller.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// Public route to submit contact form
router.post("/contact", submitContactForm);

// Protected routes (Admins and Super Admins can manage inbox)
router.get("/contact/messages", authenticate, authorize(["super-admin", "admin"]), getContactMessages);
router.put("/contact/messages/:id", authenticate, authorize(["super-admin", "admin"]), updateMessageStatus);
router.post("/contact/messages/:id/reply", authenticate, authorize(["super-admin", "admin"]), replyToMessage);
router.delete("/contact/messages/:id", authenticate, authorize(["super-admin", "admin"]), deleteMessage);

export default router;
