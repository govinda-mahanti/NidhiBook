import express from "express";
import {
  login,
  signup,
  getUserProfile,
  updateUserProfile,
  updatePassword,
} from "../controllers/authControllers.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/getprofile", authMiddleware, getUserProfile);
router.put("/updateprofile", authMiddleware, updateUserProfile);
router.put("/updatepassword", authMiddleware, updatePassword);
export default router;
