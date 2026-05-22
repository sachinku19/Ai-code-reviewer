import express from "express";
import { clearHistory, deleteHistoryItem, getHistoryItem, listHistory } from "../controllers/historyController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, listHistory);
router.delete("/", protect, clearHistory);
router.get("/:id", protect, getHistoryItem);
router.delete("/:id", protect, deleteHistoryItem);

export default router;
