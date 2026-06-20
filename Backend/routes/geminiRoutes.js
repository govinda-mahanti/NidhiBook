import express from "express";
import { generateGeminiResponse } from "../controllers/geminiControllers.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/suggestions", authMiddleware, generateGeminiResponse);

export default router;
