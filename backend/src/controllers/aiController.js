import ReviewHistory from "../models/ReviewHistory.js";
import Setting from "../models/Setting.js";
import asyncHandler from "../utils/asyncHandler.js";
import { analyzeCode } from "../services/aiService.js";

const runAnalysis = (action) =>
  asyncHandler(async (req, res) => {
    const { code, language = "javascript", title } = req.body;
    if (!code?.trim()) {
      res.status(400);
      throw new Error("Code is required");
    }

    const result = await analyzeCode({ code, language, action });
    const settings = await Setting.findOne({ user: req.user._id });
    let history = null;
    if (settings?.autoSaveReviews !== false) {
      history = await ReviewHistory.create({
        user: req.user._id,
        title: title || `${language} ${action}`,
        language,
        action,
        code,
        result,
        score: result.score
      });
    }

    res.json({ result, historyId: history?._id || null });
  });

export const reviewCode = runAnalysis("review");
export const optimizeCode = runAnalysis("optimize");
export const explainCode = runAnalysis("explain");
