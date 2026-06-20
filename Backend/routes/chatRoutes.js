import express from "express";
import { chatWithAI, financeChatWithAI } from "../controllers/chatControllers.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/chat", chatWithAI);
router.post("/finance-chat", authMiddleware, financeChatWithAI);

export default router;