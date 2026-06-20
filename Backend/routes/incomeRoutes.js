import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  addIncome,
  getAllIncome,
  deleteIncome,
  updateIncome,
} from "../controllers/incomeControllers.js";

const router = express.Router();
router.post("/add-income", authMiddleware, addIncome);
router.get("/income", authMiddleware, getAllIncome);
router.delete("/income/:id", authMiddleware, deleteIncome);
router.put("/income/:id", authMiddleware, updateIncome);

export default router;
