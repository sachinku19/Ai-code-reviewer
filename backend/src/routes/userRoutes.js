import express from "express";
import { getProfile, getSettings, updateProfile, updateSettings } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.get("/settings", protect, getSettings);
router.put("/settings", protect, updateSettings);

export default router;
