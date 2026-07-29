import express from "express";
import { 
  login, logout, verify, refresh, updateProfile, 
  getActivities, getUsers, createUser, deleteUser 
} from "../controllers/admin.controller.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/admin/login", login);
router.post("/admin/logout", logout);
router.post("/admin/refresh", refresh);

// Protected routes
router.get("/admin/verify", authenticate, verify);
router.put("/admin/profile", authenticate, updateProfile);

// Audit logs (accessible by super-admin and admin)
router.get("/admin/activities", authenticate, authorize(["super-admin", "admin"]), getActivities);

// Admin user management (super-admin only)
router.get("/admin/users", authenticate, authorize(["super-admin"]), getUsers);
router.post("/admin/users", authenticate, authorize(["super-admin"]), createUser);
router.delete("/admin/users/:id", authenticate, authorize(["super-admin"]), deleteUser);

export default router;
