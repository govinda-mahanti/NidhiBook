import express from "express";
import {
  createAdmin,
  getAdminProfile,
  getAllUsers,
  deleteUser,
} from "../controllers/adminController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/create-admin", createAdmin);
router.get("/profile", authMiddleware, getAdminProfile);
router.get("/users", authMiddleware, getAllUsers);
router.delete("/user/:id", authMiddleware, deleteUser);

export default router;