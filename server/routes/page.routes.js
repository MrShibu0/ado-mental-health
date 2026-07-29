import express from "express";
import { 
  getPageSection, getPageContent, updatePageSection, 
  getSectionVersions, rollbackSectionVersion 
} from "../controllers/page.controller.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = express.Router();

// Public routes to retrieve layouts
router.get("/pages/:page/:locale", getPageContent);
router.get("/pages/:page/:section/:locale", getPageSection);

// Protected routes to modify section layouts (accessible by Editors, Admins, and Super Admins)
router.put("/pages/:page/:section/:locale", authenticate, updatePageSection);
router.get("/pages/:page/:section/:locale/versions", authenticate, getSectionVersions);
router.post("/pages/:page/:section/:locale/rollback/:versionNumber", authenticate, rollbackSectionVersion);

export default router;
