import ReviewHistory from "../models/ReviewHistory.js";
import asyncHandler from "../utils/asyncHandler.js";

export const listHistory = asyncHandler(async (req, res) => {
  const items = await ReviewHistory.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(100);
  res.json({ items });
});

export const getHistoryItem = asyncHandler(async (req, res) => {
  const item = await ReviewHistory.findOne({ _id: req.params.id, user: req.user._id });
  if (!item) {
    res.status(404);
    throw new Error("Review not found");
  }
  res.json({ item });
});

export const deleteHistoryItem = asyncHandler(async (req, res) => {
  const deleted = await ReviewHistory.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!deleted) {
    res.status(404);
    throw new Error("Review not found");
  }
  res.json({ message: "Review deleted" });
});

export const clearHistory = asyncHandler(async (req, res) => {
  await ReviewHistory.deleteMany({ user: req.user._id });
  res.json({ message: "History cleared" });
});
