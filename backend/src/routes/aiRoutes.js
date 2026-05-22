import express from "express";
import { explainCode, optimizeCode, reviewCode } from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/review", protect, reviewCode);
router.post("/optimize", protect, optimizeCode);
router.post("/explain", protect, explainCode);

export default router;
