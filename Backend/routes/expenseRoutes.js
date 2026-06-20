import express from "express";
import {
  addexpenses,
  getAllExpenses,
  deleteExpense,
  updateExpense
} from "../controllers/expenseController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add-expenses", authMiddleware, addexpenses);
router.get("/expenses", authMiddleware, getAllExpenses);
router.delete("/expenses/:id", authMiddleware, deleteExpense);
router.put("/update-expenses/:id", authMiddleware, updateExpense);

export default router;
