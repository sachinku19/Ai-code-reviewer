import User from "../models/User.js";
import Setting from "../models/Setting.js";
import ReviewHistory from "../models/ReviewHistory.js";
import asyncHandler from "../utils/asyncHandler.js";

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatarColor: user.avatarColor,
  plan: user.plan,
  bio: user.bio,
  createdAt: user.createdAt
});

export const getProfile = asyncHandler(async (req, res) => {
  const settings = await Setting.findOneAndUpdate(
    { user: req.user._id },
    { $setOnInsert: { user: req.user._id } },
    { upsert: true, new: true }
  );
  const totalReviews = await ReviewHistory.countDocuments({ user: req.user._id });
  const averageScore = await ReviewHistory.aggregate([
    { $match: { user: req.user._id } },
    { $group: { _id: null, score: { $avg: "$score" } } }
  ]);
  res.json({ user: publicUser(req.user), settings, stats: { totalReviews, averageScore: Math.round(averageScore[0]?.score || 0) } });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const allowed = ["name", "bio", "avatarColor", "plan"];
  for (const key of allowed) {
    if (req.body[key] !== undefined) req.user[key] = req.body[key];
  }
  const saved = await req.user.save();
  res.json({ user: publicUser(saved) });
});

export const getSettings = asyncHandler(async (req, res) => {
  const settings = await Setting.findOneAndUpdate(
    { user: req.user._id },
    { $setOnInsert: { user: req.user._id } },
    { upsert: true, new: true }
  );
  res.json({ settings });
});

export const updateSettings = asyncHandler(async (req, res) => {
  const allowed = ["defaultLanguage", "autoSaveReviews", "denseMode", "emailReports", "aiPersonality", "themeAccent"];
  const payload = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) payload[key] = req.body[key];
  }
  const settings = await Setting.findOneAndUpdate({ user: req.user._id }, payload, { new: true, upsert: true });
  res.json({ settings });
});
