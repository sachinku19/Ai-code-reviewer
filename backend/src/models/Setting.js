import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    defaultLanguage: { type: String, default: "javascript" },
    autoSaveReviews: { type: Boolean, default: true },
    denseMode: { type: Boolean, default: false },
    emailReports: { type: Boolean, default: false },
    aiPersonality: { type: String, enum: ["balanced", "strict", "mentor"], default: "balanced" },
    themeAccent: { type: String, default: "violet" }
  },
  { timestamps: true }
);

const Setting = mongoose.model("Setting", settingSchema);
export default Setting;
