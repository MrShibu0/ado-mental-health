import express from "express";
import { 
  getGalleryItems, getGalleryItemById, uploadGalleryItem, 
  updateGalleryItem, deleteGalleryItem, restoreGalleryItem, 
  getRecycleBinItems, bulkDeleteGalleryItems, getGalleryAnalytics,
  getSystemImages, getGalleryItemReferences, replaceGalleryImage
} from "../controllers/gallery.controller.js";
import { authenticate, authorize } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Public routes
router.get("/gallery", getGalleryItems);
router.get("/gallery/system-images", getSystemImages);
router.get("/gallery/:id", getGalleryItemById);

// Protected routes (authenticate all, authorize Editor/Admin/Super Admin as needed)
router.post("/gallery/upload", authenticate, upload.single("file"), uploadGalleryItem);
router.put("/gallery/:id", authenticate, updateGalleryItem);
router.put("/gallery/:id/replace", authenticate, upload.single("file"), replaceGalleryImage);
router.get("/gallery/:id/references", authenticate, getGalleryItemReferences);

// Soft delete / permanent delete routes
// Editors can soft-delete but only super-admin/admin can permanently delete (handled inside controller via RBAC verification or authorize)
router.delete("/gallery/:id", authenticate, deleteGalleryItem);

// Recycle Bin & Restores
router.get("/gallery/recycle-bin", authenticate, authorize(["super-admin", "admin"]), getRecycleBinItems);
router.post("/gallery/:id/restore", authenticate, authorize(["super-admin", "admin"]), restoreGalleryItem);
router.post("/gallery/bulk-delete", authenticate, bulkDeleteGalleryItems);

// Analytics
router.get("/gallery/analytics", authenticate, getGalleryAnalytics);

export default router;
