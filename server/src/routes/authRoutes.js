import express from "express";
import rateLimit from "express-rate-limit";
import { signup, login } from "../controllers/authController.js";

const router = express.Router();

// ✅ Rate limiter (5 requests per minute)
const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5,
  message: "Too many attempts, try again later",
});

// APPLY limiter to auth routes
router.post("/signup", authLimiter, signup);
router.post("/login", authLimiter, login);

export default router;