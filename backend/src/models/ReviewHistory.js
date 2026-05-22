import mongoose from "mongoose";

const reviewHistorySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    language: { type: String, required: true, default: "javascript" },
    action: { type: String, enum: ["review", "optimize", "explain"], required: true },
    code: { type: String, required: true },
    result: {
      summary: String,
      bugs: [String],
      suggestions: [String],
      optimizedCode: String,
      explanation: String,
      timeComplexity: String,
      spaceComplexity: String,
      bestPractices: [String],
      security: [String],
      rawMarkdown: String
    },
    score: { type: Number, min: 0, max: 100, default: 76 }
  },
  { timestamps: true }
);

const ReviewHistory = mongoose.model("ReviewHistory", reviewHistorySchema);
export default ReviewHistory;
