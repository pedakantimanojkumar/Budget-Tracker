import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getStatsSummary } from "../controllers/statsController.js";

const router = express.Router();

router.get("/summary", authMiddleware, getStatsSummary);

export default router;