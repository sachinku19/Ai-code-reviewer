import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/authRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import historyRoutes from "./routes/historyRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL?.split(",") || "http://localhost:5173",
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.get("/", (req, res) => {
    res.send("Backend Running Successfully");
});
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 240,
    standardHeaders: true,
    legacyHeaders: false
  })
);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "AI Code Reviewer Pro", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/user", userRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
