import express from "express";
import { performSearch } from "../controllers/search.controller.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// Search routes are protected (Editor, Admin, Super Admin can search)
router.get("/admin/search", authenticate, performSearch);

export default router;
