import express from "express";
import { 
  getNewsList, getNewsBySlug, createNewsArticle, 
  updateNewsArticle, deleteNewsArticle, getArticleVersions, rollbackArticleVersion 
} from "../controllers/news.controller.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/news", getNewsList);
router.get("/news/:slug", getNewsBySlug);

// Protected routes (available to Editors, Admins, and Super Admins)
router.post("/news", authenticate, createNewsArticle);
router.put("/news/:id", authenticate, updateNewsArticle);

// Only Admins and Super Admins can delete news articles
router.delete("/news/:id", authenticate, authorize(["super-admin", "admin"]), deleteNewsArticle);

// Version history & rollbacks
router.get("/news/:id/versions", authenticate, getArticleVersions);
router.post("/news/:id/rollback/:versionNumber", authenticate, rollbackArticleVersion);

export default router;
